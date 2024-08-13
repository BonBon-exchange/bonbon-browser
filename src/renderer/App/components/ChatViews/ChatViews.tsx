import clsx from 'clsx'
import { ChatMessage, ChatRunnerId } from 'types/chat';
// import EscapeTag from '../EscapeTag/EscapeTag';

import './ChatViews.scss';
import { useChat } from 'renderer/App/hooks/useChat';

export default () => {
  const chat = useChat()
  const runners = chat?.runners ?? {};

  return (
    <>
      {Object.keys(runners).map((runnerId: ChatRunnerId) => (
          <div className={clsx('chat-view', {'selected': chat.visibleRunner === runnerId})} key={`${runnerId}`}>
            {
              runners[runnerId].action === 'contact' && 
              runners[runnerId].context.messages?.map((message: ChatMessage) => (
                <div key={message.timestamp} className={clsx('chat-view-message', {'message-by-self': message.senderMagic === chat.magic && message.senderUsername === chat.username})}>
                  {message.content}
                </div>
                
              )) 
            }
          </div>
      ))}
    </>
  );
};
