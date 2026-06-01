export type TierId = 'none' | 'basic' | 'scale' | 'masterclass';

export interface MembershipTier {
  id: TierId;
  name: string;
  price: string;
  period: string;
  badgeColor: string;
  features: string[];
  description: string;
  popular?: boolean;
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: 'boilerplate' | 'guide' | 'video' | 'template';
  requiredTier: TierId;
  duration?: string; // for videos
  downloadFileName?: string;
  url?: string;
}

export interface ForumPost {
  id: string;
  title: string;
  authorName: string;
  authorRole: string;
  authorTier: TierId;
  content: string;
  category: 'idea-validation' | 'marketing' | 'tech-stack' | 'general' | 'qa';
  createdAt: string;
  likes: number;
  replies: ForumReply[];
}

export interface ForumReply {
  id: string;
  authorName: string;
  authorRole: string;
  authorTier: TierId;
  content: string;
  createdAt: string;
}

export interface BookingSlot {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  isAvailable: boolean;
}

export interface SystemUser {
  name: string;
  email: string;
  tier: TierId;
  isSubscribed: boolean;
}
