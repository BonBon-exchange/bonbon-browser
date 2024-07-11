import EscapeTag from '../EscapeTag/EscapeTag';
import { ChatRunnerId, ChatState } from 'types/chat';

import './ChatViews.scss';

export const ChatViews = ({ chatState }: { chatState: ChatState }) => {
  const runners = chatState.runners ?? {};

  return (
    <>
      {Object.keys(chatState.runners ?? {}).map((runnerId: ChatRunnerId) => (
        <EscapeTag key={`${runnerId}`}>
          <div id="chat-view" className="CDXX">
            {JSON.stringify(runners[runnerId ?? {}])}
          </div>
        </EscapeTag>
      ))}
    </>
  );
};
