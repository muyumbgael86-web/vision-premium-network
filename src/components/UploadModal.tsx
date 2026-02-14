import React, { useState, useRef } from 'react';
import { Upload, Image, Video, Smile, X } from 'lucide-react';
import { Post, Story } from '../types';

interface UploadModalProps {
  user: any;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
  onStoryCreated: (story: Story) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ user, onClose, onPostCreated, onStoryCreated }) => {
  const [type, setType] = useState<'post' | 'story'>('post');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [contentUrl, setContentUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create local URL for preview
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

    let finalUrl = contentUrl;

    // If a file was selected, use local preview URL
    // In production, upload to Supabase Storage
    if (selectedFile) {
      finalUrl = previewUrl || contentUrl;
    }

    if (type === 'post') {
      const newPost: Post = {
        id: Date.now().toString(),
        author: user,
        type: mediaType === 'image' ? 'image' : 'video',
        contentUrl: finalUrl || `https://picsum.photos/seed/${Date.now()}/800/600`,
        caption,
        likes: [],
        comments: [],
        shares: 0,
        views: 0,
        timestamp: Date.now()
      };
      onPostCreated(newPost);
    } else {
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

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass w-full max-w-lg rounded-2xl overflow-hidden border border-white/20">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-bold text-lg">Créer</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><span className="text-2xl">&times;</span></button>
        </div>

        <div className="flex border-b border-white/10">
          <button onClick={() => setType('post')} className={`flex-1 py-3 font-medium ${type === 'post' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-zinc-500'}`}>Post</button>
          <button onClick={() => setType('story')} className={`flex-1 py-3 font-medium ${type === 'story' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-zinc-500'}`}>Story</button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="flex gap-2">
            <button type="button" onClick={() => setMediaType('image')} className={`flex-1 py-2 rounded-lg text-sm font-medium ${mediaType === 'image' ? 'bg-indigo-600' : 'bg-white/10'}`}>Image</button>
            <button type="button" onClick={() => setMediaType('video')} className={`flex-1 py-2 rounded-lg text-sm font-medium ${mediaType === 'video' ? 'bg-indigo-600' : 'bg-white/10'}`}>Vidéo</button>
          </div>

          {/* File Preview */}
          {previewUrl && (
            <div className="relative rounded-lg overflow-hidden bg-black/50">
              {mediaType === 'image' ? (
                <img src={previewUrl} alt="Preview" className="w-full h-48 object-contain" />
              ) : (
                <video src={previewUrl} className="w-full h-48 object-contain" controls />
              )}
              <button
                type="button"
                onClick={clearFile}
                className="absolute top-2 right-2 p-1 bg-black/70 rounded-full hover:bg-black/90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* URL Input */}
          {!selectedFile && (
            <input
              value={contentUrl}
              onChange={(e) => setContentUrl(e.target.value)}
              placeholder="URL de l'image ou vidéo"
              className="w-full bg-white/5 rounded-lg px-4 py-3 text-sm outline-none border border-white/10"
            />
          )}

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder={type === 'post' ? "Légende..." : "Décrivez votre story..."}
            className="w-full bg-white/5 rounded-lg px-4 py-3 text-sm outline-none border border-white/10 min-h-24"
          />

          <div className="flex gap-2">
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
              className="flex-1 py-2 bg-white/10 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/20"
            >
              <Image className="w-4 h-4" /> Galerie
            </button>
            <button type="button" className="flex-1 py-2 bg-white/10 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/20">
              <Smile className="w-4 h-4" /> Emoji
            </button>
          </div>

          <button type="submit" className="w-full bg-indigo-600 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
            Publier
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
