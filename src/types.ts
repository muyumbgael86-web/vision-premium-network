export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  avatar: string;
  username: string;
  email?: string;
  bio?: string;
  isAdmin?: boolean;
  isVerified?: boolean;
  certificationStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  certificationData?: { category: string; reason: string; proof: string };
  followers: string[];
  following: string[];
  relationship?: 'Célibataire' | 'En couple' | 'Marié(e)' | 'Divorcé(e)' | 'Veuf(ve)' | 'En instance de divorce' | 'En cohabitation' | 'Union libre';
  religion?: string;
  education?: string;
  city?: string;
  favoriteMagazine?: string;
  widgets?: string[];
}

export type ContentCategory = 'Sport' | 'Info' | 'Savoir' | 'Divers';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  author: User;
  type: 'image' | 'video' | 'reel' | 'news';
  contentUrl: string;
  caption: string;
  title?: string;
  source?: string;
  likes: string[];
  comments: Comment[];
  shares: number;
  views: number;
  timestamp: number;
  category?: ContentCategory;
}

export interface VisionReport {
  id: string;
  postId: string;
  reporterId: string;
  reason: string;
  timestamp: number;
  postTitle?: string;
  postCaption?: string;
}

export interface VisionNotification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'news' | 'system' | 'message' | 'report';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  senderAvatar?: string;
  targetPostId?: string;
  targetChatId?: string;
}

export interface Story {
  id: string;
  user: User;
  imageUrl: string;
  type: 'image' | 'video';
  viewed: boolean;
  views: number;
  timestamp: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  currency: string;
}
