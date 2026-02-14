import React, { useState } from 'react';
import { Story } from '../types';
import { X, ChevronLeft, ChevronRight, Heart, MessageCircle, Send, Share2 } from 'lucide-react';

interface StoryViewerProps {
  stories: Story[];
  onClose: () => void;
  onLike?: (storyId: string) => void;
  onComment?: (storyId: string, text: string) => void;
  currentUserId?: string;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ stories, onClose, onLike, onComment, currentUserId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  
  const currentStory = stories[currentIndex];

  const goNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleLike = () => {
    if (onLike && currentStory) {
      setIsLiking(true);
      onLike(currentStory.id);
      setTimeout(() => setIsLiking(false), 500);
    }
  };

  const handleComment = () => {
    if (commentText.trim() && onComment && currentStory) {
      onComment(currentStory.id, commentText);
      setCommentText('');
      setShowCommentInput(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      {/* Close button */}
      <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full z-10">
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Navigation arrows */}
      <button onClick={goPrev} className="absolute left-4 p-2 bg-black/50 rounded-full z-10">
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button onClick={goNext} className="absolute right-4 p-2 bg-black/50 rounded-full z-10">
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
        {stories.map((_, idx) => (
          <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-white transition-all duration-300 ${idx < currentIndex ? 'w-full' : idx === currentIndex ? 'animate-progress' : 'w-0'}`} 
            />
          </div>
        ))}
      </div>

      {/* User info */}
      <div className="absolute top-16 left-4 flex items-center gap-2 z-10">
        <img src={currentStory.user.avatar} className="w-8 h-8 rounded-full ring-2 ring-white" alt="" />
        <div>
          <span className="text-white text-sm font-medium">{currentStory.user.name}</span>
          <span className="text-white/60 text-xs ml-2">12h</span>
        </div>
      </div>

      {/* Story content */}
      {currentStory.type === 'video' ? (
        <video src={currentStory.imageUrl} className="w-full h-full object-contain max-h-screen" autoPlay onEnded={goNext} />
      ) : (
        <img src={currentStory.imageUrl} className="w-full h-full object-contain max-h-screen" onClick={goNext} alt="" />
      )}

      {/* Actions bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="flex items-center gap-2">
          {/* Comment input */}
          {showCommentInput ? (
            <div className="flex-1 flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Repondre..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/50"
                autoFocus
              />
              <button onClick={handleComment} disabled={!commentText.trim()}>
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          ) : (
            <input
              type="text"
              placeholder="Envoyer un message..."
              onClick={() => setShowCommentInput(true)}
              className="flex-1 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm placeholder-white/50 outline-none"
            />
          )}

          {/* Like button */}
          <button
            onClick={handleLike}
            className={`p-3 bg-white/10 backdrop-blur-md rounded-full transition-transform ${isLiking ? 'scale-125' : ''}`}
          >
            <Heart className={`w-6 h-6 ${isLiking ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>

          {/* Share button */}
          <button className="p-3 bg-white/10 backdrop-blur-md rounded-full">
            <Share2 className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-2 text-white/80 text-sm">
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" /> {currentStory.views || 0}
          </span>
          <span>{new Date(currentStory.timestamp).toLocaleDateString()}</span>
        </div>
      </div>

      <style>{`
        .animate-progress {
          animation: progress 5s linear forwards;
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default StoryViewer;
