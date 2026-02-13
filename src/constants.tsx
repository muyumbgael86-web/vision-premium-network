import { User, Post, Story, Product } from './types';

export const DEFAULT_USER: User = {
  id: 'me',
  firstName: '',
  lastName: '',
  name: '',
  username: '',
  avatar: 'https://picsum.photos/seed/vision_default/200/200',
  isVerified: false,
  followers: [],
  following: []
};

export const INITIAL_STORIES: Story[] = [];
export const INITIAL_POSTS: Post[] = [];
export const INITIAL_REELS: Post[] = [];
export const INITIAL_NEWS: Post[] = [];

export const MOCK_PRODUCTS: Product[] = [];
