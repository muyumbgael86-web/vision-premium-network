import React, { useState, useEffect } from 'react';
import { Radio, Users, Heart, MessageCircle, Share2, Gift, Crown, X, Mic, Video, VideoOff, Play } from 'lucide-react';

interface LiveStreamProps {
  user: any;
}

interface LiveStream {
  id: string;
  streamer: {
    id: string;
    name: string;
    avatar: string;
    isVerified: boolean;
  };
  title: string;
  category: string;
  viewers: number;
  likes: number;
  isLive: boolean;
  thumbnail: string;
}

// Simulated live streams data
const INITIAL_LIVES: LiveStream[] = [
  {
    id: '1',
    streamer: { id: 'djmax', name: 'DJ Max Oficial', avatar: 'https://picsum.photos/seed/djmax/200', isVerified: true },
    title: '🔥 mix electro deep house tonight',
    category: 'Musique',
    viewers: 12400,
    likes: 89000,
    isLive: true,
    thumbnail: 'https://picsum.photos/seed/live1/400/600'
  },
  {
    id: '2',
    streamer: { id: 'chefsarah', name: 'Chef Sarah', avatar: 'https://picsum.photos/seed/chefsarah/200', isVerified: true },
    title: 'Cuisine africain 🍲 Recette du jour',
    category: 'Cuisine',
    viewers: 5600,
    likes: 34000,
    isLive: true,
    thumbnail: 'https://picsum.photos/seed/live2/400/600'
  },
  {
    id: '3',
    streamer: { id: 'coachmike', name: 'Coach Mike', avatar: 'https://picsum.photos/seed/coachmike/200', isVerified: true },
    title: 'Entrainement💪 30min full body',
    category: 'Sport',
    viewers: 8900,
    likes: 56000,
    isLive: true,
    thumbnail: 'https://picsum.photos/seed/live3/400/600'
  },
  {
    id: '4',
    streamer: { id: 'beautybyami', name: 'Beauty by Ami', avatar: 'https://picsum.photos/seed/beautyami/200', isVerified: false },
    title: 'Tuto makeup glam今晚',
    category: 'Beauté',
    viewers: 4500,
    likes: 23000,
    isLive: true,
    thumbnail: 'https://picsum.photos/seed/live4/400/600'
  },
  {
    id: '5',
    streamer: { id: 'techguru', name: 'Tech Guru', avatar: 'https://picsum.photos/seed/techguru/200', isVerified: true },
    title: 'Unbox new phone 📱',
    category: 'Tech',
    viewers: 7800,
    likes: 45000,
    isLive: true,
    thumbnail: 'https://picsum.photos/seed/live5/400/600'
  },
  {
    id: '6',
    streamer: { id: 'dancequeen', name: 'Dance Queen', avatar: 'https://picsum.photos/seed/dancequeen/200', isVerified: true },
    title: '💃 Kwaito dance challenge',
    category: 'Dance',
    viewers: 15600,
    likes: 120000,
    isLive: true,
    thumbnail: 'https://picsum.photos/seed/live6/400/600'
  },
];

