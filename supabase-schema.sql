-- ============================================
-- VISION PREMIUM NETWORK - SUPABASE SCHEMA
-- ============================================
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- https://dokzbprrcsraypzebjuu.supabase.co
-- ============================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  name TEXT NOT NULL,
  avatar TEXT,
  username TEXT UNIQUE,
  email TEXT,
  phone TEXT,
  bio TEXT,
  relationship TEXT,
  city TEXT,
  education TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  followers TEXT[] DEFAULT '{}',
  following TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. POSTS TABLE
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author_avatar TEXT,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'reel', 'news')),
  content_url TEXT NOT NULL,
  caption TEXT,
  title TEXT,
  source TEXT,
  category TEXT,
  likes TEXT[] DEFAULT '{}',
  comments JSONB DEFAULT '[]',
  shares INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. STORIES TABLE
CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_avatar TEXT,
  image_url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  viewed BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  timestamp BIGINT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '24 hours',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  seller_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_avatar TEXT,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  image TEXT NOT NULL,
  category TEXT,
  currency_symbol TEXT DEFAULT '$',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'share', 'follow', 'mention', 'live')),
  message TEXT NOT NULL,
  source_id TEXT,
  source_avatar TEXT,
  read BOOLEAN DEFAULT FALSE,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. LIVES TABLE (pour les lives en temps réel)
CREATE TABLE IF NOT EXISTS lives (
  id TEXT PRIMARY KEY,
  streamer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  streamer_avatar TEXT,
  title TEXT NOT NULL,
  category TEXT,
  thumbnail TEXT,
  is_live BOOLEAN DEFAULT TRUE,
  viewers INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_timestamp ON posts(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_stories_user ON stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_timestamp ON stories(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_lives_streamer ON lives(streamer_id);

-- ============================================
-- SAMPLE DATA - INSERT DEFAULT USER
-- ============================================
INSERT INTO users (id, name, username, avatar, is_verified)
VALUES 
  ('user-1', 'Vision User', 'vision_user', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SAMPLE POSTS
-- ============================================
INSERT INTO posts (id, author_id, author_avatar, type, content_url, caption, likes, comments, shares, views, timestamp)
VALUES 
  ('post-1', 'user-1', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop', 'image', 'https://picsum.photos/seed/vision1/1080/1080', 'Bienvenue sur Vision! Une nouvelle expérience sociale.', ARRAY[]::TEXT[], '[]'::jsonb, 0, 1000, EXTRACT(EPOCH FROM NOW())::BIGINT),
  ('post-2', 'user-1', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop', 'reel', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', 'Découvrez les nouvelles fonctionnalités!', ARRAY[]::TEXT[], '[]'::jsonb, 0, 500, EXTRACT(EPOCH FROM NOW())::BIGINT - 3600)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- REALTIME SUBSCRIPTIONS (ACTIVEZ MANUELLEMENT)
-- Allez dans: Database > Replication
-- Activez "Realtime" pour les tables:
-- - posts
-- - stories  
-- - messages
-- - notifications
-- - lives
-- ============================================

-- ============================================
-- FUNCTION TO AUTO-UPDATE TIMESTAMP
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- END OF SCHEMA
-- ============================================
