/* eslint-disable jsx-a11y/label-has-associated-control */
// src/components/Chat/Chat.tsx

import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { CloseButton } from '../CloseButton/CloseButton';
import { Popup } from '../Popup/Popup';
import { useMessaging } from '../../hooks/useMessaging';
import { ChatProps } from './Types';

import './style.scss';

export const Chat = ({ handleClose }: ChatProps) => {
  const { t } = useTranslation();
  const {
    sendMessage,
    messages,
    userId,
    connectedUsers,
    user,
    setUser,
    roomId,
    setRoomId,
  } = useMessaging();

  const [inputValue, setInputValue] = useState('');
  const [showUsernamePopup, setShowUsernamePopup] = useState(false);
  const [showRoomPopup, setShowRoomPopup] = useState(false);
  const [newUsername, setNewUsername] = useState(user.username);
  const [newRoom, setNewRoom] = useState(roomId);
  const [usernameError, setUsernameError] = useState('');
  const [roomError, setRoomError] = useState('');

  // Ref to the messages container
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Function to handle sending messages
  const handleSend = () => {
    if (inputValue.trim() !== '') {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  // Function to open username popup
  const handleChangeUsername = () => {
    setShowUsernamePopup(true);
    setUsernameError(''); // Clear any previous errors
  };

  // Function to open room popup
  const handleChangeRoom = () => {
    setShowRoomPopup(true);
    setRoomError(''); // Clear any previous errors
  };

  // Function to close popups
  const closePopups = () => {
    setShowUsernamePopup(false);
    setShowRoomPopup(false);
    setUsernameError('');
    setRoomError('');
  };

  // Function to handle username change
  const handleUsernameChange = () => {
    if (newUsername.trim() !== '') {
      setUser({ ...user, username: newUsername });
      setShowUsernamePopup(false);
      setUsernameError('');
    } else {
      setUsernameError(t('Username cannot be empty.'));
    }
  };

  // Function to handle room change
  const handleRoomChange = () => {
    if (newRoom.trim() !== '') {
      setRoomId(newRoom.trim());
      setShowRoomPopup(false);
      setRoomError('');
    } else {
      setRoomError(t('Room name cannot be empty.'));
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // Update newRoom state when roomId changes externally
  useEffect(() => {
    setNewRoom(roomId);
  }, [roomId]);

  // Deduplicate messages
  const uniqueMessages = useMemo(() => {
    const seenIds = new Set<string>();
    return messages.filter((msg) => {
      if (seenIds.has(msg.id)) {
        return false;
      }
      seenIds.add(msg.id);
      return true;
    });
  }, [messages]);

  return (
    <div id="Chat__container">
      <CloseButton handleClose={handleClose} />
      <div id="Chat__centered-container">
        <div id="Chat__header">
          <h2>
            {t('Chat')}: {roomId}
          </h2>
          <div className="Chat__options-dropdown">
            <button type="button" className="Chat__options-button">
              {t('Options')} ▼
            </button>
            <div className="Chat__options-dropdown-content">
              <button type="button" onClick={handleChangeUsername}>
                {t('Change Username')}
              </button>
              <button type="button" onClick={handleChangeRoom}>
                {t('Change Room')}
              </button>
            </div>
          </div>
        </div>
        {/* Change Username Popup */}
        {showUsernamePopup && (
          <Popup closePopup={closePopups} title={t('Change Username')}>
            <div id="Chat__username-popup">
              <input
                id="username-input"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUsernameChange();
                }}
              />
              {usernameError && (
                <p className="Chat__error-message">{usernameError}</p>
              )}
              <button type="button" onClick={handleUsernameChange}>
                {t('Save')}
              </button>
            </div>
          </Popup>
        )}
        {/* Change Room Popup */}
        {showRoomPopup && (
          <Popup closePopup={closePopups} title={t('Change Room')}>
            <div id="Chat__room-popup">
              <input
                id="room-input"
                type="text"
                value={newRoom}
                onChange={(e) => setNewRoom(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRoomChange();
                }}
              />
              {roomError && <p className="Chat__error-message">{roomError}</p>}
              <button type="button" onClick={handleRoomChange}>
                {t('Save')}
              </button>
            </div>
          </Popup>
        )}
        <div id="Chat__content">
          <div id="Chat__chatroom">
            <div id="Chat__messages" ref={messagesContainerRef}>
              {uniqueMessages.length === 0 ? (
                <p>{t('No messages in this room yet.')}</p>
              ) : (
                uniqueMessages.map((msg) => (
                  <div
                    key={msg.id} // Ensure msg.id is unique and defined
                    className={`Chat__message ${
                      msg.userId === userId ? 'Chat__message--self' : ''
                    }`}
                  >
                    <div className="Chat__message-header">
                      <strong>{msg.username}</strong> at{' '}
                      <span className="Chat__timestamp">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      : {msg.message}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div id="Chat__input-container">
              <input
                type="text"
                value={inputValue}
                placeholder={t('Type your message...')}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
              />
              <button type="button" onClick={handleSend}>
                {t('Send')}
              </button>
            </div>
          </div>
          <div id="Chat__users-list">
            <h3>
              {t('Connected Users')} ({connectedUsers.length})
            </h3>
            <div className="Chat__users-list-content">
              {connectedUsers.map((userItem) => (
                <div key={userItem.id} className="Chat__user-item">
                  {userItem.username}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
