import WebSocket from 'ws';
import sqlite3, { Database } from 'sqlite3';
import { open } from 'sqlite'

// Setup in-memory SQLite database
let memory: Database

// webrtc peerconnection
const peerConnection = new RTCPeerConnection();
let webrtcDataChannel: RTCDataChannel = peerConnection.createDataChannel("BonBon/public_place");
let webrtcOffer

peerConnection.oniceconnectionstatechange = function (e: unknown) {
    const state = peerConnection.iceConnectionState;
    console.log('oniceconnectionstatechange', { e, state })
};

peerConnection.onicecandidate = function (e) {
    console.log('onicecandidate', { e })
};

peerConnection.ondatachannel = function (e) {
    webrtcDataChannel = e.channel;
    webrtcDataChannel.onopen = () => {
        console.log('ondatachannel/onopen/connected')
    }
    webrtcDataChannel.onmessage = function (onMessageEvent) {
        console.log('onmessage', { onMessageEvent })
    }
};

(async () => {
    webrtcOffer = await peerConnection.createOffer()

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
const registrationMessage = JSON.stringify({ event: 'register', username: myId, magic: "420", webrtcOffer }); // Format your message
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
    const sdpConstraints = { optional: [{ RtpDataChannels: true }] };
    await memory.all("SELECT webrtcOffer FROM users WHERE username = ?", [username], (rows: { webrtcOffer: string }[]) => {
        const offerDesc = new RTCSessionDescription(rows[0].webrtcOffer as unknown as RTCSessionDescriptionInit);
        peerConnection.setRemoteDescription(offerDesc)
        peerConnection.createAnswer(sdpConstraints).then((answerDesc) => {
            peerConnection.setLocalDescription(answerDesc)
            const connectionMessage = buildConnectionRequestMessage(username, `${answerDesc}`)
            ws.send(connectionMessage);
            return true
        })
            .catch((e: unknown) => console.log({ e }))
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
        ws.send(registrationMessage);
        clearInterval(reconnectInterval); // Clear reconnect interval if connected
        isConnected = true;
        registerUser(myId, "420");
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
                const answerDesc = new RTCSessionDescription(JSON.parse(parsedMessage.webrtcParticipant));
                peerConnection.setRemoteDescription(answerDesc);
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
    connect();
}

const endChat = () => {
    ws.send(unregistrationMessage);
    ws.close();
}

// Export the listUsers function for external usage
export { listUsers, initChat, endChat, shakeHandWith };
