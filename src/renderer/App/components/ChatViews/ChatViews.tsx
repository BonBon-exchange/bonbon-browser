import { ChatRunnerId, ChatState } from 'types/chat';
// import EscapeTag from '../EscapeTag/EscapeTag';

import './ChatViews.scss';

export default ({ chatState }: { chatState: ChatState }) => {
  const runners = chatState.runners ?? {};

  return (
    <>
      {Object.keys(runners).map((runnerId: ChatRunnerId) => (
          <div id="chat-view" className="CDXX" key={`${runnerId}`}>
            {JSON.stringify(runners[runnerId ?? {}])}
          </div>
      ))}
    </>
  );
};
