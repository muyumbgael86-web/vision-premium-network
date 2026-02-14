import React, { useState, useMemo, useRef, useCallback, memo } from 'react';
import { Post } from '../types';
import { Heart, MessageCircle, Share2, MoreHorizontal, Download, Play, Pause, Volume2, VolumeX, Eye, X, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { formatTimeAgo } from '../utils/time';

interface PostCardProps {
  post: Post;
  currentUserId: string;
  onLike: () => void;
  onComment: (text: string) => void;
  onShare: () => void;
  onDelete?: () => void;
  onView?: () => void;
  isAdmin?: boolean;
}

// Animated Like Button Component
const AnimatedLikeButton: React.FC<{ isLiked: boolean; count: number; onLike: () => void }> = ({ isLiked, count, onLike }) => {
  const [animate, setAnimate] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleLike = useCallback(() => {
    onLike();
    setAnimate(true);
    setParticles(Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: 50 + (Math.random() - 0.5) * 100,
      y: 50 + (Math.random() - 0.5) * 100
    })));
    setTimeout(() => setAnimate(false), 500);
    setTimeout(() => setParticles([]), 600);
  }, [onLike]);

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 transition-all duration-300 ${isLiked ? 'scale-110' : 'hover:scale-105'}`}
    >
      <div className="relative">
        <Heart
          className={`w-6 h-6 transition-all duration-300 ${
            isLiked
              ? 'fill-current text-rose-500 scale-110'
              : 'text-gray-400'
          } ${animate ? 'animate-heart-burst' : ''}`}
        />
        {animate && particles.map(p => (
          <Sparkles
            key={p.id}
            className="absolute w-3 h-3 text-amber-400"
            style={{ left: `${p.x}%`, top: `${p.y}%`, opacity: 0 }}
          />
        ))}
      </div>
      <span className={`text-sm font-medium transition-all duration-300 ${isLiked ? 'text-rose-500' : 'text-gray-500'}`}>
        {count > 999 ? `${(count / 1000).toFixed(1)}K` : count}
      </span>
    </button>
  );
};

// Video Player with better UX
const VideoPlayer = memo(({ src, onView, views }: { src: string; onView?: () => void; views?: number }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const hasViewedRef = useRef(false);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      setShowControls(true);
      if (!hasViewedRef.current) {
        onView?.();
        hasViewedRef.current = true;
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    hideControlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      className="relative w-full bg-black rounded-xl overflow-hidden group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-auto"
        playsInline
        muted={isMuted}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Views badge */}
      {views !== undefined && views > 0 && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full z-10">
          <Eye className="w-3.5 h-3.5 text-white" />
          <span className="text-[10px] font-medium text-white">{views.toLocaleString()}</span>
        </div>
      )}

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls overlay */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 flex items-center justify-center ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className={`p-5 bg-white/20 backdrop-blur-sm rounded-full transition-transform duration-300 ${
          isPlaying ? 'scale-90' : 'scale-100'
        }`}>
          {isPlaying ? (
            <Pause className="w-10 h-10 text-white fill-current" />
          ) : (
            <Play className="w-10 h-10 text-white fill-current ml-1" />
          )}
        </div>
      </div>

      {/* Bottom controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center justify-between text-white">
          <span className="text-xs font-mono">
            {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
});

const PostCard: React.FC<PostCardProps> = ({ post, currentUserId, onLike, onComment, onShare, onView }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const isLiked = useMemo(() => post.likes.includes(currentUserId), [post.likes, currentUserId]);
  const hasViewedRef = useRef(false);

  const handleImageClick = () => {
    if (!hasViewedRef.current) {
      onView?.();
      hasViewedRef.current = true;
    }
  };

  const submitComment = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (commentText.trim()) {
      onComment(commentText.trim());
      setCommentText('');
    }
  };

  // Theme colors
  const bgColor = 'bg-white';
  const borderColor = 'border-gray-200';
  const textPrimary = 'text-gray-900';
  const textSecondary = 'text-gray-500';
  const textTertiary = 'text-gray-400';
  const hoverBg = 'hover:bg-gray-50';
  const inputBg = 'bg-gray-50';

  return (
    <div className={`${bgColor} rounded-2xl mb-4 overflow-hidden border ${borderColor} shadow-sm relative w-full animate-fade-in`}>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatar}
            className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
            alt=""
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className={`font-semibold text-base ${textPrimary}`}>{post.author.name}</h3>
              {post.author.isVerified && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
            </div>
            <p className="text-xs text-gray-400">{formatTimeAgo(post.timestamp)}</p>
          </div>
        </div>
        <button className={`p-2 ${textTertiary} ${hoverBg} rounded-lg transition-colors`}>
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 pb-3">
        {post.title && <h4 className="font-bold text-lg mb-1 text-gray-900">{post.title}</h4>}
        <p className="text-sm text-gray-600 leading-relaxed">{post.caption}</p>
        {post.category && (
          <span className="inline-block text-[10px] bg-indigo-100 text-indigo-600 px-2.5 py-1 rounded-full mt-2 font-medium">
            {post.category}
          </span>
        )}
      </div>

      <div className="relative">
        {post.type === 'video' || post.type === 'reel' ? (
          <VideoPlayer src={post.contentUrl} onView={onView} views={post.views} />
        ) : (
          <div className="relative group" onClick={handleImageClick}>
            <img
              src={post.contentUrl}
              className="w-full cursor-pointer transition-transform duration-500"
              alt=""
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-5">
            <AnimatedLikeButton isLiked={isLiked} count={post.likes.length} onLike={onLike} />

            <button
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-2 transition-colors ${textSecondary} hover:text-indigo-500`}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.comments.length > 999 ? `${(post.comments.length / 1000).toFixed(1)}K` : post.comments.length}</span>
            </button>

            <button
              onClick={onShare}
              className={`flex items-center gap-2 transition-colors ${textSecondary} hover:text-green-500`}
            >
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">{post.shares}</span>
            </button>
          </div>

          <button className={`p-2 ${textSecondary} hover:bg-gray-100 rounded-lg transition-colors`}>
            <Download className="w-5 h-5" />
          </button>
        </div>

        {showComments && (
          <div className="space-y-4 mt-4 pt-4 border-t border-gray-100 animate-slide-down">
            <div className="space-y-3 max-h-56 overflow-y-auto scrollbar-hide">
              {post.comments.length === 0 ? (
                <p className="text-xs text-center text-gray-400 py-4">Aucun commentaire - soyez le premier!</p>
              ) : (
                post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 animate-fade-in">
                    <img src={comment.userAvatar} className="w-8 h-8 rounded-full" alt="" />
                    <div className={`flex-1 ${inputBg} rounded-2xl rounded-tl-sm p-3`}>
                      <p className="text-xs font-medium text-gray-900">{comment.userName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={submitComment} className="flex gap-2 mt-3">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className={`flex-1 ${inputBg} rounded-full px-4 py-2.5 text-sm outline-none border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-full disabled:opacity-50 text-white transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
