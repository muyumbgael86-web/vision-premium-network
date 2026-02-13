import { Post, User, Story, Product } from '../types';
import { supabase } from './supabaseClient';

export interface CloudState {
  posts: Post[];
  users: User[];
  stories: Story[];
  products: Product[];
  messages: any[];
}

// Synchronisation avec Supabase
export const syncWithCloud = async (localState: Partial<CloudState>): Promise<CloudState | null> => {
  try {
    // 1. Récupération de l'état cloud actuel depuis Supabase
    const [postsResult, usersResult, storiesResult, productsResult, messagesResult] = await Promise.all([
      supabase.from('posts').select('*').order('timestamp', { ascending: false }).limit(50),
      supabase.from('users').select('*'),
      supabase.from('stories').select('*').gt('timestamp', Date.now() - 86400000),
      supabase.from('products').select('*'),
      supabase.from('messages').select('*').order('timestamp', { ascending: false }).limit(100)
    ]);

    if (postsResult.error) throw postsResult.error;

    const cloudState: CloudState = {
      posts: (postsResult.data || []).map(transformPostToLocal),
      users: (usersResult.data || []).map(transformUserToLocal),
      stories: (storiesResult.data || []).map(transformStoryToLocal),
      products: (productsResult.data || []).map(transformProductToLocal),
      messages: messagesResult.data || []
    };

    // 2. Fusion intelligente (Merge)
    const updatedState: CloudState = {
      posts: mergeItems(cloudState.posts, localState.posts || []),
      users: mergeItems(cloudState.users, localState.users || []),
      stories: mergeItems(cloudState.stories, localState.stories || []),
      products: mergeItems(cloudState.products, localState.products || []),
      messages: mergeItems(cloudState.messages, localState.messages || [])
    };

    // 3. Sauvegarde sur Supabase (Push) si données locales présentes
    if (localState.posts?.length || localState.users?.length || localState.messages?.length) {
      await pushToSupabase(localState);
    }

    return updatedState;
  } catch (error) {
    console.error("Vision Cloud Engine Error:", error);
    return null;
  }
};

// Push des données locales vers Supabase
async function pushToSupabase(localState: Partial<CloudState>) {
  try {
    // Upsert posts
    if (localState.posts?.length) {
      for (const post of localState.posts) {
        const dbPost = transformPostToDB(post);
        await supabase.from('posts').upsert(dbPost).ignoreDuplicates();
      }
    }

    // Upsert users
    if (localState.users?.length) {
      for (const user of localState.users) {
        const dbUser = transformUserToDB(user);
        await supabase.from('users').upsert(dbUser).ignoreDuplicates();
      }
    }

    // Upsert stories
    if (localState.stories?.length) {
      for (const story of localState.stories) {
        const dbStory = transformStoryToDB(story);
        await supabase.from('stories').upsert(dbStory).ignoreDuplicates();
      }
    }

    // Upsert products
    if (localState.products?.length) {
      for (const product of localState.products) {
        const dbProduct = transformProductToDB(product);
        await supabase.from('products').upsert(dbProduct).ignoreDuplicates();
      }
    }
  } catch (error) {
    console.error("Push to Supabase Error:", error);
  }
}

// Fonctions de transformation Post
function transformPostToLocal(dbPost: any): Post {
  return {
    id: dbPost.id,
    author: {
      id: dbPost.author_id,
      firstName: '',
      lastName: '',
      name: dbPost.author_id,
      avatar: 'https://picsum.photos/seed/' + dbPost.author_id + '/200/200',
      username: dbPost.author_id,
      followers: [],
      following: []
    },
    type: dbPost.type,
    contentUrl: dbPost.content_url,
    caption: dbPost.caption,
    title: dbPost.title,
    source: dbPost.source,
    likes: dbPost.likes || [],
    comments: dbPost.comments || [],
    shares: dbPost.shares || 0,
    views: dbPost.views || 0,
    timestamp: dbPost.timestamp,
    category: dbPost.category as any
  };
}

function transformPostToDB(post: Post) {
  return {
    id: post.id,
    author_id: post.author.id,
    type: post.type,
    content_url: post.contentUrl,
    caption: post.caption,
    title: post.title,
    source: post.source,
    likes: post.likes,
    comments: post.comments,
    shares: post.shares,
    views: post.views,
    timestamp: post.timestamp,
    category: post.category
  };
}

// Fonctions de transformation User
function transformUserToLocal(dbUser: any): User {
  return {
    id: dbUser.id,
    firstName: dbUser.first_name || '',
    lastName: dbUser.last_name || '',
    name: dbUser.name,
    avatar: dbUser.avatar,
    username: dbUser.username,
    email: dbUser.email,
    isAdmin: dbUser.is_admin,
    isVerified: dbUser.is_verified,
    certificationStatus: dbUser.certification_status,
    followers: dbUser.followers || [],
    following: dbUser.following || []
  };
}

function transformUserToDB(user: User) {
  return {
    id: user.id,
    first_name: user.firstName,
    last_name: user.lastName,
    name: user.name,
    avatar: user.avatar,
    username: user.username,
    email: user.email,
    is_admin: user.isAdmin || false,
    is_verified: user.isVerified || false,
    certification_status: user.certificationStatus || 'none',
    followers: user.followers,
    following: user.following
  };
}

// Fonctions de transformation Story
function transformStoryToLocal(dbStory: any): Story {
  return {
    id: dbStory.id,
    user: {
      id: dbStory.user_id,
      firstName: '',
      lastName: '',
      name: dbStory.user_id,
      avatar: 'https://picsum.photos/seed/' + dbStory.user_id + '/200/200',
      username: dbStory.user_id,
      followers: [],
      following: []
    },
    imageUrl: dbStory.image_url,
    type: dbStory.type,
    viewed: dbStory.viewed,
    views: dbStory.views,
    timestamp: dbStory.timestamp
  };
}

function transformStoryToDB(story: Story) {
  return {
    id: story.id,
    user_id: story.user.id,
    image_url: story.imageUrl,
    type: story.type,
    viewed: story.viewed,
    views: story.views,
    timestamp: story.timestamp
  };
}

// Fonctions de transformation Product
function transformProductToLocal(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    price: dbProduct.price,
    image: dbProduct.image,
    category: dbProduct.category,
    description: dbProduct.description,
    currency: dbProduct.currency
  };
}

function transformProductToDB(product: Product) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category,
    description: product.description,
    currency: product.currency
  };
}

// Fonction de fusion
function mergeItems(cloudItems: any[], localItems: any[]) {
  const map = new Map();
  [...cloudItems, ...localItems].forEach(item => {
    if (item && item.id) {
      const existing = map.get(item.id);
      map.set(item.id, { ...existing, ...item });
    }
  });
  return Array.from(map.values())
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, 50);
}
