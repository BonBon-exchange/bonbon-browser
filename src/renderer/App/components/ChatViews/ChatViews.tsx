import { ChatRunnerId, ChatState } from 'types/chat';

export const ChatViews = ({ chatState }: { chatState: ChatState }) => {
  console.log({ chatState });
  const runners = chatState.runners ?? {};
  return (
    <>
      {Object.keys(chatState.runners ?? {}).map((runnerId: ChatRunnerId) => (
        <>
          <div id="chat-view-420" key={runnerId}>
            {JSON.stringify(runners[runnerId ?? {}])}
          </div>
        </>
      ))}
    </>
  );
};
