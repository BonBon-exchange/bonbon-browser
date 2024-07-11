import { createRoot } from 'react-dom/client';

import { App } from './App';
import { ChatState } from 'types/chat';
import { IpcRendererEvent } from 'electron';

try {
  let bonbon_chat_state: ChatState = { username: '', isMagic: false };

  const handleChatState = (
    _e: IpcRendererEvent,
    args: {
      chatState: ChatState;
    }
  ) => {
    console.log({ args });
    bonbon_chat_state = args.chatState;
    root.render(<App chatState={bonbon_chat_state} />);
  };

  window.app.listener.chatState(handleChatState);

  const container = document.getElementById('root')!;
  const root = createRoot(container);
  root.render(<App chatState={bonbon_chat_state} />);
} catch (e) {
  window.app.off.chatState();
}
