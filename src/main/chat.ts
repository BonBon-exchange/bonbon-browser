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

const myId = "dannybengal"; // Replace with your actual ID
const unregistrationMessage = JSON.stringify({ event: 'unregister', username: myId }); // Format your message``

const buildConnectionRequestMessage = (target: string, webrtcParticipant: string) => JSON.stringify({ event: 'connection-request', target, webrtcParticipant })

let ws: WebSocket;
let reconnectInterval: any;
let isConnected = false;

// Function to add a new user
const registerUser = async (username: string, magic: string) => {
    try {
        await memory.run("INSERT INTO users (username, magic) VALUES (?, ?)", [username, magic]);
        console.log(`User ${username} registered`);
    } catch (err: unknown) {
        console.error("Error registering user:", err);
    }
}

// Function to remove a user
const unregisterUser = async (username: string) => {
    try {
        await memory.run("DELETE FROM users WHERE username = ?", [username]);
        console.log(`User ${username} unregistered`);
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

const shakeHandWith = async (username: string) => {
    await memory.all("SELECT webrtcOffer FROM users WHERE username = ?", [username], (rows: { webrtcOffer: string }[]) => {
        getSelectedView()?.webContents.send('create-webrtc-participant', { webrtcOffer: rows[0].webrtcOffer, username })
        ipcMain.on('created-webrtc-participants', (_event, args: { webrtcParticipant: string }) => {
            const connectionMessage = buildConnectionRequestMessage(username, `${args.webrtcParticipant}`)
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
            const registrationMessage = JSON.stringify({ event: 'register', username: myId, magic: "420", webrtcOffer: args.webrtcOffer }); // Format your message
            ws.send(registrationMessage);
            clearInterval(reconnectInterval); // Clear reconnect interval if connected
            isConnected = true;
            registerUser(myId, "420");
        });
    });

    ws.on('message', async (message) => {
        console.log('Received echo:', message.toString());

        try {
            const parsedMessage = JSON.parse(message.toString());
            if (parsedMessage.event === 'register') {
                const { username, magic } = parsedMessage;
                await registerUser(username, magic);
            } else if (parsedMessage.event === 'unregister') {
                const { username } = parsedMessage;
                await unregisterUser(username);
            } else if (parsedMessage.event === 'connection-request' && parsedMessage.target === myId) {
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
        unregisterUser(myId);
        reconnect(); // Attempt to reconnect on close
    });
}

const initChat = () => {
    //connect();
}

const endChat = () => {
    ws.send(unregistrationMessage);
    ws.close();
}

// Export the listUsers function for external usage
export { listUsers, initChat, endChat, shakeHandWith };
