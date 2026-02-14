import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import PostCard from './components/PostCard';
import StoryBar from './components/StoryBar';
import Reels from './components/Reels';
import Shop from './components/Shop';
import Messenger from './components/Messenger';
import Profile from './components/Profile';
import Actualite from './components/Actualite';
import UploadModal from './components/UploadModal';
import StoryViewer from './components/StoryViewer';
import LiveStream from './components/LiveStream';
import AdminDashboard from './components/AdminDashboard';
import Auth from './components/Auth';
import { Plus } from 'lucide-react';
import { Post, Story, User, VisionNotification } from './types';
import { syncWithCloud, CloudState } from './services/syncService';

const STORAGE_KEY = 'VISION_PERSISTENT_SESSION';

// Sample data for demo
const INITIAL_POSTS: Post[] = [
  {
    id: 'demo-1',
    author: { id: 'demo', name: 'Vision Demo', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop', username: 'vision_demo', followers: [], following: [] },
    type: 'image',
    contentUrl: 'https://picsum.photos/seed/vision1/1080/1080',
    caption: 'Bienvenue sur Vision! La nouvelle application sociale.',
    likes: ['user-1', 'user-2'],
    comments: [],
    shares: 5,
    views: 1000,
    timestamp: Date.now()
  },
  {
    id: 'demo-2',
    author: { id: 'demo', name: 'Vision Demo', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop', username: 'vision_demo', followers: [], following: [] },
    type: 'reel',
    contentUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    caption: 'Decouvrez les Reels sur Vision!',
    likes: ['user-1'],
    comments: [],
    shares: 2,
    views: 500,
    timestamp: Date.now() - 3600000
  }
];

const INITIAL_STORIES: Story[] = [
  {
    id: 'story-1',
    user: { id: 'demo', name: 'Vision Demo', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop', username: 'vision_demo', followers: [], following: [] },
    imageUrl: 'https://picsum.photos/seed/story1/1080/1920',
    type: 'image',
    viewed: false,
    views: 150,
    timestamp: Date.now()
  }
];

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeStoryUserId, setActiveStoryUserId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('vision_posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_POSTS;
      }
    }
    return INITIAL_POSTS;
  });

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('vision_stories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_STORIES;
      }
    }
    return INITIAL_STORIES;
  });

  const [products, setProducts] = useState<any[]>(() => {
    const saved = localStorage.getItem('vision_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [messages, setMessages] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<VisionNotification[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('vision_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('vision_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('vision_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('vision_stories', JSON.stringify(stories));
  }, [stories]);

  const syncEngine = useCallback(async () => {
    if (!user) return;
    setIsSyncing(true);

    try {
      const localState: Partial<CloudState> = {
        posts,
        users: [user],
        stories,
        products,
        messages
      };

      const cloudData = await syncWithCloud(localState);
      if (cloudData) {
        // Only update if we have data from cloud
        if (cloudData.posts.length > 0) {
          setPosts(cloudData.posts);
        }
        if (cloudData.stories.length > 0) {
          setStories(cloudData.stories);
        }
        if (cloudData.products.length > 0) {
          setProducts(cloudData.products);
        }
        if (cloudData.messages.length > 0) {
          setMessages(cloudData.messages);
        }
      }

      // Auto-verify admin user
      if (user.email === 'abrahamluboya2@gmail.com' && !user.isVerified) {
        setUser(prev => prev ? { ...prev, isVerified: true, isAdmin: true } : null);
      }
    } catch (error) {
      console.error('Sync error:', error);
    }
    setIsSyncing(false);
  }, [user, posts, stories, products, messages]);

  // Initial sync and periodic sync
  useEffect(() => {
    if (!user) return;
    syncEngine();
    const interval = setInterval(syncEngine, 60000); // Sync every minute
    return () => clearInterval(interval);
  }, [user, syncEngine]);

  // Save user session
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const handleCreatePost = useCallback((newPost: Post) => {
    console.log('Creating post:', newPost);
    
    // Create a complete post object with author
    const completePost: Post = {
      ...newPost,
      author: user ? {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        username: user.username || user.name,
        followers: user.followers || [],
        following: user.following || []
      } : newPost.author
    };

    // Add to posts array - new posts go to the beginning
    setPosts(prev => {
      const updated = [completePost, ...prev];
      localStorage.setItem('vision_posts', JSON.stringify(updated));
      return updated;
    });

    // Close modal
    setIsUploadOpen(false);

    // Add notification
    const notification: VisionNotification = {
      id: Date.now().toString(),
      type: 'share',
      message: 'Votre publication a ete enregistree!',
      timestamp: 'A l\'instant',
      read: false
    };
    setNotifications(prev => [notification, ...prev]);

    // Trigger sync
    setTimeout(() => {
      syncEngine();
    }, 1000);
  }, [user, syncEngine]);

  const handleLikePost = useCallback((postId: string) => {
    if (!user) return;
    
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = p.likes.includes(user.id);
        return {
          ...p,
          likes: isLiked 
            ? p.likes.filter(id => id !== user.id)
            : [...p.likes, user.id]
        };
      }
      return p;
    }));
  }, [user]);

  const handleComment = useCallback((postId: string, text: string) => {
    if (!user || !text.trim()) return;
    
    const comment = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      text: text.trim(),
      timestamp: Date.now().toString()
    };
    
    setPosts(prev => prev.map(p =>
      p.id === postId 
        ? { ...p, comments: [...p.comments, comment] }
        : p
    ));
  }, [user]);

  const handleUpdateUser = useCallback((updatedUser: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updatedUser } : null);
  }, []);

  const handleCreateStory = useCallback((newStory: Story) => {
    const completeStory: Story = {
      ...newStory,
      user: user ? {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        username: user.username || user.name,
        followers: user.followers || [],
        following: user.following || []
      } : newStory.user
    };

    setStories(prev => [completeStory, ...prev]);
    setIsUploadOpen(false);
  }, [user]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    navigate('/');
  }, [navigate]);

  // Show loading or auth if no user
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Auth onLogin={setUser} />
      </div>
    );
  }

  return (
    <Layout 
      user={user} 
      theme={theme} 
      setTheme={setTheme} 
      notifications={notifications} 
      onClearNotifications={() => setNotifications([])} 
      onLogout={logout}
    >
      <Routes>
        <Route path="/" element={
          <div className="space-y-4 pt-2">
            <StoryBar 
              stories={stories} 
              user={user} 
              onAddStory={() => setIsUploadOpen(true)} 
              onViewStory={setActiveStoryUserId} 
            />
            {posts
              .filter(p => p && !p.category && p.type !== 'reel')
              .map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={user.id}
                  isAdmin={user.isAdmin}
                  onLike={() => handleLikePost(post.id)}
                  onComment={(text) => handleComment(post.id, text)}
                  onShare={() => {}}
                  onDelete={user.isAdmin ? () => setPosts(prev => prev.filter(p => p.id !== post.id)) : undefined}
                  onView={() => setPosts(prev => prev.map(p => p.id === post.id ? { ...p, views: p.views + 1 } : p))}
                />
              ))}
          </div>
        } />
        <Route path="/reels" element={
          <Reels
            reels={posts.filter(p => p.type === 'reel')}
            currentUserId={user.id}
            onLike={handleLikePost}
            onComment={() => {}}
            onShare={() => {}}
          />
        } />
        <Route path="/actualite" element={
          <Actualite
            newsPosts={posts.filter(p => !!p.category)}
            user={user}
            onArticleCreated={handleCreatePost}
            onLike={handleLikePost}
            onComment={handleComment}
            onShare={() => {}}
            onView={() => {}}
          />
        } />
        <Route path="/shop" element={
          <Shop 
            products={products} 
            onProductsUpdate={setProducts} 
            user={user}
          />
        } />
        <Route path="/messenger" element={<Messenger user={user} />} />
        <Route path="/live" element={<LiveStream user={user} />} />
        <Route path="/profile" element={
          <Profile
            userPosts={posts}
            user={user}
            onUpdateUser={handleUpdateUser}
            onPostClick={(id) => console.log('Post clicked:', id)}
            onViewStories={() => setActiveStoryUserId(user.id)}
            onLikePost={handleLikePost}
            onCommentPost={handleComment}
            onSharePost={() => {}}
            onLogout={logout}
            onOpenSettings={() => {}}
          />
        } />
        <Route path="/admin" element={<AdminDashboard user={user} />} />
      </Routes>

      {/* Floating create button */}
      <button
        onClick={() => setIsUploadOpen(true)}
        className="fixed bottom-24 md:bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-full flex items-center justify-center shadow-xl shadow-black/30 hover:scale-110 active:scale-95 transition-all z-[60]"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Upload Modal */}
      {isUploadOpen && (
        <UploadModal
          user={user}
          onClose={() => setIsUploadOpen(false)}
          onPostCreated={handleCreatePost}
          onStoryCreated={handleCreateStory}
        />
      )}

      {/* Story Viewer */}
      {activeStoryUserId && (
        <StoryViewer 
          stories={stories.filter(s => s.user.id === activeStoryUserId)} 
          onClose={() => setActiveStoryUserId(null)}
          currentUserId={user.id}
        />
      )}
    </Layout>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
