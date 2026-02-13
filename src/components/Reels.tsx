import React, { useState } from 'react';
import { Post } from '../types';
import { formatTimeAgo } from '../utils/time';

interface ReelsProps {
  reels: Post[];
  currentUserId: string;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onShare: (postId: string) => void;
}

const Reels: React.FC<ReelsProps> = ({ reels, currentUserId, onLike, onComment, onShare }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (reels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
        <p className="text-lg">Aucun reel disponible</p>
        <p className="text-sm mt-2">Créez votre premier reel!</p>
      </div>
    );
  }

  const currentReel = reels[currentIndex];
  const isLiked = currentReel.likes.includes(currentUserId);

  return (
    <div className="relative">
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {reels.map((reel, idx) => (
          <button key={reel.id} onClick={() => setCurrentIndex(idx)} className={`flex-shrink-0 w-24 h-40 rounded-xl overflow-hidden border-2 transition-all ${idx === currentIndex ? 'border-indigo-500 scale-105' : 'border-transparent opacity-60'}`}>
            <img src={reel.contentUrl} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-xs font-medium">{idx + 1}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4">
        <div className="relative aspect-[9/16] max-h-[70vh] mx-auto rounded-xl overflow-hidden bg-black">
          <video src={currentReel.contentUrl} className="w-full h-full object-contain" controls />

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center gap-3 mb-3">
              <img src={currentReel.author.avatar} className="w-10 h-10 rounded-full" alt="" />
              <div>
                <p className="text-white font-medium text-sm">{currentReel.author.name}</p>
                <p className="text-white/60 text-xs">{formatTimeAgo(currentReel.timestamp)}</p>
              </div>
            </div>
            <p className="text-white text-sm">{currentReel.caption}</p>
          </div>

          <div className="absolute right-3 bottom-20 flex flex-col gap-4">
            <button onClick={() => onLike(currentReel.id)} className={`p-3 rounded-full ${isLiked ? 'bg-rose-500' : 'bg-white/20'} backdrop-blur-sm`}>
              <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            </button>
            <span className="text-white text-xs text-center">{currentReel.likes.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reels;
