import EmptyTag from '../EmptyTag/EmptyTag';
import { ChatRunnerId, ChatState } from 'types/chat';

export const ChatViews = ({ chatState }: { chatState: ChatState }) => {
  const runners = chatState.runners ?? {};

  return (
    <>
      {Object.keys(chatState.runners ?? {}).map((runnerId: ChatRunnerId) => (
        <EmptyTag key={`${runnerId}`}>
          <div id="chat-view-420">
            {JSON.stringify(runners[runnerId ?? {}])}
          </div>
        </EmptyTag>
      ))}
    </>
  );
};
