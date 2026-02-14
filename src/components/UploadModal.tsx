import React, { useState, useRef } from 'react';
import { Upload, Image, Video, X, Instagram, Film, Sparkles, ArrowRight, Heart, Share2, MessageCircle } from 'lucide-react';
import { Post, Story } from '../types';

interface UploadModalProps {
  user: any;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
  onStoryCreated: (story: Story) => void;
}

type UploadType = 'post' | 'story' | 'reel' | 'video';

const UploadModal: React.FC<UploadModalProps> = ({ user, onClose, onPostCreated, onStoryCreated }) => {
  const [step, setStep] = useState<'selection' | 'create'>('selection');
  const [uploadType, setUploadType] = useState<UploadType | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [contentUrl, setContentUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      setContentUrl(fileUrl);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      setContentUrl(fileUrl);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setContentUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    // Generate persistent URL for images
    const getImageUrl = () => {
      if (selectedFile && selectedFile.type.startsWith('image/')) {
        return URL.createObjectURL(selectedFile);
      }
      return `https://picsum.photos/seed/${Date.now()}/800/600`;
    };

    if (uploadType === 'reel') {
      const newPost: Post = {
        id: Date.now().toString(),
        author: user,
        type: 'reel',
        contentUrl: getImageUrl(),
        caption,
        likes: [],
        comments: [],
        shares: 0,
        views: 0,
        timestamp: Date.now()
      };
      onPostCreated(newPost);
    } else if (uploadType === 'video') {
      const newPost: Post = {
        id: Date.now().toString(),
        author: user,
        type: 'video',
        contentUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
        caption,
        likes: [],
        comments: [],
        shares: 0,
        views: 0,
        timestamp: Date.now()
      };
      onPostCreated(newPost);
    } else if (uploadType === 'story') {
      // Only create ONE story, not multiple
      const newStory: Story = {
        id: Date.now().toString(),
        user: user,
        imageUrl: getImageUrl(),
        type: 'image',
        viewed: false,
        views: 0,
        timestamp: Date.now()
      };
      onStoryCreated(newStory);
    } else {
      const newPost: Post = {
        id: Date.now().toString(),
        author: user,
        type: 'image',
        contentUrl: getImageUrl(),
        caption,
        likes: [],
        comments: [],
        shares: 0,
        views: 0,
        timestamp: Date.now()
      };
      onPostCreated(newPost);
    }

    setIsUploading(false);
    onClose();
  };

  // Only 4 options - rounded buttons
  const uploadOptions = [
    { type: 'post' as UploadType, icon: Image, label: 'Post', color: 'from-red-500 to-pink-500', iconBg: 'bg-red-500' },
    { type: 'story' as UploadType, icon: Instagram, label: 'Story', color: 'from-pink-500 to-orange-500', iconBg: 'bg-pink-500' },
    { type: 'reel' as UploadType, icon: Film, label: 'Reel', color: 'from-purple-500 to-indigo-500', iconBg: 'bg-purple-500' },
    { type: 'video' as UploadType, icon: Video, label: 'Video', color: 'from-blue-500 to-cyan-500', iconBg: 'bg-blue-500' },
  ];

  // Selection screen
  if (step === 'selection') {
    return (
      <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
        <div className="relative w-full max-w-xs">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <h2 className="text-lg font-bold text-white">Creer</h2>
            </div>
            <button onClick={onClose} className="p-2 bg-white/10 rounded-full">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Options Grid - 4 rounded buttons */}
          <div className="grid grid-cols-2 gap-3">
            {uploadOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => {
                  setUploadType(option.type);
                  setStep('create');
                }}
                className={`p-5 rounded-2xl bg-gradient-to-br ${option.color} hover:scale-105 transition-all duration-300 shadow-lg`}
              >
                <div className={`w-12 h-12 ${option.iconBg} rounded-full flex items-center justify-center mb-3 shadow-lg`}>
                  <option.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">{option.label}</h3>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Creation form
  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm">
        {/* Glass form container */}
        <div className="glass-form rounded-2xl overflow-hidden border border-white/10 shadow-xl max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-black/60 backdrop-blur-md border-b border-white/10 p-3 flex items-center justify-between z-10">
            <button
              onClick={() => setStep('selection')}
              className="flex items-center gap-1 text-gray-400 hover:text-white text-sm"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Retour
            </button>

            <h2 className="font-bold text-white text-sm">
              {uploadType === 'post' && 'Nouveau Post'}
              {uploadType === 'story' && 'Story'}
              {uploadType === 'reel' && 'Reel'}
              {uploadType === 'video' && 'Video'}
            </h2>

            <button onClick={onClose} className="p-1.5 bg-white/10 rounded-full">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            {/* Media type for story */}
            {uploadType === 'story' && (
              <div className="flex gap-1 p-1 bg-white/5 rounded-full">
                <button
                  type="button"
                  onClick={() => setMediaType('image')}
                  className={`flex-1 py-2 rounded-full text-xs font-medium ${mediaType === 'image' ? 'bg-red-500 text-white' : 'text-gray-400'}`}
                >
                  Image
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`flex-1 py-2 rounded-full text-xs font-medium ${mediaType === 'video' ? 'bg-red-500 text-white' : 'text-gray-400'}`}
                >
                  Video
                </button>
              </div>
            )}

            {/* Drop zone / Preview */}
            <div
              className={`relative rounded-2xl overflow-hidden transition-all ${dragActive ? 'border-2 border-red-500' : 'border-2 border-dashed border-white/20'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className="relative">
                  <img src={previewUrl} alt="Preview" className="w-full h-48 object-contain bg-black/50 rounded-2xl" />
                  <button
                    type="button"
                    onClick={clearFile}
                    className="absolute top-2 right-2 p-2 bg-black/60 rounded-full hover:bg-black/80"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-white text-sm mb-2">Glissez-deposez ou</p>
                  <p className="text-gray-400 text-xs">selectionnez depuis la galerie</p>
                </div>
              )}
            </div>

            {/* File input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 bg-white/10 border border-white/10 rounded-xl text-white text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
            >
              <Image className="w-5 h-5" />
              {selectedFile ? 'Changer le fichier' : 'Ajouter depuis la galerie'}
            </button>

            {/* Caption */}
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Ajouter une legende..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm min-h-24 resize-none placeholder-gray-400"
            />

            {/* Submit button */}
            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl font-bold text-white text-sm disabled:opacity-50 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all"
            >
              {isUploading ? 'Publication...' : 'Publier'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .glass-form {
          background: rgba(30, 30, 30, 0.8);
          backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
};

export default UploadModal;
