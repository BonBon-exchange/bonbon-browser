import { getSelectedView } from "./browser";

const messageReceivedAction = () => {
    getSelectedView()?.webContents?.send('chat-message-received');
}

setInterval(() => {
    messageReceivedAction()
}, 3000)