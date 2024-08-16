import WebSocket from 'ws';
import sqlite3, { Database } from 'sqlite3';
import { open } from 'sqlite'
import { ipcMain } from 'electron';
import { v4 } from 'uuid';

import { ChatState } from 'types/chat';
import { getSelectedView } from '../browser';
import { createRunner } from './runner';
import { setState } from '../BonBon_Global_State';

let memory: Database
let ws: WebSocket;
let reconnectInterval: any;
let isConnected = false;

// Setup in-memory SQLite database
const makeMemoryDb = async () => {
    memory = await open({
        filename: ':memory:',
        driver: sqlite3.Database
    }) as unknown as Database

    await memory.exec(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL,
        username TEXT NOT NULL,
        magic TEXT,
        webrtcOffer TEXT,
        registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
}

makeMemoryDb()

const url = 'ws://echo.websocket.events/echo/BonBon/public_place';

let forProxyConnect: () => void;
export const getForProxyConnect = () => forProxyConnect;

const uuidv4 = v4()
const userProxy = new Proxy({ username: "", magic: "", uuid: uuidv4, isRegistered: false, webrtcOffer: "" }, {
    set(target, property, value) {
        if (property === 'username' && target[property] !== value) {
            target[property] = value;
            console.log(`Username changed to: ${value}`);
        }
        if (property === "magic") {
            target[property] = value;
            console.log(`Magic changed to: ${value}`);
        }
        if (property === "isRegistered") {
            target[property] = value;
            console.log(`isReigstered changed to: ${value}`);
        }
        if (property === "webrtcOffer") {
            target[property] = value;
            console.log(`webrtcOffer changed to: ${value}`);
        }

        return true;
    },
    get(target, property) {
        return ["username", "magic", "uuid"].includes(property.toString()) ? target[property.toString() as "username" | "magic" | "uuid"] : null;
    }
});

const unregistrationMessage = JSON.stringify({ event: 'unregister', usr: userProxy.username }); // Format your message``

const buildConnectionRequestMessage = (target: string, webrtcParticipant: string, username: string, magic: string) => JSON.stringify({ event: 'connection-request', target, webrtcParticipant, username, magic })

const setUsername = (usr: string) => {
    userProxy.username = usr
    console.log({ usr })
}

const setMagic = (mgc: string) => {
    userProxy.magic = mgc
    console.log({ mgc })
}

// Function to add a new user
const registerUser = async ({ username, magic, uuid }: { username: string, magic: string, uuid: string }) => {
    console.log('registerUser', { username, uuid });
    await makeMemoryDb();
    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await memory.get("SELECT * FROM users WHERE username = ? AND magic = ? AND uuid = ?", [username, magic, uuid]);

        if (existingUser) {
            console.log(`User ${username} already exists`);
        } else {
            // Insérer l'utilisateur seulement s'il n'existe pas encore
            await memory.run("INSERT INTO users (username, magic, uuid) VALUES (?, ?, ?)", [username, magic, uuid]);
            console.log(`User ${username} registered`);
        }
    } catch (err: unknown) {
        console.error("Error registering user:", err);
    }
};

// Function to remove a user
const unregisterUser = async ({username, magic, uuid}: { username: string, magic: string, uuid: string }) => {
    await makeMemoryDb()
    try {
        await memory.run("DELETE FROM users WHERE username = ? AND magic = ? AND uuid = ?", [username, magic, uuid]);
        console.log(`User ${username} unregistered`);
    } catch (err: unknown) {
        console.error("Error unregistering user:", err);
    }
}

// Function to list all registered users
const listUsers = async (callback: (users: Database) => any) => {
    await makeMemoryDb()
    try {
        const rows = await memory.all("SELECT * FROM users");
        callback(rows);
    } catch (err: unknown) {
        console.error("Error listing users:", err);
    }
}

