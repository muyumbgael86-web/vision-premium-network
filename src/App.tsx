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
import { INITIAL_POSTS, INITIAL_STORIES } from './constants';
import { Plus } from 'lucide-react';
import { Post, Story, User, VisionNotification } from './types';
import { syncWithCloud, CloudState } from './services/syncService';

const STORAGE_KEY = 'VISION_PERSISTENT_SESSION';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeStoryUserId, setActiveStoryUserId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('vision_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('vision_stories');
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });

  const [products, setProducts] = useState<any[]>(() => {
    const saved = localStorage.getItem('vision_products');
    return saved ? JSON.parse(saved) : [];
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
  }, [theme]);

  const syncEngine = useCallback(async () => {
    if (!user) return;
    setIsSyncing(true);

    const localState: Partial<CloudState> = {
      posts,
      users: [user],
      stories,
      products,
      messages
    };

    const cloudData = await syncWithCloud(localState);
    if (cloudData) {
      setPosts(cloudData.posts);
      setStories(cloudData.stories);
      setProducts(cloudData.products);
      setMessages(cloudData.messages);

      if (user.email === 'abrahamluboya2@gmail.com' && !user.isVerified) {
        setUser(prev => prev ? { ...prev, isVerified: true, isAdmin: true } : null);
      }
    }
    setIsSyncing(false);
  }, [user, posts, stories, products, messages]);

  useEffect(() => {
    if (!user) return;
    syncEngine();
    const interval = setInterval(syncEngine, 30000);
    return () => clearInterval(interval);
  }, [user, syncEngine]);

  useEffect(() => { if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('vision_posts', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem('vision_stories', JSON.stringify(stories)); }, [stories]);

  const handleCreatePost = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    setIsUploadOpen(false);
    setTimeout(syncEngine, 500);
  };

  const handleLikePost = (postId: string) => {
    if (!user) return;
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, likes: p.likes.includes(user.id) ? p.likes.filter(id => id !== user.id) : [...p.likes, user.id] }
        : p
    ));
  };

  const handleComment = (postId: string, text: string) => {
    if (!user) return;
    const comment = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      text,
      timestamp: Date.now().toString()
    };
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
    ));
  };

  const handleUpdateUser = (updatedUser: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updatedUser } : null);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    navigate('/');
  };

  if (!user) return <Auth onLogin={setUser} />;

  return (
    <Layout user={user} theme={theme} setTheme={setTheme} notifications={notifications} onClearNotifications={() => setNotifications([])} onLogout={logout}>
      <Routes>
        <Route path="/" element={
          <div className="space-y-4 pt-2">
            <StoryBar stories={stories} user={user} onAddStory={() => setIsUploadOpen(true)} onViewStory={setActiveStoryUserId} />
            {posts.filter(p => p && !p.category && p.type !== 'reel').map(post => (
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
        <Route path="/shop" element={<Shop products={products} onProductsUpdate={setProducts} />} />
        <Route path="/messenger" element={<Messenger user={user} />} />
        <Route path="/live" element={<LiveStream user={user} />} />
        <Route path="/profile" element={
          <Profile
            userPosts={posts}
            user={user}
            onUpdateUser={(u) => setUser(prev => prev ? { ...prev, ...u } : null)}
            onPostClick={setSelectedPostId}
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

      <button
        onClick={() => setIsUploadOpen(true)}
        className="fixed bottom-24 md:bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-500/30 hover:scale-110 active:scale-95 transition-all z-[60]"
      >
        <Plus className="w-6 h-6" />
      </button>

      {isUploadOpen && (
        <UploadModal
          user={user}
          onClose={() => setIsUploadOpen(false)}
          onPostCreated={handleCreatePost}
          onStoryCreated={(s) => setStories(prev => [s, ...prev])}
        />
      )}
      {activeStoryUserId && (
        <StoryViewer stories={stories.filter(s => s.user.id === activeStoryUserId)} onClose={() => setActiveStoryUserId(null)} />
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
