import clsx from 'clsx';

import './style.scss';
import {
  useCallback,
  useState,
  useEffect,
  useRef,
  KeyboardEventHandler,
} from 'react';

export default ({
  state,
}: {
  state: {
    username?: string;
    isMagic?: boolean;
  };
}) => {
  const chatBarRef = useRef<HTMLDivElement>(null);
  const magicInputRef = useRef<HTMLInputElement>(null);
  const [isStateMessageReceived, setIsStateMessageReiceived] =
    useState<boolean>(false);
  const [shouldEnhighChatbar, setShouldEnhighChatbar] =
    useState<boolean>(false);
  const [username, setUsername] = useState<string>(state.username ?? '');
  const [usernameHasBeenSet, setUsernameHasBeenSet] = useState<boolean>(
    Number(state?.username?.length) > 0
  );
  const [magic, setMagic] = useState<string>('');
  const [magicHasBeenSet, setMagicHasBeenSet] = useState<boolean>(
    !!state.isMagic
  );
  // const [shouldShowMagicEffect, setShouldShowMagicEffect] =
  //  useState<boolean>(false);

  const userNameOnKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      window.app.chat.setUsername(username);
      setUsername('');
      setUsernameHasBeenSet(true);
    }
  };

  const magicOnKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      window.app.chat.setMagic(magic);
      setMagic('');
      setMagicHasBeenSet(true);
      // setShouldShowMagicEffect(true);
      setTimeout(() => {
        // setShouldShowMagicEffect(false);
      }, 400);
    }
  };

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

  useEffect(() => {
    if (usernameHasBeenSet) magicInputRef.current?.focus();
  }, [usernameHasBeenSet]);

  return (
    <div
      id="chat-bar"
      ref={chatBarRef}
      className={clsx({
        'message-received': isStateMessageReceived,
        'user-is-close': shouldEnhighChatbar,
        // 'magic-effect': shouldShowMagicEffect,
      })}
    >
      {!usernameHasBeenSet && (
        <input
          type="text"
          id="chat-bar-set-username"
          className={clsx({ hidden: !shouldEnhighChatbar })}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          onKeyDown={userNameOnKeyDown}
        />
      )}

      {usernameHasBeenSet && !magicHasBeenSet && (
        <input
          type="text"
          id="chat-bar-set-magic"
          ref={magicInputRef}
          className={clsx({ hidden: !shouldEnhighChatbar })}
          value={magic}
          onChange={(e) => setMagic(e.target.value)}
          placeholder="magic"
          onKeyDown={magicOnKeyDown}
        />
      )}
    </div>
  );
};
