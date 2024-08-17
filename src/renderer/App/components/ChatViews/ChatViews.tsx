/* eslint-disable jsx-a11y/click-events-have-key-events */
import clsx from 'clsx'
import { ChatMessage, ChatRunnerId } from 'types/chat';
// import EscapeTag from '../EscapeTag/EscapeTag';

import './ChatViews.scss';
import { useChat } from 'renderer/App/hooks/useChat';

export default () => {
  const chat = useChat()
  const runners = chat?.runners ?? {};

  const refuseChatConnectionRequest = () => {
    window.app.chat.refuseConnectionRequest()
  }

  const acceptChatConnectionRequest = () => {
    window.app.chat.acceptConnectionRequest()
  }

  return (
    <>
      {Object.keys(runners).map((runnerId: ChatRunnerId) => (
          <div className={clsx('chat-view', {'selected': chat.visibleRunner === runnerId})} key={`${runnerId}`}>
            {
              runners[runnerId].action === 'contact' && 
              runners[runnerId].context.isContactRequest && !runners[runnerId].context.isAccepted && (
                <>
                  <div className='chat-view-info'>{runners[runnerId].context.username} @ {runners[runnerId].context.magic} wants to contact you.</div>
                  <div className='chat-view-confirm'>
                    <div className='chat-view-confirm-accept' onClick={acceptChatConnectionRequest}>Accept</div>
                    <div className='chat-view-confirm-refuse' onClick={refuseChatConnectionRequest}>Refuse</div>
                  </div>
                </>
              ) 
            }

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
