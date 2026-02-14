import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Post } from '../types';
import { formatTimeAgo } from '../utils/time';
import { Heart, MessageCircle, Share2, Music2, Pause, Play, ChevronRight, Send, X, MoreHorizontal } from 'lucide-react';

interface ReelsProps {
  reels: Post[];
  currentUserId: string;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onShare: (postId: string) => void;
}

// Animated Like Button Component
const AnimatedLikeButton: React.FC<{ isLiked: boolean; count: number; onLike: () => void }> = ({ isLiked, count, onLike }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isLiked) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isLiked]);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onLike}
        className={`relative p-3 rounded-full transition-all duration-300 ${
          isLiked ? 'bg-rose-500 scale-110' : 'bg-white/10 hover:bg-white/20'
        }`}
      >
        <Heart
          className={`w-7 h-7 transition-all duration-300 ${
            isLiked ? 'fill-current text-white scale-110' : 'text-white'
          } ${animate ? 'animate-bounce' : ''}`}
        />
        {animate && (
          <span className="absolute inset-0 rounded-full animate-ping bg-rose-500 opacity-25" />
        )}
      </button>
      <span className={`text-white text-sm font-medium mt-1 ${animate ? 'scale-125' : ''} transition-transform`}>
        {count > 999 ? `${(count / 1000).toFixed(1)}K` : count}
      </span>
    </div>
  );
};

