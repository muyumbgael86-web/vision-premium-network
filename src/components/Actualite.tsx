import React, { useState } from 'react';
import { Post, ContentCategory } from '../types';
import { Send, Image, Video, Newspaper, Heart, MessageCircle } from 'lucide-react';

interface ActualiteProps {
  newsPosts: Post[];
  user: any;
  onArticleCreated: (post: Post) => void;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onShare: (postId: string) => void;
  onView: () => void;
}

const Actualite: React.FC<ActualiteProps> = ({ newsPosts, user, onArticleCreated, onLike, onComment, onShare, onView }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', caption: '', source: '', category: 'Info' as ContentCategory, contentUrl: '' });

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
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Actualité</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 px-4 py-2 rounded-lg text-sm font-medium">
          {showForm ? 'Annuler' : '+ Article'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass rounded-xl p-4 mb-6 border border-white/10">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre de l'article" className="w-full bg-white/5 rounded-lg px-4 py-3 text-sm outline-none border border-white/10 mb-3" required />
          <textarea value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} placeholder="Contenu de l'article..." className="w-full bg-white/5 rounded-lg px-4 py-3 text-sm outline-none border border-white/10 mb-3 min-h-24" required />
          <input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="Source (optionnel)" className="w-full bg-white/5 rounded-lg px-4 py-2 text-sm outline-none border border-white/10 mb-3" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ContentCategory })} className="w-full bg-white/5 rounded-lg px-4 py-2 text-sm outline-none border border-white/10 mb-3">
            <option value="Info">Info</option>
            <option value="Sport">Sport</option>
            <option value="Savoir">Savoir</option>
            <option value="Divers">Divers</option>
          </select>
          <input value={form.contentUrl} onChange={(e) => setForm({ ...form, contentUrl: e.target.value })} placeholder="URL de l'image (optionnel)" className="w-full bg-white/5 rounded-lg px-4 py-2 text-sm outline-none border border-white/10 mb-4" />
          <button type="submit" className="w-full bg-indigo-600 py-3 rounded-lg font-medium">Publier</button>
        </form>
      )}

      {newsPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
          <Newspaper className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg">Aucune actualité</p>
          <p className="text-sm mt-2">Soyez le premier à partager une news!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {newsPosts.map((post) => (
            <div key={post.id} className="glass rounded-xl overflow-hidden border border-white/10">
              <img src={post.contentUrl || 'https://picsum.photos/seed/news/800/400'} className="w-full h-48 object-cover" alt="" />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full">{post.category}</span>
                  {post.source && <span className="text-[10px] text-zinc-500">{post.source}</span>}
                </div>
                <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                <p className="text-sm text-zinc-400 line-clamp-2">{post.caption}</p>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10">
                  <button onClick={() => onLike(post.id)} className="flex items-center gap-1 text-sm text-zinc-400"><Heart className="w-4 h-4" /> {post.likes.length}</button>
                  <button onClick={() => onComment(post.id, '')} className="flex items-center gap-1 text-sm text-zinc-400"><MessageCircle className="w-4 h-4" /> {post.comments.length}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Actualite;