import React from 'react';
import { Story } from '../types';
import { Plus, CheckCircle2 } from 'lucide-react';

interface StoryBarProps {
  stories: Story[];
  user: any;
  onAddStory: () => void;
  onViewStory: (userId: string) => void;
}

const StoryBar: React.FC<StoryBarProps> = ({ stories, user, onAddStory, onViewStory }) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
      <div className="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer" onClick={onAddStory}>
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
          <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
            <Plus className="w-6 h-6 text-white" />
          </div>
        </div>
        <span className="text-[10px] text-zinc-400">Ajouter</span>
      </div>

      {stories.map((story) => (
        <div key={story.id} className="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer" onClick={() => onViewStory(story.user.id)}>
          <div className={`w-16 h-16 rounded-full p-[2px] ${story.viewed ? 'bg-zinc-700' : 'bg-gradient-to-br from-rose-500 to-orange-500'}`}>
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-zinc-900">
              <img src={story.imageUrl || story.user.avatar} className="w-full h-full object-cover" alt="" />
            </div>
          </div>
          <span className="text-[10px] text-zinc-400 truncate w-16 text-center">{story.user.name}</span>
        </div>
      ))}
    </div>
  );
};

export default StoryBar;