const LiveStream: React.FC<LiveStreamProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'live' | 'discover'>('live');
  const [myMicOn, setMyMicOn] = useState(true);
  const [myCamOn, setMyCamOn] = useState(true);
  const [lives, setLives] = useState<LiveStream[]>(INITIAL_LIVES);
  const [selectedLive, setSelectedLive] = useState<LiveStream | null>(null);

  // Simulate live viewers updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLives(prev => prev.map(live => ({
        ...live,
        viewers: live.viewers + Math.floor(Math.random() * 10) - 3,
        likes: live.likes + Math.floor(Math.random() * 50)
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const categories = ['Tous', 'Musique', 'Dance', 'Cuisine', 'Sport', 'Beauté', 'Tech', 'Chat', 'Jeux', ' Lifestyle'];

  if (selectedLive) {
    return (
      <div className="h-full bg-black relative">
        {/* Back button */}
        <button
          onClick={() => setSelectedLive(null)}
          className="absolute top-4 left-4 z-10 p-2 bg-black/50 rounded-full text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Live Video Placeholder */}
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
          <div className="text-center">
            <img
              src={selectedLive.thumbnail}
              alt={selectedLive.title}
              className="w-full h-[60vh] object-cover opacity-50"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-20">
              <div className="flex items-center gap-3 mb-2">
                <img src={selectedLive.streamer.avatar} alt="" className="w-12 h-12 rounded-full border-2 border-white" />
                <div className="text-left">
                  <p className="text-white font-bold">{selectedLive.streamer.name}</p>
                  <p className="text-white/70 text-sm">{selectedLive.title}</p>
                </div>
              </div>
              <p className="text-white/60 text-sm">{selectedLive.viewers.toLocaleString()} spectateurs</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
          <button className="p-4 bg-gray-700 rounded-full text-white">
            <Heart className="w-6 h-6" />
          </button>
          <button className="p-4 bg-gray-700 rounded-full text-white">
            <MessageCircle className="w-6 h-6" />
          </button>
          <button className="p-4 bg-gray-700 rounded-full text-white">
            <Share2 className="w-6 h-6" />
          </button>
          <button className="p-4 bg-indigo-600 rounded-full text-white">
            <Gift className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('live')}
          className={`pb-2 px-1 font-medium flex items-center gap-1 ${activeTab === 'live' ? 'text-rose-500 border-b-2 border-rose-500' : 'text-gray-400'}`}
        >
          <Radio className="w-4 h-4" /> En direct
        </button>
        <button
          onClick={() => setActiveTab('discover')}
          className={`pb-2 px-1 font-medium ${activeTab === 'discover' ? 'text-rose-500 border-b-2 border-rose-500' : 'text-gray-400'}`}
        >
          Découvrir
        </button>
      </div>

      {activeTab === 'discover' ? (
        <>
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium ${i === 0 ? 'bg-white text-black' : 'bg-gray-800 text-gray-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Live Grid */}
          <div className="grid grid-cols-2 gap-3">
            {lives.map((live) => (
              <div
                key={live.id}
                onClick={() => setSelectedLive(live)}
                className="relative rounded-xl overflow-hidden aspect-[4/5] cursor-pointer"
              >
                <img src={live.thumbnail} alt={live.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-2 left-2 bg-rose-500 px-2 py-0.5 rounded text-xs font-bold text-white flex items-center gap-1">
                  <Radio className="w-3 h-3" /> LIVE
                </div>
                <div className="absolute bottom-2 left-2">
                  <p className="text-white font-semibold text-sm truncate">{live.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <img src={live.streamer.avatar} alt="" className="w-5 h-5 rounded-full" />
                    <span className="text-white/80 text-xs">{live.streamer.name}</span>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-black/50 px-2 py-0.5 rounded text-xs text-white flex items-center gap-1">
                  <Users className="w-3 h-3" /> {(live.viewers / 1000).toFixed(1)}K
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* TikTok-style Live */
        <div className="space-y-4">
          {/* Start Live Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-4">
                <Radio className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Démarrer un live</h2>
              <p className="text-white/80 text-sm mb-4">Partagez des moments avec vos abonnés!</p>
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

          {/* Top Live Streamers */}
          <h3 className="font-bold text-white text-lg">Top Lives</h3>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {lives.sort((a, b) => b.viewers - a.viewers).slice(0, 5).map((live) => (
              <div
                key={live.id}
                onClick={() => setSelectedLive(live)}
                className="flex-shrink-0 w-28 text-center cursor-pointer"
              >
                <div className="relative">
                  <img src={live.streamer.avatar} alt={live.streamer.name} className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-rose-500" />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-rose-500 px-1.5 py-0.5 rounded text-[10px] font-bold text-white">
                    TOP
                  </div>
                </div>
                <p className="text-sm font-medium text-white mt-2 truncate">{live.streamer.name}</p>
                <p className="text-xs text-gray-400">{(live.viewers / 1000).toFixed(0)}K</p>
              </div>
            ))}
          </div>

          {/* Recommended */}
          <h3 className="font-bold text-white text-lg">Pour vous</h3>
          <div
            onClick={() => setSelectedLive(lives[0])}
            className="relative rounded-xl overflow-hidden aspect-video cursor-pointer"
          >
            <img src={lives[0].thumbnail} alt="Live" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-rose-500 px-2 py-0.5 rounded text-xs font-bold text-white flex items-center gap-1">
                  <Radio className="w-3 h-3" /> LIVE
                </span>
              </div>
              <p className="text-white font-medium">{lives[0].title}</p>
              <p className="text-white/70 text-sm">{lives[0].viewers.toLocaleString()} spectateurs</p>
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
