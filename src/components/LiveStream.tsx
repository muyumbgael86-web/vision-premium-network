import React from 'react';
import { Radio } from 'lucide-react';

interface LiveStreamProps {
  user: any;
}

const LiveStream: React.FC<LiveStreamProps> = ({ user }) => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 mb-6 animate-pulse">
        <Radio className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Live Stream</h1>
      <p className="text-zinc-500 mb-6">Diffusion en direct bientôt disponible</p>
      <button className="bg-gradient-to-r from-rose-500 to-orange-500 px-8 py-3 rounded-xl font-bold">
        Démarrer un live
      </button>
    </div>
  );
};

export default LiveStream;
