import clsx from 'clsx';

import './style.scss';
import { useCallback, useState, useEffect } from 'react';

export default () => {
  const [isStateMessageReceived, setIsStateMessageReiceived] =
    useState<boolean>(false);

  const messageReceivedAction = useCallback(() => {
    setIsStateMessageReiceived(true);
    setTimeout(() => setIsStateMessageReiceived(false), 300);
  }, [setIsStateMessageReiceived]);

  useEffect(() => {
    window.app.listener.chatMessageReceived(messageReceivedAction);
    return () => {
      window.app.off.chatMessageReceived();
    };
  }, [messageReceivedAction]);

  return (
    <div
      id="chat-bar"
      className={clsx({ 'message-received': isStateMessageReceived })}
    />
  );
};
