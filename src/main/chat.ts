import WebSocket from 'ws'

const url = 'ws://echo.websocket.events/echo/BonBon/public_place';

const myId = "unique_user_id_123"; // Replace with your actual ID
const registrationMessage = JSON.stringify({ event: 'register', userId: myId }); // Format your message
const unregistrationMessage = JSON.stringify({ event: 'unregister', userId: myId }); // Format your message

let ws: WebSocket;
let reconnectInterval: any;
let isConnected = false

const connect = () => {
    if (isConnected) return

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
        isConnected = true
    });

    ws.on('message', (message) => {
        console.log('Received echo:', message.toString());
        // Process received echoes (other users' IDs, etc.) here
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        reconnect(); // Attempt to reconnect on error
    });

    ws.on('close', (code, reason) => {
        console.log('WebSocket closed:', code, reason);
        reconnect(); // Attempt to reconnect on close
    });
}

export const initChat = () => {
    connect()
}

export const endChat = () => {
    ws.send(unregistrationMessage);
    ws.close()
}