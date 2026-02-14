import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Heart, MessageCircle, Share2, MoreHorizontal, Volume2, VolumeX } from 'lucide-react';
import { Post } from '../types';

interface ReelsProps {
  reels: Post[];
  currentUserId: string;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onShare: (postId: string) => void;
}

const Reels: React.FC<ReelsProps> = ({ reels, currentUserId, onLike, onComment, onShare }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiking, setIsLiking] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);

  // Use sample reels if none exist
  const displayReels = reels.length > 0 ? reels : [
    {
      id: 'sample-reel-1',
      author: { id: '1', name: 'Vision Creator', avatar: 'https://picsum.photos/seed/vision1/200/200', username: 'vision_creator', followers: [], following: [] },
      type: 'reel' as const,
      contentUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
      caption: 'Welcome to Vision Reels!',
      likes: ['1', '2', '3'],
      comments: [],
      shares: 0,
      views: 1234,
      timestamp: Date.now()
    },
    {
      id: 'sample-reel-2',
      author: { id: '2', name: 'Tech Trends', avatar: 'https://picsum.photos/seed/vision2/200/200', username: 'tech_trends', followers: [], following: [] },
      type: 'reel' as const,
      contentUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
      caption: 'Latest tech innovations',
      likes: ['1', '2'],
      comments: [],
      shares: 0,
      views: 5678,
      timestamp: Date.now() - 10000
    },
    {
      id: 'sample-reel-3',
      author: { id: '3', name: 'Lifestyle', avatar: 'https://picsum.photos/seed/vision3/200/200', username: 'lifestyle_vision', followers: [], following: [] },
      type: 'reel' as const,
      contentUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
      caption: 'Daily inspiration',
      likes: ['1'],
      comments: [],
      shares: 0,
      views: 9012,
      timestamp: Date.now() - 20000
    }
  ];

  const currentReel = displayReels[currentIndex];

  const handleScroll = useCallback((e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      setCurrentIndex(prev => Math.min(prev + 1, displayReels.length - 1));
    } else {
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    }
  }, [displayReels.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchY = e.touches[0].clientY;
    const diff = touchStartY.current - touchY;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentIndex(prev => Math.min(prev + 1, displayReels.length - 1));
      } else {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
      }
      touchStartY.current = touchY;
    }
  };

  const handleLike = (reelId: string) => {
    setIsLiking(reelId);
    onLike(reelId);
    setTimeout(() => setIsLiking(null), 500);
  };

  // Auto-advance to next reel after 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      setCurrentIndex(prev => {
        if (prev < displayReels.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, isPaused, displayReels.length]);

  // Pause video when not in view
  useEffect(() => {
    setIsPaused(false);
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      onWheel={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className="fixed inset-0 bg-black overflow-hidden md:relative md:h-[calc(100vh-80px)] md:rounded-2xl md:my-2 md:mx-auto md:max-w-[400px]"
      style={{ zIndex: 40 }}
    >
      {displayReels.length === 0 ? (
        <div className="flex items-center justify-center h-full text-white">
          <p className="text-center">Aucun reel disponible.<br/>Créez votre premier reel!</p>
        </div>
      ) : (
        <>
          {/* Video Container */}
          <div
            className="h-full w-full relative"
            onClick={() => setIsPaused(!isPaused)}
          >
            {/* Current Reel Video/Image */}
            <div className="h-full w-full">
              {currentReel.type === 'video' || currentReel.type === 'reel' ? (
                <video
                  src={currentReel.contentUrl}
                  className="h-full w-full object-cover"
                  loop
                  muted={isMuted}
                  autoPlay
                  playsInline
                  onPause={() => setIsPaused(true)}
                  onPlay={() => setIsPaused(false)}
                />
              ) : (
                <img
                  src={currentReel.contentUrl}
                  alt={currentReel.caption}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

            {/* Mute Button */}
            <button
              onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
              className="absolute top-16 right-4 z-10 p-2 bg-black/50 rounded-full"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Progress Dots */}
            <div className="absolute top-16 left-4 right-16 flex gap-1 z-10">
              {displayReels.map((_, index) => (
                <div
                  key={index}
                  className={`h-0.5 flex-1 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-white'
                      : 'bg-white/40'
                  }`}
                />
              ))}
            </div>

            {/* Content Overlay - Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pt-20 z-10">
              {/* Author Info */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={currentReel.author.avatar}
                  alt={currentReel.author.name}
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{currentReel.author.name}</p>
                  <p className="text-white/70 text-xs">@{currentReel.author.username}</p>
                </div>
                {'isVerified' in currentReel.author && currentReel.author.isVerified && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                    Certifié
                  </span>
                )}
              </div>

              {/* Caption */}
              {currentReel.caption && (
                <p className="text-white text-sm mb-3 line-clamp-2">
                  {currentReel.caption}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => { e.stopPropagation(); handleLike(currentReel.id); }}
                  className={`flex flex-col items-center gap-0.5 transition-transform active:scale-125 ${
                    isLiking === currentReel.id ? 'scale-125' : ''
                  }`}
                >
                  <Heart
                    className={`w-7 h-7 transition-colors ${
                      currentReel.likes?.includes(currentUserId)
                        ? 'fill-red-500 text-red-500'
                        : 'text-white'
                    }`}
                  />
                  <span className="text-white text-xs font-medium">{currentReel.likes?.length || 0}</span>
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); onComment(currentReel.id, ''); }}
                  className="flex flex-col items-center gap-0.5"
                >
                  <MessageCircle className="w-7 h-7 text-white" />
                  <span className="text-white text-xs font-medium">{currentReel.comments?.length || 0}</span>
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); onShare(currentReel.id); }}
                  className="flex flex-col items-center gap-0.5"
                >
                  <Share2 className="w-7 h-7 text-white" />
                  <span className="text-white text-xs font-medium">{currentReel.shares || 0}</span>
                </button>

                <button className="flex flex-col items-center gap-0.5 ml-auto">
                  <MoreHorizontal className="w-7 h-7 text-white" />
                </button>
              </div>
            </div>

            {/* Pause Indicator */}
            {isPaused && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
                <Play className="w-16 h-16 text-white/80" />
              </div>
            )}
          </div>
        </>
      )}

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={() => setCurrentIndex(prev => prev - 1)}
          className="absolute top-1/2 left-4 -translate-y-1/2 z-20 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {currentIndex < displayReels.length - 1 && (
        <button
          onClick={() => setCurrentIndex(prev => prev + 1)}
          className="absolute top-1/2 right-4 -translate-y-1/2 z-20 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Reels;
