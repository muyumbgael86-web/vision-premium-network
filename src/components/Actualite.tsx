import React, { useState, useRef } from 'react';
import { Post, ContentCategory } from '../types';
import { Send, Image, Video, Newspaper, Heart, MessageCircle, X, Camera, Share2, CheckCircle2 } from 'lucide-react';
import { formatTimeAgo } from '../utils/time';

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

// Comments Modal Component
const CommentsModal: React.FC<{
  post: Post;
  onClose: () => void;
  onComment: (text: string) => void;
}> = ({ post, onClose, onComment }) => {
  const [commentText, setCommentText] = useState('');

  const submitComment = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (commentText.trim()) {
      onComment(commentText.trim());
      setCommentText('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[85vh] bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
          <h3 className="font-semibold text-lg">Commentaires</h3>
          <div className="w-10" />
        </div>
        <div className="overflow-y-auto max-h-[50vh] sm:max-h-[55vh] p-4 space-y-4">
          {post.comments.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">Aucun commentaire</p>
              <p className="text-sm text-gray-400 mt-1">Soyez le premier!</p>
            </div>
          ) : (
            post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 animate-fade-in">
                <img src={comment.userAvatar} className="w-10 h-10 rounded-full flex-shrink-0" alt="" />
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm p-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{comment.userName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <form onSubmit={submitComment} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="flex-1 bg-white dark:bg-gray-700 rounded-full px-4 py-3 text-sm outline-none border border-gray-200 dark:border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/30 transition-all"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 rounded-full text-white transition-colors shadow-lg shadow-red-500/30"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Actualite: React.FC<ActualiteProps> = ({ newsPosts, user, onArticleCreated, onLike, onComment, onShare, onView }) => {
  const [showForm, setShowForm] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);
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
        <h1 className="text-2xl font-bold text-gray-900">Actualite</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
        >
          {showForm ? 'Annuler' : '+ Article'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-200">
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
              className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-red-500 mb-4"
            >
              <Camera className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">Ajouter une image</p>
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
            placeholder="Source (optionnel)"
            className="w-full bg-gray-50 rounded-lg px-4 py-2 text-sm outline-none border border-gray-300 mb-3"
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Categorie</label>
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
            <button type="submit" className="flex-1 bg-red-500 py-3 rounded-lg font-medium text-white hover:bg-red-600 transition-colors">
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
          <p className="text-lg">Aucune actualite</p>
          <p className="text-sm mt-2">Soyez le premier a partager une news!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {newsPosts.map((post) => {
            const categoryColor = CATEGORIES.find(c => c.value === post.category)?.color || 'bg-gray-100 text-gray-700';
            const isLiked = post.likes.includes(user?.id);

            return (
              <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 glass-card">
                {/* Author */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={post.author.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="font-semibold text-sm text-gray-900">{post.author.name}</p>
                        {post.author.isVerified && <CheckCircle2 className="w-4 h-4 text-red-500" />}
                      </div>
                      <p className="text-xs text-gray-400">{formatTimeAgo(post.timestamp)}</p>
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div onClick={onView} className="cursor-pointer">
                  <img
                    src={post.contentUrl || 'https://picsum.photos/seed/news/800/400'}
                    className="w-full h-48 object-cover"
                    alt={post.title}
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] px-2 py-1 rounded-full ${categoryColor}`}>
                      {post.category}
                    </span>
                    {post.source && (
                      <span className="text-[10px] text-gray-500">Source: {post.source}</span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{post.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{post.caption}</p>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex gap-4">
                      <button
                        onClick={() => onLike(post.id)}
                        className={`flex items-center gap-1 text-sm transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        {post.likes.length}
                      </button>
                      <button
                        onClick={() => setShowComments(post.id)}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        {post.comments.length}
                      </button>
                      <button
                        onClick={() => onShare(post.id)}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                        {post.shares}
                      </button>
                    </div>
                  </div>

                  {/* First comment preview */}
                  {post.comments.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-900">{post.comments[0]?.userName}</span>{' '}
                        {post.comments[0]?.text.length > 50 ? post.comments[0]?.text.slice(0, 50) + '...' : post.comments[0]?.text}
                      </p>
                      {post.comments.length > 1 && (
                        <button
                          onClick={() => setShowComments(post.id)}
                          className="text-sm text-red-500 hover:text-red-600 mt-1"
                        >
                          Voir les {post.comments.length - 1} autres
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comments Modal */}
      {showComments && (
        <CommentsModal
          post={newsPosts.find(p => p.id === showComments)!}
          onClose={() => setShowComments(null)}
          onComment={(text) => { onComment(showComments, text); }}
        />
      )}
    </div>
  );
};

export default Actualite;
