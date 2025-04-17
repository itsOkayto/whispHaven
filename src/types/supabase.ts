
import { Database } from "@/integrations/supabase/types";

// Extend Supabase types with our own application-specific types
export type Tables = Database['public']['Tables'];

// Post type definition
export interface Post {
  id: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'text';
  createdAt: Date;
  likes: number;
  comments: number;
  userId?: string;
  userAvatar?: string;
  userEmoji?: string;
  reactions?: {
    happy: number;
    sad: number;
    angry: number;
    surprised: number;
  };
  isFlagged?: boolean;
  isPookieOfDay?: boolean;
}

// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  emoji: string;
  isIncognito: boolean;
}

// Comment type definition
export interface Comment {
  id: string;
  postId: string;
  content: string;
  createdAt: Date;
  userId?: string;
  userAvatar?: string;
  userEmoji?: string;
}

// Reaction types
export type ReactionType = 'happy' | 'sad' | 'angry' | 'surprised';
export type PostType = 'image' | 'video' | 'text' | 'all';
