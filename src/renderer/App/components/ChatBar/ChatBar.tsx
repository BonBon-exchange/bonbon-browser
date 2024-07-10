import clsx from 'clsx';

import './style.scss';
import {
  useCallback,
  useState,
  useEffect,
  useRef,
  KeyboardEventHandler,
  Dispatch,
  SetStateAction,
} from 'react';

type ChatStateProps = {
  username: string;
  isMagic: boolean;
  setChatState: Dispatch<
    SetStateAction<{ username: string; isMagic: boolean }>
  >;
};

export default (props: ChatStateProps) => {
  const chatBarRef = useRef<HTMLDivElement>(null);
  const magicInputRef = useRef<HTMLInputElement>(null);
  const [isStateMessageReceived, setIsStateMessageReiceived] =
    useState<boolean>(false);
  const [shouldEnhighChatbar, setShouldEnhighChatbar] =
    useState<boolean>(false);
  const [username, setUsername] = useState<string>(props.username ?? '');
  const [usernameHasBeenSet, setUsernameHasBeenSet] = useState<boolean>(
    Number(props?.username?.length) > 0
  );
  const [magic, setMagic] = useState<string>('');
  const [magicHasBeenSet, setMagicHasBeenSet] = useState<boolean>(
    props.isMagic ?? false
  );
  const [componentChatState, setComponentChatState] = useState<{
    username: string;
    isMagic: boolean;
  }>({
    username: '',
    isMagic: false,
  });
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
  }, [mouseMoveAction]);

  useEffect(() => {
    if (usernameHasBeenSet) magicInputRef.current?.focus();
  }, [usernameHasBeenSet, magicInputRef]);

  useEffect(() => {
    const currentState = componentChatState;
    currentState.username = username;
    currentState.isMagic = magicHasBeenSet;
    setComponentChatState(currentState);
  }, [
    username,
    magic,
    componentChatState,
    magicHasBeenSet,
    setComponentChatState,
  ]);

  useEffect(() => {
    props.setChatState(componentChatState);
  }, [componentChatState, props]);

  useEffect(() => {
    setUsernameHasBeenSet(Number(props?.username?.length) > 0);
    setMagicHasBeenSet(props?.isMagic ?? false);
  }, [props, setUsernameHasBeenSet, setMagicHasBeenSet]);

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