const shakeHandWith = async (usr: string) => {
    await makeMemoryDb()
    await memory.all("SELECT webrtcOffer FROM users WHERE username = ?", [usr], (rows: { webrtcOffer: string }[]) => {
        getSelectedView()?.webContents.send('create-webrtc-participant', { webrtcOffer: rows[0].webrtcOffer, usr })
        ipcMain.on('created-webrtc-participants', (_event, args: { webrtcParticipant: string }) => {
            const connectionMessage = buildConnectionRequestMessage(usr, `${args.webrtcParticipant}`, userProxy.username, userProxy.magic)
            ws.send(connectionMessage);
        })
    });

}
const connect = async () => {
    console.log('======= websocket connect ========')
    if (isConnected) return;
    await makeMemoryDb()

    const reconnect = () => {
        console.log('======= Attempting to reconnect in 5 seconds...=======');
        reconnectInterval = setInterval(connect, 5000);
    }
    
    ws = new WebSocket(url, {
        rejectUnauthorized: false // Allow self-signed certificates if needed
    });

    ws.on('open', () => {
        console.log('::::: Connected to echo server');
        getSelectedView()?.webContents.send('create-webrtc-offer')

        ipcMain.on('created-webrtc-offer', (_event, webrtcOffer: string) => {
            userProxy.webrtcOffer = webrtcOffer
            console.log('======== ipcEvent: created-webrtc-offer =========')
            console.log(JSON.stringify(userProxy))
            if (userProxy.username && userProxy.magic && userProxy.uuid && userProxy.isRegistered !== true) {
            console.log('======== ipcEvent: creating registration message =========')
                const registrationMessage = JSON.stringify({ event: 'register', username: userProxy.username, magic: userProxy.magic, webrtcOffer, uuid: userProxy.uuid }); // Format your message
                ws.send(registrationMessage);
                clearInterval(reconnectInterval); // Clear reconnect interval if connected
                isConnected = true;
                registerUser({username: userProxy.username, magic: userProxy.magic, uuid: userProxy.uuid});
                userProxy.isRegistered = true
            }
        });
    });

    ws.on('message', async (message) => {
        console.log(':::::: websocket message:', message.toString());

        try {
            const parsedMessage = JSON.parse(message.toString());
            if (parsedMessage.username === userProxy.username && parsedMessage.magic === userProxy.magic) {
                return
            }
            if (parsedMessage.event === 'register') {
                console.log('====== message: register =========')
                const { username, magic, uuid } = parsedMessage;
                if (userProxy.username === username && userProxy.magic === magic) ws.send(JSON.stringify({event: 'refuse-new-user', ...parsedMessage}))
                else await registerUser({username, magic, uuid});
            } else if (parsedMessage.event === 'unregister') {
                console.log('====== message: unregister =========')
                const { username, magic, uuid } = parsedMessage;
                await unregisterUser({username, magic, uuid});
            } else if (parsedMessage.event === 'connection-request' && parsedMessage.target === userProxy.username && parsedMessage.username && parsedMessage.magic) {
                console.log('====== message: connection-request =========')
                if (parsedMessage.magic === userProxy.magic && parsedMessage.username === userProxy.username) {
                    getSelectedView()?.webContents.send('connection-request', { webrtcParticipant: parsedMessage.webrtcParticipant })
                } else {
                    getSelectedView()?.webContents.send('unauthorized-attempt-to-contact-you', { ...parsedMessage })
                }
            } else if (parsedMessage.event === 'refuse-new-user') {
                console.log('====== message: refuse new user =========')
                const { username, magic, uuid } = parsedMessage;
                await unregisterUser({username, magic, uuid});
                if (username === userProxy.username && magic === userProxy.magic && uuid === userProxy.uuid) {
                    getSelectedView()?.webContents.send('chat-combo-taken');
                }
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
        unregisterUser({username: userProxy.username, magic: userProxy.magic, uuid: userProxy.uuid});
        reconnect(); // Attempt to reconnect on close
    });
}

forProxyConnect = connect

const initChat = () => {
    // connect();
}

const endChat = () => {
    if (ws) {
        ws.send(unregistrationMessage);
        ws.close();
    }
}

const setChatState = (state: ChatState) => {
    setState('chat', state)
}

// Export the listUsers function for external usage
export { listUsers, initChat, endChat, shakeHandWith, setUsername, setMagic, createRunner, setChatState };
