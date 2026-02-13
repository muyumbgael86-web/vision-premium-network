import React, { useState } from 'react';
import { Story } from '../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface StoryViewerProps {
  stories: Story[];
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ stories, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
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

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full z-10"><X className="w-6 h-6 text-white" /></button>

      <button onClick={goPrev} className="absolute left-4 p-2 bg-black/50 rounded-full z-10"><ChevronLeft className="w-6 h-6 text-white" /></button>
      <button onClick={goNext} className="absolute right-4 p-2 bg-black/50 rounded-full z-10"><ChevronRight className="w-6 h-6 text-white" /></button>

      <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
        {stories.map((_, idx) => (
          <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div className={`h-full bg-white ${idx <= currentIndex ? 'animate-progress' : ''}`} style={{ width: idx < currentIndex ? '100%' : idx === currentIndex ? '0%' : '0%' }} />
          </div>
        ))}
      </div>

      <div className="absolute top-16 left-4 flex items-center gap-2 z-10">
        <img src={currentStory.user.avatar} className="w-8 h-8 rounded-full" alt="" />
        <span className="text-white text-sm font-medium">{currentStory.user.name}</span>
      </div>

      {currentStory.type === 'video' ? (
        <video src={currentStory.imageUrl} className="w-full h-full object-contain max-h-screen" autoPlay onEnded={goNext} />
      ) : (
        <img src={currentStory.imageUrl} className="w-full h-full object-contain max-h-screen" onClick={goNext} alt="" />
      )}
    </div>
  );
};

export default StoryViewer;
