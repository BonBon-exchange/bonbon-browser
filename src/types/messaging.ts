// src/types/types.ts

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: number;
}

export interface User {
  id: string;
  username: string;
}
