import type { User } from './user';

export interface Mention {
  userId: number;
  position: number;
  length: number;
}

export interface MessageViewConfirmation {
  userId: number;
  viewedAt: string;
}

export interface Message {
  id: number;
  content: string;
  channel: 'geral' | 'setor' | 'individual';
  sender: User;
  targetUserId?: number;
  createdAt: string;
  updatedAt: string;
  read: boolean;
  reactions: MessageReaction[];
  mentions: Mention[];
  requiresConfirmation: boolean;
  viewConfirmations: MessageViewConfirmation[];
  parentMessageId?: number;
  replies?: Message[];
}

export interface MessageReaction {
  type: string;
  count: number;
  active: boolean;
}

export interface CreateMessageDto {
  content: string;
  channel: 'geral' | 'setor' | 'individual';
  targetUserId?: number;
  requiresConfirmation?: boolean;
  parentMessageId?: number;
}

export interface UpdateMessageDto {
  content?: string;
  read?: boolean;
} 