import React, { useState } from 'react';
import { User, Post } from '../types';
import { CheckCircle2, MapPin, Heart, MessageCircle } from 'lucide-react';

interface ProfileProps {
  user: User;
  userPosts: Post[];
  onUpdateUser: (user: Partial<User>) => void;
  onPostClick: (postId: string) => void;
  onViewStories: () => void;
  onLikePost: (postId: string) => void;
  onCommentPost: (postId: string, text: string) => void;
  onSharePost: (postId: string) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, userPosts, onUpdateUser, onPostClick, onViewStories, onLikePost, onCommentPost, onSharePost, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: user.firstName, lastName: user.lastName, username: user.username });

  const handleSave = () => {
    onUpdateUser(editForm);
    setIsEditing(false);
  };

  const userPostsList = userPosts.filter(p => p.author.id === user.id);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Profil</h1>
        <button onClick={onLogout} className="text-rose-500 text-sm font-medium">Déconnexion</button>
      </div>

      <div className="text-center mb-6">
        <div className="relative inline-block">
          <img src={user.avatar} className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500/30" alt="" />
          {user.isVerified && <div className="absolute bottom-0 right-0 bg-indigo-600 p-1 rounded-full"><CheckCircle2 className="w-5 h-5 text-white" /></div>}
        </div>

        {isEditing ? (
          <div className="mt-4 space-y-3 max-w-xs mx-auto">
            <input value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} placeholder="Prénom" className="w-full bg-white/5 rounded-lg px-4 py-2 text-sm outline-none border border-white/10" />
            <input value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} placeholder="Nom" className="w-full bg-white/5 rounded-lg px-4 py-2 text-sm outline-none border border-white/10" />
            <input value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} placeholder="Pseudo" className="w-full bg-white/5 rounded-lg px-4 py-2 text-sm outline-none border border-white/10" />
            <button onClick={handleSave} className="w-full bg-indigo-600 py-2 rounded-lg text-sm font-medium">Enregistrer</button>
            <button onClick={() => setIsEditing(false)} className="w-full bg-zinc-700 py-2 rounded-lg text-sm font-medium">Annuler</button>
          </div>
        ) : (
          <div className="mt-4">
            <h2 className="text-xl font-bold">{user.name || `${user.firstName} ${user.lastName}`}</h2>
            <p className="text-zinc-500 text-sm">@{user.username || 'username'}</p>
            <button onClick={() => setIsEditing(true)} className="mt-3 bg-white/5 px-6 py-2 rounded-lg text-sm font-medium">Modifier</button>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-8 mb-6">
        <div className="text-center">
          <p className="text-xl font-bold">{userPostsList.length}</p>
          <p className="text-xs text-zinc-500">Posts</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold">{user.followers.length}</p>
          <p className="text-xs text-zinc-500">Abonnés</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold">{user.following.length}</p>
          <p className="text-xs text-zinc-500">Abonnements</p>
        </div>
      </div>

      <h3 className="font-bold mb-3">Mes Posts</h3>
      {userPostsList.length === 0 ? (
        <p className="text-center text-zinc-500 py-4">Aucun post</p>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {userPostsList.slice(0, 9).map((post) => (
            <div key={post.id} className="aspect-square bg-white/5 rounded-lg overflow-hidden cursor-pointer" onClick={() => onPostClick(post.id)}>
              <img src={post.contentUrl} className="w-full h-full object-cover" alt="" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
