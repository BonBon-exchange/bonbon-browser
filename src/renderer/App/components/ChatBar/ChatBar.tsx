import clsx from 'clsx';

import './style.scss';
import { useCallback, useState, useEffect, useRef } from 'react';

export default () => {
  const chatBarRef = useRef<HTMLDivElement>(null);
  const [isStateMessageReceived, setIsStateMessageReiceived] =
    useState<boolean>(false);
  const [shouldEnhighChatbar, setShouldEnhighChatbar] =
    useState<boolean>(false);
  const messageReceivedAction = useCallback(() => {
    setIsStateMessageReiceived(true);
    setTimeout(() => setIsStateMessageReiceived(false), 300);
  }, [setIsStateMessageReiceived]);

  const mouseMoveAction = useCallback((e: MouseEvent) => {
    const cb = chatBarRef.current?.getBoundingClientRect();
    const distance = Number(cb?.top) - e.clientY;
    distance < 100
      ? setShouldEnhighChatbar(true)
      : setShouldEnhighChatbar(false);
  }, []);

  useEffect(() => {
    window.app.listener.chatMessageReceived(messageReceivedAction);
    return () => {
      window.app.off.chatMessageReceived();
    };
  }, [messageReceivedAction]);

  useEffect(() => {
    window.addEventListener('mousemove', mouseMoveAction);
    return () => {
      window.removeEventListener('mousemove', mouseMoveAction);
    };
  });

  return (
    <div
      id="chat-bar"
      ref={chatBarRef}
      className={clsx({
        'message-received': isStateMessageReceived,
        'user-is-close': shouldEnhighChatbar,
      })}
    />
  );
};
