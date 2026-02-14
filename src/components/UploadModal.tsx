import React, { useState, useRef } from 'react';
import { Upload, Image, Video, X, Instagram, Film, MessageSquare, Globe, Sparkles, Zap, ArrowRight, Heart, Share2, MessageCircle } from 'lucide-react';
import { Post, Story } from '../types';

interface UploadModalProps {
  user: any;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
  onStoryCreated: (story: Story) => void;
}

type UploadType = 'post' | 'story' | 'reel' | 'video' | 'news';

const CURRENCIES = [
  { code: 'ZAR', name: 'Rand (Afrique du Sud)', symbol: 'R' },
  { code: 'USD', name: 'Dollar (USA)', symbol: '$' },
  { code: 'EUR', name: 'Euro (Europe)', symbol: '€' },
  { code: 'GBP', name: 'Livre (UK)', symbol: '£' },
  { code: 'CDF', name: 'Franc Congolais', symbol: 'FC' },
  { code: 'XOF', name: 'Franc CFA (Afrique)', symbol: 'CFA' },
  { code: 'NGN', name: 'Naira (Nigeria)', symbol: '₦' },
  { code: 'KES', name: 'Shilling (Kenya)', symbol: 'KSh' },
];

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
    { type: 'post' as UploadType, icon: Image, label: 'Post', color: 'from-indigo-500 via-purple-500 to-pink-500', desc: 'Photo pour vos abonnés', iconBg: 'bg-indigo-500' },
    { type: 'news' as UploadType, icon: Globe, label: 'Actualité', color: 'from-blue-500 via-cyan-500 to-teal-500', desc: 'News & Informations', iconBg: 'bg-blue-500' },
    { type: 'story' as UploadType, icon: Instagram, label: 'Story', color: 'from-pink-500 via-rose-500 to-orange-500', desc: 'Disparaît dans 24h', iconBg: 'bg-pink-500' },
    { type: 'reel' as UploadType, icon: Film, label: 'Reel', color: 'from-rose-500 via-red-500 to-orange-500', desc: 'Vidéo virale', iconBg: 'bg-rose-500' },
    { type: 'video' as UploadType, icon: Video, label: 'Vidéo', color: 'from-violet-500 via-purple-500 to-indigo-500', desc: 'Contenu long', iconBg: 'bg-violet-500' },
  ];

  // Selection screen
  if (step === 'selection') {
    return (
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-gradient-to-r from-pink-500/30 to-rose-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Créer</h2>
                <p className="text-gray-400 text-sm">Partagez avec le monde</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-3 bg-white/10 backdrop-blur rounded-xl hover:bg-white/20 transition-all border border-white/10"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-4">
            {uploadOptions.map((option, index) => (
              <button
                key={option.type}
                onClick={() => {
                  setUploadType(option.type);
                  setStep('create');
                }}
                className={`group relative p-6 rounded-2xl bg-gradient-to-br ${option.color} hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <div className={`w-14 h-14 ${option.iconBg} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <option.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">{option.label}</h3>
                <p className="text-white/70 text-sm">{option.desc}</p>
                
                {/* Arrow indicator */}
                <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </button>
            ))}
          </div>

          {/* Quick actions */}
          <div className="mt-6 flex justify-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Zap className="w-4 h-4" />
              <span>Publication instantanée</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Creation form
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-indigo-500/10 via-transparent to-purple-500/10" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Glass form container */}
        <div className="glass-form rounded-3xl overflow-hidden border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-black/50 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between z-10">
            <button 
              onClick={() => setStep('selection')} 
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <ArrowRight className="w-4 h-4 rotate-180" />
              </div>
              <span>Retour</span>
            </button>
            
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                uploadType === 'post' ? 'bg-indigo-500' :
                uploadType === 'news' ? 'bg-blue-500' :
                uploadType === 'story' ? 'bg-pink-500' :
                uploadType === 'reel' ? 'bg-rose-500' :
                'bg-violet-500'
              }`}>
                {uploadType === 'post' && <Image className="w-4 h-4 text-white" />}
                {uploadType === 'news' && <Globe className="w-4 h-4 text-white" />}
                {uploadType === 'story' && <Instagram className="w-4 h-4 text-white" />}
                {uploadType === 'reel' && <Film className="w-4 h-4 text-white" />}
                {uploadType === 'video' && <Video className="w-4 h-4 text-white" />}
              </div>
              <h2 className="font-bold text-lg text-white">
                {uploadType === 'post' && 'Nouveau Post'}
                {uploadType === 'news' && 'Nouvelle Actualité'}
                {uploadType === 'story' && 'Nouvelle Story'}
                {uploadType === 'reel' && 'Nouveau Reel'}
                {uploadType === 'video' && 'Nouvelle Vidéo'}
              </h2>
            </div>
            
            <button 
              onClick={onClose} 
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Category for news */}
            {uploadType === 'news' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Catégorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="">Type d'actualité</option>
                  <option value="Sport">Sport</option>
                  <option value="Info">Info</option>
                  <option value="Savoir">Savoir</option>
                  <option value="Divers">Divers</option>
                </select>
              </div>
            )}

            {/* Media type for story */}
            {uploadType === 'story' && (
              <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMediaType('image')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    mediaType === 'image' 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Image
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    mediaType === 'video' 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Vidéo
                </button>
              </div>
            )}

            {/* Drop zone / Preview */}
            <div
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                dragActive 
                  ? 'border-2 border-indigo-500 bg-indigo-500/10' 
                  : 'border-2 border-dashed border-white/20 hover:border-white/40'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className="relative">
                  {mediaType === 'image' || uploadType === 'post' || uploadType === 'reel' || uploadType === 'news' ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-56 object-contain bg-black/50" />
                  ) : (
                    <video src={previewUrl} className="w-full h-56 object-contain bg-black/50" controls />
                  )}
                  <button
                    type="button"
                    onClick={clearFile}
                    className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur rounded-full hover:bg-black/80 transition-all"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  
                  {/* Stats overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-center gap-6">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur rounded-full">
                      <Heart className="w-4 h-4 text-white/80" />
                      <span className="text-white/80 text-xs">0</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur rounded-full">
                      <MessageCircle className="w-4 h-4 text-white/80" />
                      <span className="text-white/80 text-xs">0</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur rounded-full">
                      <Share2 className="w-4 h-4 text-white/80" />
                      <span className="text-white/80 text-xs">0</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-indigo-400" />
                  </div>
                  <p className="text-white mb-2">Glissez-déposez votre média</p>
                  <p className="text-gray-400 text-sm">ou</p>
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
              className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
            >
              <Image className="w-5 h-5" />
              {selectedFile ? 'Changer le fichier' : 'Sélectionner depuis la galerie'}
            </button>

            {/* Title for news */}
            {uploadType === 'news' && category && (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de l'actualité"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            )}

            {/* Caption */}
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={uploadType === 'news' ? "Détaillez l'actualité..." : "Légende..."}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 min-h-28 resize-none focus:outline-none focus:border-indigo-500 transition-colors"
            />

            {/* Source for news */}
            {uploadType === 'news' && category && (
              <input
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Source (lien optionnel)"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            )}

            {/* URL fallback */}
            {!selectedFile && (
              <input
                value={contentUrl}
                onChange={(e) => setContentUrl(e.target.value)}
                placeholder="Ou collez une URL..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isUploading || (!contentUrl && !selectedFile)}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl font-bold text-white disabled:opacity-50 hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publication...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Publier maintenant
                </>
              )}
            </button>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-4 text-center text-gray-400 text-sm">
          <span className="flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            Conseil: Les publications avec images reçoivent 2x plus d'engagement
          </span>
        </div>
      </div>

      <style>{`
        .glass-form {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
        }
      `}</style>
    </div>
  );
};

export default UploadModal;
