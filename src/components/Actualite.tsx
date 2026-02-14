import React, { useState, useRef } from 'react';
import { Post, ContentCategory } from '../types';
import { Send, Image, Video, Newspaper, Heart, MessageCircle, X, Camera } from 'lucide-react';

interface ActualiteProps {
  newsPosts: Post[];
  user: any;
  onArticleCreated: (post: Post) => void;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onShare: (postId: string) => void;
  onView: () => void;
}

const CATEGORIES: { value: ContentCategory; label: string; color: string }[] = [
  { value: 'Info', label: 'Info', color: 'bg-blue-100 text-blue-700' },
  { value: 'Sport', label: 'Sport', color: 'bg-green-100 text-green-700' },
  { value: 'Savoir', label: 'Savoir', color: 'bg-purple-100 text-purple-700' },
  { value: 'Divers', label: 'Divers', color: 'bg-orange-100 text-orange-700' },
];

const Actualite: React.FC<ActualiteProps> = ({ newsPosts, user, onArticleCreated, onLike, onComment, onShare, onView }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', caption: '', source: '', category: 'Info' as ContentCategory, contentUrl: '' });
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      setForm({ ...form, contentUrl: fileUrl });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: Post = {
      id: Date.now().toString(),
      author: user,
      type: 'news',
      contentUrl: form.contentUrl || 'https://picsum.photos/seed/news/800/400',
      caption: form.caption,
      title: form.title,
      source: form.source,
      likes: [],
      comments: [],
      shares: 0,
      views: 0,
      timestamp: Date.now(),
      category: form.category
    };
    onArticleCreated(newPost);
    setShowForm(false);
    setForm({ title: '', caption: '', source: '', category: 'Info', contentUrl: '' });
    setPreviewUrl('');
    setSelectedFile(null);
  };

  const resetForm = () => {
    setShowForm(false);
    setForm({ title: '', caption: '', source: '', category: 'Info', contentUrl: '' });
    setPreviewUrl('');
    setSelectedFile(null);
  };

  return (
    <div className="pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Actualité</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          {showForm ? 'Annuler' : '+ Article'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-200">
          {/* Image Preview */}
          {previewUrl ? (
            <div className="relative rounded-lg overflow-hidden mb-4">
              <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
              <button
                type="button"
                onClick={() => { setPreviewUrl(''); setSelectedFile(null); }}
                className="absolute top-2 right-2 p-1 bg-black/70 rounded-full hover:bg-black/90"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 mb-4"
            >
              <Camera className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">Ajouter une image pour l'article</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Titre de l'article"
            className="w-full bg-gray-50 rounded-lg px-4 py-3 text-sm outline-none border border-gray-300 mb-3"
            required
          />
          <textarea
            value={form.caption}
            onChange={(e) => setForm({ ...form, caption: e.target.value })}
            placeholder="Contenu de l'article..."
            className="w-full bg-gray-50 rounded-lg px-4 py-3 text-sm outline-none border border-gray-300 mb-3 min-h-24"
            required
          />
          <input
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            placeholder="Source (optionnel, lien)"
            className="w-full bg-gray-50 rounded-lg px-4 py-2 text-sm outline-none border border-gray-300 mb-3"
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat.value })}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    form.category === cat.value
                      ? cat.color
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-indigo-600 py-3 rounded-lg font-medium text-white hover:bg-indigo-700">
              Publier
            </button>
            <button type="button" onClick={resetForm} className="px-4 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300">
              Annuler
            </button>
          </div>
        </form>
      )}

      {newsPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <Newspaper className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg">Aucune actualité</p>
          <p className="text-sm mt-2">Soyez le premier à partager une news!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {newsPosts.map((post) => {
            const categoryColor = CATEGORIES.find(c => c.value === post.category)?.color || 'bg-gray-100 text-gray-700';
            return (
              <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <img
                  src={post.contentUrl || 'https://picsum.photos/seed/news/800/400'}
                  className="w-full h-48 object-cover"
                  alt={post.title}
                />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] px-2 py-1 rounded-full ${categoryColor}`}>
                      {post.category}
                    </span>
                    {post.source && (
                      <span className="text-[10px] text-gray-500">
                        Source: {post.source}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{post.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{post.caption}</p>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => onLike(post.id)}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-rose-500"
                    >
                      <Heart className="w-4 h-4" /> {post.likes.length}
                    </button>
                    <button
                      onClick={() => onComment(post.id, '')}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-500"
                    >
                      <MessageCircle className="w-4 h-4" /> {post.comments.length}
                    </button>
                    <button
                      onClick={() => onShare(post.id)}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-500"
                    >
                      <Send className="w-4 h-4" /> {post.shares}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Actualite;
