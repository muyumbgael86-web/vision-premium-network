import React, { useState, useRef } from 'react';
import { Upload, Image, Video, Smile, X, Instagram, Film, MessageSquare } from 'lucide-react';
import { Post, Story } from '../types';

interface UploadModalProps {
  user: any;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
  onStoryCreated: (story: Story) => void;
}

type UploadType = 'post' | 'story' | 'reel' | 'video';

const CURRENCIES = [
  { code: 'ZAR', name: 'Rand (Afrique du Sud)', symbol: 'R' },
  { code: 'USD', name: 'Dollar (USA)', symbol: '$' },
  { code: 'EUR', name: 'Euro (Europe)', symbol: '€' },
  { code: 'GBP', name: 'Livre (UK)', symbol: '£' },
  { code: 'CDF', name: 'Franc Congolais', symbol: 'FC' },
  { code: 'XOF', name: 'Franc CFA (Afrique)', symbol: 'CFA' },
  { code: 'XAF', name: 'Franc CFA (CEEAC)', symbol: 'FCFA' },
  { code: 'NGN', name: 'Naira (Nigeria)', symbol: '₦' },
  { code: 'KES', name: 'Shilling (Kenya)', symbol: 'KSh' },
  { code: 'GHS', name: 'Cedi (Ghana)', symbol: '₵' },
  { code: 'MAD', name: 'Dirham (Maroc)', symbol: 'DH' },
  { code: 'TND', name: 'Dinar (Tunisie)', symbol: 'DT' },
  { code: 'DZD', name: 'Dinar (Algérie)', symbol: 'DA' },
  { code: 'EGP', name: 'Livre (Egypte)', symbol: 'E£' },
  { code: 'SAR', name: 'Riyal (Arabie)', symbol: '﷼' },
  { code: 'AED', name: 'Dirham (UAE)', symbol: 'د.إ' },
  { code: 'INR', name: 'Roupie (Inde)', symbol: '₹' },
  { code: 'CNY', name: 'Yuan ( Chine)', symbol: '¥' },
  { code: 'JPY', name: 'Yen (Japon)', symbol: '¥' },
  { code: 'KRW', name: 'Won (Corée)', symbol: '₩' },
  { code: 'BRL', name: 'Real (Brésil)', symbol: 'R$' },
  { code: 'ARS', name: 'Peso (Argentine)', symbol: '$' },
  { code: 'MXN', name: 'Peso (Mexique)', symbol: '$' },
  { code: 'CAD', name: 'Dollar (Canada)', symbol: 'C$' },
  { code: 'AUD', name: 'Dollar (Australie)', symbol: 'A$' },
  { code: 'CHF', name: 'Franc (Suisse)', symbol: 'CHF' },
  { code: 'RUB', name: 'Rouble (Russie)', symbol: '₽' },
  { code: 'TRY', name: 'Lire (Turquie)', symbol: '₺' },
  { code: 'PLN', name: 'Zloty (Pologne)', symbol: 'zł' },
  { code: 'CZK', name: 'Couronne (Rép.Tchèque)', symbol: 'Kč' },
  { code: 'SEK', name: 'Couronne (Suède)', symbol: 'kr' },
  { code: 'NOK', name: 'Couronne (Norvège)', symbol: 'kr' },
  { code: 'DKK', name: 'Couronne (Danemark)', symbol: 'kr' },
  { code: 'NZD', name: 'Dollar (NZ)', symbol: 'NZ$' },
  { code: 'ZMW', name: 'Kwacha (Zambie)', symbol: 'ZK' },
  { code: 'MWK', name: 'Kwacha (Malawi)', symbol: 'MK' },
  { code: 'BWP', name: 'Pula (Botswana)', symbol: 'P' },
  { code: 'MZN', name: 'Metical (Mozambique)', symbol: 'MT' },
  { code: 'SZL', name: 'Lilangeni (Eswatini)', symbol: 'L' },
  { code: 'LSL', name: 'Loti (Lesotho)', symbol: 'L' },
];

