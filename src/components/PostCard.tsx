import React, { useState, useMemo, useRef, useCallback, memo } from 'react';
import { Post } from '../types';
import { Heart, MessageCircle, Share2, MoreHorizontal, Download, Play, Pause, Volume2, VolumeX, Eye, X, Send, CheckCircle2, Sparkles, ChevronLeft } from 'lucide-react';
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
              ? 'fill-current text-green-500 scale-110'
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
      <span className={`text-sm font-medium transition-all duration-300 ${isLiked ? 'text-green-500' : 'text-gray-500'}`}>
        {count > 999 ? `${(count / 1000).toFixed(1)}K` : count}
      </span>
    </button>
  );
};

// Video Player with expandable on click
const VideoPlayer = memo(({ src, onView, views }: { src: string; onView?: () => void; views?: number }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
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

  const toggleExpand = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsExpanded(!isExpanded);
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

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <button
          onClick={toggleExpand}
          className="absolute top-4 left-4 z-50 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div
          className="relative w-full h-full flex items-center justify-center"
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src={src}
            className="max-h-screen max-w-full"
            playsInline
            muted={isMuted}
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => {
              if (videoRef.current) setDuration(videoRef.current.duration);
            }}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
        {/* Expanded controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="flex items-center justify-between text-white max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="p-2 hover:bg-white/20 rounded-full">
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-current" />}
              </button>
              <span className="text-sm font-mono">
                {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              {views !== undefined && views > 0 && (
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{views.toLocaleString()}</span>
                </div>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                className="p-2 hover:bg-white/20 rounded-full"
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full bg-black rounded-xl overflow-hidden group cursor-pointer video-expandable"
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

      {/* Expand button */}
      <div className={`absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-sm rounded-full z-10 transition-opacity ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        <Play className="w-4 h-4 text-white fill-current" />
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-100"
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

// Comments Modal Component
const CommentsModal: React.FC<{
  post: Post;
  onClose: () => void;
  onComment: (text: string) => void;
}> = ({ post, onClose, onComment }) => {
  const [commentText, setCommentText] = useState('');

  const submitComment = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (commentText.trim()) {
      onComment(commentText.trim());
      setCommentText('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[85vh] sm:max-h-[80vh] bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
          <h3 className="font-semibold text-lg">Commentaires</h3>
          <div className="w-10" />
        </div>

        {/* Comments list */}
        <div className="overflow-y-auto max-h-[50vh] sm:max-h-[55vh] p-4 space-y-4">
          {post.comments.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">Aucun commentaire pour le moment</p>
              <p className="text-sm text-gray-400 mt-1">Soyez le premier à commenter!</p>
            </div>
          ) : (
            post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 animate-fade-in">
                <img src={comment.userAvatar} className="w-10 h-10 rounded-full flex-shrink-0" alt="" />
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm p-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{comment.userName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment input */}
        <form onSubmit={submitComment} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="flex-1 bg-white dark:bg-gray-700 rounded-full px-4 py-3 text-sm outline-none border border-gray-200 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900/30 transition-all"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 rounded-full text-white transition-colors shadow-lg shadow-green-500/30"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PostCard: React.FC<PostCardProps> = ({ post, currentUserId, onLike, onComment, onShare, onView }) => {
  const [showComments, setShowComments] = useState(false);
  const isLiked = useMemo(() => post.likes.includes(currentUserId), [post.likes, currentUserId]);
  const hasViewedRef = useRef(false);

  const handleImageClick = () => {
    if (!hasViewedRef.current) {
      onView?.();
      hasViewedRef.current = true;
    }
  };

  // Theme colors
  const bgColor = 'bg-white dark:bg-gray-900';
  const borderColor = 'border-gray-200 dark:border-gray-800';
  const textPrimary = 'text-gray-900 dark:text-white';
  const textSecondary = 'text-gray-500 dark:text-gray-400';
  const textTertiary = 'text-gray-400 dark:text-gray-500';
  const hoverBg = 'hover:bg-gray-50 dark:hover:bg-gray-800/50';
  const inputBg = 'bg-gray-50 dark:bg-gray-800';

  return (
    <>
      <div className={`${bgColor} rounded-2xl mb-4 overflow-hidden border ${borderColor} shadow-sm relative w-full animate-fade-in glass-card`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              className="w-12 h-12 rounded-full object-cover border-2 border-green-100 dark:border-green-900/30 shadow-sm"
              alt=""
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className={`font-semibold text-base ${textPrimary}`}>{post.author.name}</h3>
                {post.author.isVerified && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">{formatTimeAgo(post.timestamp)}</p>
            </div>
          </div>
          <button className={`p-2 ${textTertiary} ${hoverBg} rounded-lg transition-colors`}>
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 pb-3">
          {post.title && <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{post.title}</h4>}
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{post.caption}</p>
          {post.category && (
            <span className="inline-block text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2.5 py-1 rounded-full mt-2 font-medium">
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
                onClick={() => setShowComments(true)}
                className={`flex items-center gap-2 transition-colors ${textSecondary} hover:text-green-500`}
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

            <button className={`p-2 ${textSecondary} hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors`}>
              <Download className="w-5 h-5" />
            </button>
          </div>

          {/* Only show first comment preview inline */}
          {post.comments.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-900 dark:text-white">{post.comments[0]?.userName}</span>{' '}
                {post.comments[0]?.text.length > 50 ? post.comments[0]?.text.slice(0, 50) + '...' : post.comments[0]?.text}
              </p>
              {post.comments.length > 1 && (
                <button
                  onClick={() => setShowComments(true)}
                  className="text-sm text-green-500 hover:text-green-600 mt-1"
                >
                  Voir les {post.comments.length - 1} autres commentaires
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comments Modal */}
      {showComments && (
        <CommentsModal
          post={post}
          onClose={() => setShowComments(false)}
          onComment={onComment}
        />
      )}
    </>
  );
};

export default PostCard;
