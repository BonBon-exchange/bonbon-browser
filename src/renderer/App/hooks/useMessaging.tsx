/* eslint-disable consistent-return */
// src/hooks/useMessaging.ts

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  ref,
  push,
  off,
  onChildAdded,
  onValue,
  set,
  onDisconnect,
  query,
  orderByChild,
  limitToLast,
  startAt,
  get,
} from 'firebase/database';
import { ChatMessage, User } from 'types/messaging';
import { database } from '../firebase';
import { useSettings } from './useSettings'; // Assuming you have a settings hook
import { useAppDispatch } from '../store/hooks'; // Assuming you use Redux or similar
import { setSetting } from '../store/reducers/Settings'; // Redux action to set settings

export const useMessaging = () => {
  const settings = useSettings();
  const dispatch = useAppDispatch();

  const [user, setUser] = useState<User>({
    id: settings['chat.userId'] ?? uuidv4(),
    username:
      settings['chat.username'] ??
      `User_${(settings['chat.userId'] ?? '').slice(0, 5)}`,
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);

  const [latestMessageTimestamp, setLatestMessageTimestamp] = useState<
    number | null
  >(null);

  const [roomId, setRoomId] = useState<string>('public');

  // Update settings on username or user ID change
  useEffect(() => {
    dispatch(setSetting({ key: 'chat.username', value: user.username }));
    dispatch(setSetting({ key: 'chat.userId', value: user.id }));
  }, [dispatch, user.username, user.id]);

  // Function to load the latest 500 messages
  const loadMessages = useCallback(async () => {
    const messagesRef = ref(database, `chatrooms/${roomId}/messages`);

    // Query to load the latest 500 messages
    const messagesQuery = query(
      messagesRef,
      orderByChild('timestamp'),
      limitToLast(500)
    );

    try {
      const snapshot = await get(messagesQuery);
      const messagesData = snapshot.val() || {};

      const messagesList = Object.keys(messagesData).map((key) => {
        const msg = messagesData[key] as ChatMessage;
        return {
          ...msg,
          id: msg.id || key, // Ensure each message has a unique id
          timestamp:
            typeof msg.timestamp === 'number' ? msg.timestamp : Date.now(),
        };
      });

      // Sort messages by timestamp ascending
      messagesList.sort((a, b) => a.timestamp - b.timestamp);

      setMessages(messagesList);

      if (messagesList.length > 0) {
        setLatestMessageTimestamp(
          messagesList[messagesList.length - 1].timestamp
        );
      } else {
        setLatestMessageTimestamp(null);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, [roomId]);

  // Initial load of messages and whenever roomId changes
  useEffect(() => {
    setMessages([]); // Clear existing messages when room changes
    loadMessages();
  }, [loadMessages, roomId]);

  // Listen for new messages in real-time
  useEffect(() => {
    if (latestMessageTimestamp === null) {
      // If no messages loaded yet, set latestMessageTimestamp to current time
      setLatestMessageTimestamp(Date.now());
      return;
    }

    const messagesRef = ref(database, `chatrooms/${roomId}/messages`);
    const newMessagesQuery = query(
      messagesRef,
      orderByChild('timestamp'),
      startAt(latestMessageTimestamp + 1)
    );

    const handleNewMessage = (snapshot: any) => {
      const message: ChatMessage = snapshot.val();
      // Ensure the new message has an id
      const messageWithId = {
        ...message,
        id: message.id || snapshot.key,
      };
      setMessages((prevMessages) => [...prevMessages, messageWithId]);
      setLatestMessageTimestamp(message.timestamp);
    };

    onChildAdded(newMessagesQuery, handleNewMessage);

    // Cleanup listener on unmount or when latestMessageTimestamp or roomId changes
    return () => {
      off(newMessagesQuery, 'child_added', handleNewMessage);
    };
  }, [roomId, latestMessageTimestamp]);

  // Function to send messages
  const sendMessage = (text: string) => {
    const messagesRef = ref(database, `chatrooms/${roomId}/messages`);
    const newMessageRef = push(messagesRef);
    const message: ChatMessage = {
      id: newMessageRef.key!, // Use Firebase's unique key as the id
      userId: user.id,
      username: user.username,
      message: text,
      timestamp: Date.now(), // Use Date.now() to keep timestamp as number
    };
    set(newMessageRef, message);
  };

  // Handle user presence and connection state
  useEffect(() => {
    const userStatusDatabaseRef = ref(
      database,
      `chatrooms/${roomId}/users/${user.id}`
    );

    const connectedRef = ref(database, '.info/connected');

    const onConnectedValueChange = (snapshot: any) => {
      if (snapshot.val() === false) {
        return;
      }

      // When connected, set up the onDisconnect handler
      onDisconnect(userStatusDatabaseRef)
        .remove()
        .catch((error) => {
          console.error('Failed to set onDisconnect:', error);
        });

      // Also, ensure that user is marked as online upon connection
      set(userStatusDatabaseRef, {
        username: user.username,
        state: 'online',
        lastChanged: Date.now(), // Use Date.now() instead of serverTimestamp()
      });
    };

    onValue(connectedRef, onConnectedValueChange);

    // Listen for changes in connected users
    const usersRef = ref(database, `chatrooms/${roomId}/users`);
    const onUsersValueChange = (snapshot: any) => {
      const usersData = snapshot.val() || {};
      const usersList = Object.keys(usersData).map((uid) => ({
        id: uid,
        username: usersData[uid].username,
        state: usersData[uid].state,
      }));
      setConnectedUsers(usersList);
    };

    onValue(usersRef, onUsersValueChange);

    // Cleanup listeners on unmount or when roomId or user.id changes
    return () => {
      off(connectedRef, 'value', onConnectedValueChange);
      off(usersRef, 'value', onUsersValueChange);
      // Do not remove userStatusDatabaseRef here to preserve onDisconnect
    };
  }, [roomId, user.id, user.username]);

  // Update user presence when username changes
  useEffect(() => {
    if (!user) return;

    const userStatusDatabaseRef = ref(
      database,
      `chatrooms/${roomId}/users/${user.id}`
    );

    // Update the user's presence data in the database
    set(userStatusDatabaseRef, {
      username: user.username,
      state: 'online',
      lastChanged: Date.now(), // Use Date.now() to keep timestamp as number
    }).catch((error) => {
      console.error('Error updating user presence:', error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, user.username]);

  return {
    sendMessage,
    messages,
    setUser,
    userId: user.id,
    user,
    connectedUsers,
    roomId,
    setRoomId,
  };
};
