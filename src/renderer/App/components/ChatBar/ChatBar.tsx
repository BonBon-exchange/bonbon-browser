import clsx from 'clsx';

import './style.scss';
import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  KeyboardEventHandler,
} from 'react';

import { useAppDispatch } from 'renderer/App/store/hooks';
import { setChatState } from 'renderer/App/store/reducers/Chat';
import { useChat } from 'renderer/App/hooks/useChat';
import { ChatState } from '../../../../types/chat';

export default  () => {
  const dispatch = useAppDispatch()
  const chat = useChat();
  const chatBarRef = useRef<HTMLDivElement>(null);
  const magicInputRef = useRef<HTMLInputElement>(null);
  const inputContactMagicRef = useRef<HTMLInputElement>(null);
  const inputContactUsernameRef = useRef<HTMLInputElement>(null);
  const inputContactSendMessageRef = useRef<HTMLInputElement>(null);
  const [isStateMessageReceived, setIsStateMessageReiceived] =
    useState<boolean>(false);
  const [shouldEnhighChatbar, setShouldEnhighChatbar] =
    useState<boolean>(false);
  const [username, setUsername] = useState<string>(chat.username ?? '');
  const [inputUsername, setInputUsername] = useState<string>('');
  const [usernameHasBeenSet, setUsernameHasBeenSet] = useState<boolean>(
    Number(chat?.username?.length) > 0
  );
  const [magic, setMagic] = useState<string>('');
  const [magicHasBeenSet, setMagicHasBeenSet] = useState<boolean>(Number(chat?.magic?.length) > 0);
  const [componentChatState, setComponentChatState] = useState<ChatState>(chat);
  const [chatView, setChatView] = useState<string>('');
  const [inputContactUsername, setInputContactUsername] = useState<string>('');
  const [inputContactMagic, setInputContactMagic] = useState<string>('');
  const [contactSendMessageInputValue, setContactSendMessageInputValue] = useState<string>('');

  const setContactView = () => {
    setChatView('contact')
    inputContactUsernameRef.current?.focus()
  }

  const contactRun = async () => {
    await window.app.chat.createRunner({
      action: 'contact',
      context: {
        username: inputContactUsername,
        magic: inputContactMagic,
      },
    }, {
      isVisible: true
    });

    window.app.chat.contactPeer(inputContactUsername,inputContactMagic)

    setInputContactUsername('')
    setInputContactMagic('')
    setChatView(`home`);
    inputContactSendMessageRef.current?.focus()
  };

  const sendContactMessageOnKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (
      e.key === 'Enter' &&
      contactSendMessageInputValue.length > 0
    ) {
      window.app.chat.sendMessage(contactSendMessageInputValue);
      setContactSendMessageInputValue('')
    }
  }

  const contactMagicOnKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (
      e.key === 'Enter' &&
      inputContactMagic.length > 0 &&
      inputContactUsername.length > 0
    ) {
      contactRun();
    } else if (e.key === 'Enter' && inputContactMagic.length > 0) {
      inputContactUsernameRef.current?.focus();
    }
  };

  const contactUsernameOnKeyDown: KeyboardEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (
      e.key === 'Enter' &&
      inputContactUsername.length > 0 &&
      inputContactMagic.length === 0
    ) {
      inputContactMagicRef.current?.focus();
    } else if (e.key === 'Enter' && inputContactUsername.length > 0) {
      contactRun();
    }
  };

  const userNameOnKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' && inputUsername.length > 0) {
      window.app.chat.setUsername(inputUsername);
      setUsername(inputUsername);
      setInputUsername('');
      setUsernameHasBeenSet(true);
    }
  };

  const magicOnKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' && magic.length > 0) {
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
    distance < 25
      ? setShouldEnhighChatbar(true)
      : setShouldEnhighChatbar(false);
  }, []);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    callback: () => any
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      callback();
    }
  };

  const resetComponentState = () => {
    setUsernameHasBeenSet(false)
    setMagicHasBeenSet(false)
    setUsername('')
    setMagic('')
  }

  const chatComboTakenAction = useCallback(() => {
    window.app.chat.setUsername('');
    window.app.chat.setMagic('');
    resetComponentState()
  }, [])

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
    currentState.magic = magic;
    setComponentChatState(currentState);
  }, [
    username,
    magic,
    componentChatState,
    magicHasBeenSet,
    setComponentChatState,
  ]);

  useEffect(() => {
    const currentState = componentChatState;
    currentState.username = chat.username;
    currentState.magic = chat.magic;
  }, [chat.magic, chat.username, componentChatState]);

  useEffect(() => {
    setUsernameHasBeenSet(Number(chat?.username?.length) > 0);
    setMagicHasBeenSet(Number(chat?.magic?.length) > 0);
  }, [setUsernameHasBeenSet, setMagicHasBeenSet, chat?.username?.length, chat?.magic?.length]);

  useEffect(() => {
    if (chatView === '' && usernameHasBeenSet && magicHasBeenSet) {
      setChatView('home');
      inputContactUsernameRef.current?.focus();
    }
  }, [
    usernameHasBeenSet,
    magicHasBeenSet,
    chatView,
    setChatView,
    inputContactUsernameRef,
  ]);

  useEffect(() => {
    if (shouldEnhighChatbar !== chat.userIsCloseToChatBar) {
      dispatch(setChatState({...chat, userIsCloseToChatBar: shouldEnhighChatbar}))
    }
  }, [shouldEnhighChatbar, chat, dispatch])

  useEffect(() => {
    window.app.listener.chatComboTaken(chatComboTakenAction);
    return () => window.app.off.chatComboTaken();
  }, [chatComboTakenAction]);

  return (
    <div
      id="chat-bar"
      ref={chatBarRef}
      className={clsx({
        'message-received': isStateMessageReceived,
        'user-is-close': shouldEnhighChatbar,
        'is-chat-active': chat.isChatActive
        // 'magic-effect': shouldShowMagicEffect,
      })}
    >
      {!usernameHasBeenSet && (
        <input
          type="text"
          id="chat-bar-set-username"
          className={clsx({ hidden: !shouldEnhighChatbar }, 'chat-bar-register-input')}
          value={inputUsername}
          onChange={(e) => setInputUsername(e.target.value)}
          placeholder="username"
          onKeyDown={userNameOnKeyDown}
        />
      )}

      {!magicHasBeenSet &&
        usernameHasBeenSet && (
          <input
            type="text"
            id="chat-bar-set-magic"
            ref={magicInputRef}
            className={clsx({ hidden: !shouldEnhighChatbar }, 'chat-bar-register-input')}
            value={magic}
            onChange={(e) => setMagic(e.target.value)}
            placeholder="magic"
            onKeyDown={magicOnKeyDown}
          />
        )}

      {chatView === 'home' && !chat.visibleRunner && (
        <div id="chat-bar-home">
          <div
            className="chat-bar-home-item"
            onClick={() => setChatView('meet')}
            onKeyDown={(e) => handleKeyDown(e, () => setChatView('meet'))}
          >
            Meet
          </div>
          <div
            className="chat-bar-home-item"
            onClick={setContactView}
            onKeyDown={(e) => handleKeyDown(e, () => setContactView())}
          >
            Contact
          </div>
        </div>
      )}

      {chatView === 'home' && chat.visibleRunner !== null && (
        <div id="chat-bar-contact">
          <input
            type="text"
            id="chat-bar-contact-sendmessage-input"
            className="chat-bar-contact-input"
            ref={inputContactSendMessageRef}
            value={contactSendMessageInputValue}
            onChange={(e) => setContactSendMessageInputValue(e.target.value)}
            placeholder="send a message"
            onKeyDown={sendContactMessageOnKeyDown}
            disabled={chat.visibleRunner && chat.runners?.[chat.visibleRunner].context.isContactRequest && !chat.runners?.[chat.visibleRunner].context.isAccepted}
          />
        </div>
      )}

      {chatView === 'contact' && (
        <div id="chat-bar-contact">
          <input
            type="text"
            id="chat-bar-contact-username"
            className="chat-bar-contact-input"
            ref={inputContactUsernameRef}
            value={inputContactUsername}
            onChange={(e) => setInputContactUsername(e.target.value)}
            placeholder="username"
            onKeyDown={contactUsernameOnKeyDown}
          />
          <input
            type="text"
            id="chat-bar-contact-magic"
            className="chat-bar-contact-input"
            ref={inputContactMagicRef}
            value={inputContactMagic}
            onChange={(e) => setInputContactMagic(e.target.value)}
            placeholder="magic"
            onKeyDown={contactMagicOnKeyDown}
          />
        </div>
      )}
    </div>
  );
};
