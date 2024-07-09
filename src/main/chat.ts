import WebSocket from 'ws';
import sqlite3, { Database } from 'sqlite3';
import { open } from 'sqlite'
import { ipcMain } from 'electron';
import { getSelectedView } from './browser';

// Setup in-memory SQLite database
let memory: Database

(async () => {
    memory = await open({
        filename: ':memory:',
        driver: sqlite3.Database
    }) as unknown as Database

    await memory.exec(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        magic TEXT,
        webrtcOffer TEXT,
        registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
})();

const url = 'ws://echo.websocket.events/echo/BonBon/public_place';

let forProxyConnect: () => void;

const userProxy = new Proxy({ username: "", magic: "" }, {
    set(target, property, value) {
        if (property === 'username' && target[property] !== value) {
            const wasEmpty = target[property] === "";
            target[property] = value;
            console.log(`Username changed to: ${value}`);
            if (wasEmpty) {
                forProxyConnect();
            }
        }
        if (property === "magic") {
            target[property] = value;
            console.log(`Magic changed to: ${value}`);
        }
        return true;
    },
    get(target, property) {
        return ["username", "magic"].includes(property.toString()) ? target[property.toString() as "username" | "magic"] : null;
    }
});

// const unregistrationMessage = JSON.stringify({ event: 'unregister', usr: username }); // Format your message``

const buildConnectionRequestMessage = (target: string, webrtcParticipant: string) => JSON.stringify({ event: 'connection-request', target, webrtcParticipant })

const setUsername = (usr: string) => {
    userProxy.username = usr
    console.log({ usr })
}

const setMagic = (mgc: string) => {
    userProxy.magic = mgc
    console.log({ mgc })
}

let ws: WebSocket;
let reconnectInterval: any;
let isConnected = false;

// Function to add a new user
const registerUser = async (usr: string, magic: string) => {
    try {
        await memory.run("INSERT INTO users (username, magic) VALUES (?, ?)", [usr, magic]);
        console.log(`User ${usr} registered`);
    } catch (err: unknown) {
        console.error("Error registering user:", err);
    }
}

// Function to remove a user
const unregisterUser = async (usr: string) => {
    try {
        await memory.run("DELETE FROM users WHERE username = ?", [usr]);
        console.log(`User ${usr} unregistered`);
    } catch (err: unknown) {
        console.error("Error unregistering user:", err);
    }
}

// Function to list all registered users
const listUsers = async (callback: (users: Database) => any) => {
    try {
        const rows = await memory.all("SELECT * FROM users");
        callback(rows);
    } catch (err: unknown) {
        console.error("Error listing users:", err);
    }
}

const shakeHandWith = async (usr: string) => {
    await memory.all("SELECT webrtcOffer FROM users WHERE username = ?", [usr], (rows: { webrtcOffer: string }[]) => {
        getSelectedView()?.webContents.send('create-webrtc-participant', { webrtcOffer: rows[0].webrtcOffer, usr })
        ipcMain.on('created-webrtc-participants', (_event, args: { webrtcParticipant: string }) => {
            const connectionMessage = buildConnectionRequestMessage(usr, `${args.webrtcParticipant}`)
            ws.send(connectionMessage);
        })
    });

}
const connect = () => {
    if (isConnected) return;

    const reconnect = () => {
        console.log('Attempting to reconnect in 5 seconds...');
        reconnectInterval = setInterval(connect, 5000);
    }

    ws = new WebSocket(url, {
        rejectUnauthorized: false // Allow self-signed certificates if needed
    });

    ws.on('open', () => {
        console.log('Connected to echo server');
        getSelectedView()?.webContents.send('create-webrtc-offer')

        ipcMain.on('created-webrtc-offer', (_event, args: { webrtcOffer: string }) => {
            console.log('created webrtc offer', { args })
            const registrationMessage = JSON.stringify({ event: 'register', usr: userProxy.username, magic: "420", webrtcOffer: args.webrtcOffer }); // Format your message
            ws.send(registrationMessage);
            clearInterval(reconnectInterval); // Clear reconnect interval if connected
            isConnected = true;
            registerUser(userProxy.username, "420");
        });
    });

    ws.on('message', async (message) => {
        console.log('Received echo:', message.toString());

        try {
            const parsedMessage = JSON.parse(message.toString());
            if (parsedMessage.event === 'register') {
                const { usr, magic } = parsedMessage;
                await registerUser(usr, magic);
            } else if (parsedMessage.event === 'unregister') {
                const { usr } = parsedMessage;
                await unregisterUser(usr);
            } else if (parsedMessage.event === 'connection-request' && parsedMessage.target === userProxy.username) {
                getSelectedView()?.webContents.send('connection-request', { webrtcParticipant: parsedMessage.webrtcParticipant })
            }
        } catch (error) {
            console.error("Error processing message:", error);
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        isConnected = false;
        reconnect(); // Attempt to reconnect on error
    });

    ws.on('close', (code, reason) => {
        console.log('WebSocket closed:', code, reason);
        isConnected = false;
        unregisterUser(userProxy.username);
        reconnect(); // Attempt to reconnect on close
    });
}

forProxyConnect = connect

const initChat = () => {
    // connect();
}

const endChat = () => {
    // ws.send(unregistrationMessage);
    // ws.close();
}

// Export the listUsers function for external usage
export { listUsers, initChat, endChat, shakeHandWith, setUsername, setMagic };
