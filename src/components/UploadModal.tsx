import React, { useState, useRef } from 'react';
import { Upload, Image, Video, X, Instagram, Film, Globe, Sparkles, ArrowRight, Heart, Share2, MessageCircle } from 'lucide-react';
import { Post, Story } from '../types';

interface UploadModalProps {
  user: any;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
  onStoryCreated: (story: Story) => void;
}

type UploadType = 'post' | 'story' | 'reel' | 'video' | 'news';

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
  const [category, setCategory] = useState<string>('');
  const [source, setSource] = useState('');
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

    let finalUrl = contentUrl;
    if (selectedFile) {
      finalUrl = previewUrl || contentUrl;
    }

    if (uploadType === 'news') {
      const newPost: Post = {
        id: Date.now().toString(),
        author: user,
        type: 'news',
        contentUrl: finalUrl || `https://picsum.photos/seed/${Date.now()}/800/600`,
        caption,
        title,
        source,
        likes: [],
        comments: [],
        shares: 0,
        views: 0,
        timestamp: Date.now(),
        category: category as any
      };
      onPostCreated(newPost);
    } else if (uploadType === 'reel') {
      const newPost: Post = {
        id: Date.now().toString(),
        author: user,
        type: 'reel',
        contentUrl: finalUrl || `https://picsum.photos/seed/${Date.now()}/1080/1920`,
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
        contentUrl: finalUrl || `https://picsum.photos/seed/${Date.now()}/1920/1080`,
        caption,
        likes: [],
        comments: [],
        shares: 0,
        views: 0,
        timestamp: Date.now()
      };
      onPostCreated(newPost);
    } else if (uploadType === 'story') {
      const newStory: Story = {
        id: Date.now().toString(),
        user: user,
        imageUrl: finalUrl || `https://picsum.photos/seed/${Date.now()}/1080/1920`,
        type: mediaType as 'image' | 'video',
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
        contentUrl: finalUrl || `https://picsum.photos/seed/${Date.now()}/1080/1080`,
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

  const uploadOptions = [
    { type: 'post' as UploadType, icon: Image, label: 'Post', color: 'from-indigo-500 to-purple-500', iconBg: 'bg-indigo-500' },
    { type: 'news' as UploadType, icon: Globe, label: 'News', color: 'from-blue-500 to-cyan-500', iconBg: 'bg-blue-500' },
    { type: 'story' as UploadType, icon: Instagram, label: 'Story', color: 'from-pink-500 to-orange-500', iconBg: 'bg-pink-500' },
    { type: 'reel' as UploadType, icon: Film, label: 'Reel', color: 'from-rose-500 to-red-500', iconBg: 'bg-rose-500' },
    { type: 'video' as UploadType, icon: Video, label: 'Video', color: 'from-violet-500 to-indigo-500', iconBg: 'bg-violet-500' },
  ];

  // Selection screen
  if (step === 'selection') {
    return (
      <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
        <div className="relative w-full max-w-xs">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <h2 className="text-lg font-bold text-white">Creer</h2>
            </div>
            <button onClick={onClose} className="p-2 bg-white/10 rounded-lg">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Options Grid - Smaller */}
          <div className="grid grid-cols-2 gap-2">
            {uploadOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => {
                  setUploadType(option.type);
                  setStep('create');
                }}
                className={`p-4 rounded-xl bg-gradient-to-br ${option.color} hover:scale-105 transition-transform`}
              >
                <div className={`w-10 h-10 ${option.iconBg} rounded-lg flex items-center justify-center mb-2`}>
                  <option.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-white">{option.label}</h3>
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
        {/* Glass form container - Smaller */}
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
              {uploadType === 'news' && 'Actualite'}
              {uploadType === 'story' && 'Story'}
              {uploadType === 'reel' && 'Reel'}
              {uploadType === 'video' && 'Video'}
            </h2>
            
            <button onClick={onClose} className="p-1.5 bg-white/10 rounded-lg">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            {/* Category for news */}
            {uploadType === 'news' && (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="">Categorie</option>
                <option value="Sport">Sport</option>
                <option value="Info">Info</option>
                <option value="Savoir">Savoir</option>
                <option value="Divers">Divers</option>
              </select>
            )}

            {/* Media type for story */}
            {uploadType === 'story' && (
              <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setMediaType('image')}
                  className={`flex-1 py-1.5 rounded text-xs font-medium ${mediaType === 'image' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
                >
                  Image
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`flex-1 py-1.5 rounded text-xs font-medium ${mediaType === 'video' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
                >
                  Video
                </button>
              </div>
            )}

            {/* Drop zone / Preview */}
            <div
              className={`relative rounded-xl overflow-hidden transition-all ${dragActive ? 'border-2 border-indigo-500' : 'border-2 border-dashed border-white/20'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className="relative">
                  <img src={previewUrl} alt="Preview" className="w-full h-40 object-contain bg-black/50" />
                  <button
                    type="button"
                    onClick={clearFile}
                    className="absolute top-2 right-2 p-1 bg-black/60 rounded-full"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-white text-sm">Glissez-deposez</p>
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
              className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm flex items-center justify-center gap-2"
            >
              <Image className="w-4 h-4" />
              {selectedFile ? 'Changer' : 'Galerie'}
            </button>

            {/* Caption */}
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Legende..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm min-h-20 resize-none"
            />

            {/* Title for news */}
            {uploadType === 'news' && category && (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
              />
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isUploading || (!contentUrl && !selectedFile)}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-bold text-white text-sm disabled:opacity-50"
            >
              {isUploading ? 'Publication...' : 'Publier'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .glass-form {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
};

export default UploadModal;
