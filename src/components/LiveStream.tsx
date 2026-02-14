import React, { useState } from 'react';
import { Radio, Users, Heart, MessageCircle, Share2, Gift, Crown, X, Mic, Video, VideoOff } from 'lucide-react';

interface LiveStreamProps {
  user: any;
}

interface LiveUser {
  id: string;
  name: string;
  avatar: string;
  viewers: number;
  isLive: boolean;
  title: string;
  category: string;
}

const LiveStream: React.FC<LiveStreamProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'live' | 'discover'>('discover');
  const [myMicOn, setMyMicOn] = useState(true);
  const [myCamOn, setMyCamOn] = useState(true);

  // Simulated live users for demo
  const liveUsers: LiveUser[] = [
    { id: '1', name: 'Princess L.', avatar: 'https://picsum.photos/seed/princess/200', viewers: 12400, isLive: true, title: 'Music night 🎵', category: 'Musique' },
    { id: '2', name: 'DJ Kemba', avatar: 'https://picsum.photos/seed/djkemba/200', viewers: 8900, isLive: true, title: 'Mixing live', category: 'DJ' },
    { id: '3', name: 'Sarah O.', avatar: 'https://picsum.photos/seed/sarah/200', viewers: 5600, isLive: true, title: 'Cooking class', category: 'Cuisine' },
    { id: '4', name: 'Coach Mike', avatar: 'https://picsum.photos/seed/coach/200', viewers: 12300, isLive: true, title: 'Workout time', category: 'Sport' },
    { id: '5', name: 'Beauty by A.', avatar: 'https://picsum.photos/seed/beauty/200', viewers: 7800, isLive: true, title: 'Makeup tutorial', category: 'Beauté' },
    { id: '6', name: 'Tech Talk', avatar: 'https://picsum.photos/seed/tech/200', viewers: 4500, isLive: true, title: 'New phone review', category: 'Tech' },
  ];

  return (
    <div className="pb-20">
      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('discover')}
          className={`pb-2 px-1 font-medium ${activeTab === 'discover' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
        >
          Découvrir
        </button>
        <button
          onClick={() => setActiveTab('live')}
          className={`pb-2 px-1 font-medium flex items-center gap-1 ${activeTab === 'live' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
        >
          <Radio className="w-4 h-4 animate-pulse" /> En direct
        </button>
      </div>

      {activeTab === 'discover' ? (
        <>
          {/* Featured Categories */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {['Tous', 'Musique', 'DJ', 'Cuisine', 'Sport', 'Beauté', 'Tech', 'Dance', 'Chat', 'Jeux'].map((cat, i) => (
              <button
                key={cat}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium ${i === 0 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Live Users Grid */}
          <div className="grid grid-cols-2 gap-3">
            {liveUsers.map((live) => (
              <div key={live.id} className="relative rounded-xl overflow-hidden aspect-[4/5] cursor-pointer">
                <img src={live.avatar} alt={live.name} className="w-full h-full object-cover" />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                {/* Live badge */}
                <div className="absolute top-2 left-2 bg-rose-500 px-2 py-0.5 rounded text-xs font-bold text-white flex items-center gap-1">
                  <Radio className="w-3 h-3" /> LIVE
                </div>
                
                {/* Viewers */}
                <div className="absolute top-2 right-2 bg-black/50 px-2 py-0.5 rounded text-xs text-white flex items-center gap-1">
                  <Users className="w-3 h-3" /> {(live.viewers / 1000).toFixed(1)}K
                </div>
                
                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-white font-semibold text-sm truncate">{live.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <img src={live.avatar} alt="" className="w-5 h-5 rounded-full" />
                    <span className="text-white/80 text-xs">{live.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* TikTok-style Live Room */
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-4">
                <Radio className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Démarrer un live</h2>
              <p className="text-white/80 text-sm mb-4">Partagez des moments spéciaux avec vos abonnés!</p>
              
              <div className="flex justify-center gap-4 mb-4">
                <button
                  onClick={() => setMyMicOn(!myMicOn)}
                  className={`p-3 rounded-full ${myMicOn ? 'bg-white/20' : 'bg-rose-500'}`}
                >
                  <Mic className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setMyCamOn(!myCamOn)}
                  className={`p-3 rounded-full ${myCamOn ? 'bg-white/20' : 'bg-rose-500'}`}
                >
                  {myCamOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </button>
              </div>
              
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold w-full">
                COMMENCER LE LIVE
              </button>
            </div>
          </div>

          {/* Top Live Streams */}
          <h3 className="font-bold text-gray-900">Top Lives</h3>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {liveUsers.slice(0, 5).map((live) => (
              <div key={live.id} className="flex-shrink-0 w-28 text-center">
                <div className="relative">
                  <img src={live.avatar} alt={live.name} className="w-20 h-20 rounded-full mx-auto object-cover" />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-rose-500 px-1.5 py-0.5 rounded text-[10px] font-bold text-white">
                    TOP
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900 mt-2 truncate">{live.name}</p>
                <p className="text-xs text-gray-500">{(live.viewers / 1000).toFixed(0)}K</p>
              </div>
            ))}
          </div>

          {/* Recommended Live */}
          <h3 className="font-bold text-gray-900">Pour vous</h3>
          <div className="relative rounded-xl overflow-hidden aspect-video cursor-pointer">
            <img src="https://picsum.photos/seed/live1/600/340" alt="Live" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-rose-500 px-2 py-0.5 rounded text-xs font-bold text-white flex items-center gap-1">
                  <Radio className="w-3 h-3" /> LIVE
                </span>
              </div>
              <p className="text-white font-medium">DJ Club Night 🎧</p>
              <p className="text-white/70 text-sm">2.5K spectateurs</p>
            </div>
            <button className="absolute bottom-3 right-3 bg-white/20 backdrop-blur px-3 py-1.5 rounded-lg text-white text-sm">
              Rejoindre
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveStream;