// Floating Hearts Animation
const FloatingHearts: React.FC<{ trigger: boolean }> = ({ trigger }) => {
  const [hearts, setHearts] = useState<{ id: number; left: number }[]>([]);

  useEffect(() => {
    if (trigger) {
      const newHearts = Array.from({ length: 6 }, (_, i) => ({
        id: Date.now() + i,
        left: 30 + Math.random() * 40
      }));
      setHearts(newHearts);
      const timer = setTimeout(() => setHearts([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute bottom-20 animate-float-up"
          style={{ left: `${heart.left}%` }}
        >
          <Heart className="w-6 h-6 fill-rose-500 text-rose-500 animate-heart-pop" />
        </div>
      ))}
    </div>
  );
};

const Reels: React.FC<ReelsProps> = ({ reels, currentUserId, onLike, onComment, onShare }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const progressRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentReel = reels[currentIndex];
  const isLiked = likedPosts.has(currentReel?.id) || currentReel?.likes.includes(currentUserId);

  // Progress bar animation
  useEffect(() => {
    if (isPlaying && currentReel) {
      intervalRef.current = setInterval(() => {
        progressRef.current += 1;
        if (progressRef.current >= 100) {
          progressRef.current = 0;
          // Go to next reel
          if (currentIndex < reels.length - 1) {
            setCurrentIndex(prev => prev + 1);
          } else {
            setCurrentIndex(0);
          }
          progressRef.current = 0;
        }
        setProgress(progressRef.current);
      }, 100);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentIndex, reels.length, currentReel]);

  // Handle like with animation
  const handleLike = useCallback(() => {
    if (!currentReel) return;
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentReel.id)) {
        newSet.delete(currentReel.id);
      } else {
        newSet.add(currentReel.id);
      }
      return newSet;
    });
    onLike(currentReel.id);
  }, [currentReel, onLike]);

  // Double tap to like
  const handleDoubleTap = useCallback(() => {
    if (!currentReel || !isLiked) {
      handleLike();
    }
  }, [currentReel, isLiked, handleLike]);

  // Navigate reels
  const navigate = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentIndex < reels.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
    progressRef.current = 0;
    setProgress(0);
  };

  // Play/Pause
  const togglePlay = () => setIsPlaying(prev => !prev);

  // Submit comment
  const handleComment = () => {
    if (commentText.trim() && currentReel) {
      onComment(currentReel.id, commentText);
      setCommentText('');
      setShowComments(false);
    }
  };

  if (reels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-white">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
          <Play className="w-12 h-12 ml-1" />
        </div>
        <p className="text-xl font-bold">Aucun reel disponible</p>
        <p className="text-white/60 text-sm mt-2">Créez votre premier reel!</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-180px)] rounded-2xl overflow-hidden bg-black">
      {/* Progress bars */}
      <div className="absolute top-2 left-2 right-2 z-20 flex gap-1">
        {reels.map((_, idx) => (
          <div key={idx} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className={`h-full bg-white transition-all duration-100 ${
                idx === currentIndex ? `w-full` : idx < currentIndex ? 'w-full' : 'w-0'
              }`}
              style={{
                width: idx === currentIndex ? `${progress}%` : undefined,
                transition: idx === currentIndex ? 'width 0.1s linear' : 'none'
              }}
            />
          </div>
        ))}
      </div>

      {/* Video/Content */}
      <div
        className="w-full h-full relative"
        onClick={togglePlay}
        onDoubleClick={handleDoubleTap}
      >
        {/* Main content - use type property instead of contentType */}
        {currentReel.type === 'video' || currentReel.type === 'reel' ? (
          <video
            key={currentReel.id}
            src={currentReel.contentUrl}
            className="w-full h-full object-contain"
            autoPlay
            loop={isPlaying}
            muted={false}
            playsInline
          />
        ) : (
          <img
            key={currentReel.id}
            src={currentReel.contentUrl}
            alt={currentReel.caption}
            className="w-full h-full object-contain"
            onDoubleClick={handleDoubleTap}
          />
        )}

        {/* Floating hearts on double tap */}
        <FloatingHearts trigger={isLiked && likedPosts.has(currentReel.id)} />

        {/* Play/Pause overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Play className="w-16 h-16 text-white/80" />
          </div>
        )}
      </div>

      {/* Side Actions */}
      <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5 z-10">
        <AnimatedLikeButton
          isLiked={isLiked}
          count={currentReel.likes.length}
          onLike={handleLike}
        />

        <button
          onClick={(e) => { e.stopPropagation(); setShowComments(true); }}
          className="flex flex-col items-center group"
        >
          <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <span className="text-white text-xs font-medium mt-1">
            {currentReel.comments.length > 999 ? `${(currentReel.comments.length / 1000).toFixed(1)}K` : currentReel.comments.length}
          </span>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onShare(currentReel.id); }}
          className="flex flex-col items-center group"
        >
          <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all">
            <Share2 className="w-7 h-7 text-white" />
          </div>
          <span className="text-white text-xs font-medium mt-1">Partager</span>
        </button>

        <div className="flex flex-col items-center group cursor-pointer">
          <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all animate-spin-slow">
            <Music2 className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10">
        <div className="flex items-end gap-3">
          <img
            src={currentReel.author.avatar}
            alt={currentReel.author.name}
            className="w-10 h-10 rounded-full border-2 border-white object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{currentReel.author.name}</span>
              <button className="text-white/60 text-sm">Suivre</button>
            </div>
            <p className="text-white/90 text-sm mt-1">{currentReel.caption}</p>
            {currentReel.category && (
              <div className="flex items-center gap-1 mt-2 text-white/70 text-sm">
                <Music2 className="w-4 h-4" />
                <span>{currentReel.category}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={(e) => { e.stopPropagation(); navigate('prev'); }}
        className={`absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 backdrop-blur z-10 ${currentIndex === 0 ? 'opacity-30' : 'opacity-100 hover:bg-white/20'}`}
        disabled={currentIndex === 0}
      >
        <ChevronRight className="w-6 h-6 text-white rotate-180" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); navigate('next'); }}
        className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 backdrop-blur z-10 ${currentIndex === reels.length - 1 ? 'opacity-30' : 'opacity-100 hover:bg-white/20'}`}
        disabled={currentIndex === reels.length - 1}
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Comments Sheet */}
      {showComments && (
        <div className="absolute inset-0 bg-black/80 z-50" onClick={() => setShowComments(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl p-4 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Comments</h3>
              <button onClick={() => setShowComments(false)}>
                <X className="w-6 h-6 text-white/60" />
              </button>
            </div>

            <div className="space-y-4 mb-4">
              {currentReel.comments.length === 0 ? (
                <p className="text-white/40 text-center py-4">Aucun commentaire</p>
              ) : (
                currentReel.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <img src={comment.userAvatar} alt="" className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="text-white text-sm">
                        <span className="font-bold">{comment.userName}</span> {comment.text}
                      </p>
                      <p className="text-white/50 text-xs mt-1">{formatTimeAgo(Number(comment.timestamp))}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="flex-1 bg-white/10 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              />
              <button
                onClick={handleComment}
                disabled={!commentText.trim()}
                className="p-2 bg-indigo-500 rounded-full disabled:opacity-50"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reels;