const UploadModal: React.FC<UploadModalProps> = ({ user, onClose, onPostCreated, onStoryCreated }) => {
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
  
  // Shop specific
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCurrency, setProductCurrency] = useState('USD');
  const [productDescription, setProductDescription] = useState('');
  
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

    // If it's a news category, create a post with category
    if (uploadType === 'post' && category) {
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
    }

    setIsUploading(false);
    onClose();
  };

  const uploadOptions = [
    { type: 'post' as UploadType, icon: Image, label: 'Post', color: 'from-indigo-500 to-purple-500', desc: 'Photo ou vidéo' },
    { type: 'story' as UploadType, icon: Instagram, label: 'Story', color: 'from-pink-500 to-orange-500', desc: 'Disparaît dans 24h' },
    { type: 'reel' as UploadType, icon: Film, label: 'Reel', color: 'from-rose-500 to-pink-500', desc: 'Court vidéo' },
    { type: 'video' as UploadType, icon: Video, label: 'Vidéo', color: 'from-blue-500 to-cyan-500', desc: 'Vidéo longue' },
  ];

  // Selection screen
  if (!uploadType) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Créer</h2>
            <button onClick={onClose} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {uploadOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => setUploadType(option.type)}
                className={`p-6 rounded-2xl bg-gradient-to-br ${option.color} hover:scale-105 transition-transform`}
              >
                <option.icon className="w-12 h-12 text-white mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white text-center">{option.label}</h3>
                <p className="text-white/70 text-sm text-center mt-1">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg glass rounded-2xl overflow-hidden border border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur z-10">
          <button onClick={() => setUploadType(null)} className="text-white hover:text-gray-300">
            ← Retour
          </button>
          <h2 className="font-bold text-lg text-white">
            {uploadType === 'post' && 'Nouveau Post'}
            {uploadType === 'story' && 'Nouvelle Story'}
            {uploadType === 'reel' && 'Nouveau Reel'}
            {uploadType === 'video' && 'Nouvelle Vidéo'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Category selection for news */}
          {uploadType === 'post' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700"
              >
                <option value="">Post normal</option>
                <option value="Sport">Sport</option>
                <option value="Info">Info</option>
                <option value="Savoir">Savoir</option>
                <option value="Divers">Divers</option>
              </select>
            </div>
          )}

          {/* Media type selector for story */}
          {uploadType === 'story' && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMediaType('image')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${mediaType === 'image' ? 'bg-indigo-600' : 'bg-gray-700'} text-white`}
              >
                Image
              </button>
              <button
                type="button"
                onClick={() => setMediaType('video')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${mediaType === 'video' ? 'bg-indigo-600' : 'bg-gray-700'} text-white`}
              >
                Vidéo
              </button>
            </div>
          )}

          {/* File Preview */}
          {previewUrl && (
            <div className="relative rounded-lg overflow-hidden bg-black/50">
              {mediaType === 'image' || uploadType === 'post' || uploadType === 'reel' ? (
                <img src={previewUrl} alt="Preview" className="w-full h-48 object-contain" />
              ) : (
                <video src={previewUrl} className="w-full h-48 object-contain" controls />
              )}
              <button
                type="button"
                onClick={clearFile}
                className="absolute top-2 right-2 p-1 bg-black/70 rounded-full hover:bg-black/90"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          )}

          {/* Title for news */}
          {uploadType === 'post' && category && (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'article"
              className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white border border-gray-700"
            />
          )}

          {/* Caption */}
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder={uploadType === 'post' ? "Légende..." : "Décrivez votre contenu..."}
            className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white border border-gray-700 min-h-24"
          />

          {/* Source for news */}
          {uploadType === 'post' && category && (
            <input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Source (lien)"
              className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white border border-gray-700"
            />
          )}

          {/* URL Input */}
          {!selectedFile && (
            <input
              value={contentUrl}
              onChange={(e) => setContentUrl(e.target.value)}
              placeholder="URL de l'image ou vidéo"
              className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white border border-gray-700"
            />
          )}

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
            className="w-full py-3 bg-gray-800 rounded-lg text-white font-medium flex items-center justify-center gap-2 hover:bg-gray-700"
          >
            <Image className="w-5 h-5" />
            {selectedFile ? 'Changer le fichier' : 'Sélectionner depuis la galerie'}
          </button>

          <button
            type="submit"
            disabled={isUploading || (!contentUrl && !selectedFile)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-3 rounded-xl font-bold text-white disabled:opacity-50"
          >
            {isUploading ? 'Publication...' : 'Publier'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
