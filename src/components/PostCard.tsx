import React, { useState, useMemo, useRef, memo } from 'react';
import { Post } from '../types';
import { Heart, MessageCircle, Share2, MoreHorizontal, Download, Play, Pause, Volume2, VolumeX, Clock, Eye, X, Send, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
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

const VideoPlayer = memo(({ src, onView, views }: { src: string; onView?: () => void; views?: number }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const hasViewedRef = useRef(false);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      if (!hasViewedRef.current) {
        onView?.();
        hasViewedRef.current = true;
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="relative w-full bg-black group overflow-hidden rounded-xl">
      <video ref={videoRef} src={src} className="w-full h-auto cursor-pointer" playsInline muted={isMuted} preload="auto" onClick={togglePlay} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)} />

      {views !== undefined && views > 0 && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
          <Eye className="w-3.5 h-3.5 text-white" />
          <span className="text-[10px] font-medium text-white">{views}</span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
        <div className="w-full h-1 bg-white/30 rounded-full mb-2 overflow-hidden">
          <div className="h-full bg-indigo-500 transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <button onClick={togglePlay} className="text-white">
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          </button>
          <span className="text-[10px] text-white/80 font-mono">{formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}</span>
          <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}>
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {!isPlaying && (
        <div onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer">
          <div className="p-4 bg-indigo-600 rounded-full text-white shadow-lg">
            <Play className="w-8 h-8 fill-current ml-1" />
          </div>
        </div>
      )}
    </div>
  );
});

const PostCard: React.FC<PostCardProps> = ({ post, currentUserId, onLike, onComment, onShare, onDelete, onView }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const isLiked = useMemo(() => post.likes.includes(currentUserId), [post.likes, currentUserId]);
  const isOwner = post.author.id === currentUserId;
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

  return (
    <div className="glass rounded-2xl mb-4 overflow-hidden border border-white/10 relative w-full">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={post.author.avatar} className="w-10 h-10 rounded-full object-cover border border-white/20" alt="" />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-sm">{post.author.name}</h3>
              {post.author.isVerified && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
            </div>
            <p className="text-[10px] text-zinc-500">{formatTimeAgo(post.timestamp)}</p>
          </div>
        </div>
        <button className="p-2 text-zinc-400 hover:bg-white/5 rounded-lg transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
      </div>

      <div className="px-4 pb-3">
        {post.title && <h4 className="font-bold text-base mb-1">{post.title}</h4>}
        <p className="text-sm text-zinc-300">{post.caption}</p>
        {post.category && <span className="inline-block text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full mt-2">{post.category}</span>}
      </div>

      <div className="relative">
        {post.type === 'video' || post.type === 'reel' ? (
          <VideoPlayer src={post.contentUrl} onView={onView} views={post.views} />
        ) : (
          <img src={post.contentUrl} className="w-full cursor-pointer" onClick={handleImageClick} alt="" />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-6">
            <button onClick={onLike} className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-rose-500' : 'text-zinc-400'}`}>
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs font-medium">{post.likes.length}</span>
            </button>
            <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-zinc-400">
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs font-medium">{post.comments.length}</span>
            </button>
            <button onClick={onShare} className="flex items-center gap-2 text-zinc-400">
              <Share2 className="w-5 h-5" />
              <span className="text-xs font-medium">{post.shares}</span>
            </button>
          </div>
          <button className="text-zinc-400"><Download className="w-5 h-5" /></button>
        </div>

        {showComments && (
          <div className="space-y-3 mt-4 pt-4 border-t border-white/10">
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {post.comments.length === 0 ? (
                <p className="text-xs text-center text-zinc-500 py-2">Aucun commentaire</p>
              ) : (
                post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <img src={comment.userAvatar} className="w-8 h-8 rounded-full" alt="" />
                    <div className="flex-1 bg-white/5 rounded-xl p-3">
                      <p className="text-xs font-medium">{comment.userName}</p>
                      <p className="text-xs text-zinc-400">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={submitComment} className="flex gap-2 mt-3">
              <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Commenter..." className="flex-1 bg-white/5 rounded-full px-4 py-2 text-sm outline-none border border-white/10" />
              <button type="submit" disabled={!commentText.trim()} className="p-2 bg-indigo-600 rounded-full disabled:opacity-50"><Send className="w-4 h-4" /></button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;