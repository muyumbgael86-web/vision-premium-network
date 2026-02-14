import React, { useState, useRef } from 'react';
import { User, Post } from '../types';
import { CheckCircle2, MapPin, Heart, MessageCircle, Camera, Edit2, Save, X, Heart as HeartIcon, MessageCircle as MessageCircleIcon, Settings, LogOut } from 'lucide-react';

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
  onOpenSettings: () => void;
}

const RELATIONSHIP_OPTIONS = [
  'Célibataire',
  'En couple',
  'Marié(e)',
  'Divorcé(e)',
  'Veuf(ve)',
  'En instance de divorce',
  'En cohabitation',
  'Union libre'
];

const Profile: React.FC<ProfileProps> = ({ user, userPosts, onUpdateUser, onPostClick, onViewStories, onLikePost, onCommentPost, onSharePost, onLogout, onOpenSettings }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editForm, setEditForm] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    username: user.username || '',
    avatar: user.avatar || '',
    relationship: user.relationship || '',
    city: user.city || '',
    education: user.education || '',
    bio: user.bio || ''
  });

  const handleSave = () => {
    onUpdateUser({
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      username: editForm.username,
      avatar: editForm.avatar,
      relationship: editForm.relationship as User['relationship'],
      city: editForm.city,
      education: editForm.education,
      bio: editForm.bio
    });
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const userPostsList = userPosts.filter(p => p.author?.id === user.id);

  return (
    <div className="pb-24">
      {/* Header with settings */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
        <button 
          onClick={onOpenSettings}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Profile Header */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <img
            src={editForm.avatar || user.avatar || `https://picsum.photos/seed/${user.id}/200/200`}
            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
            alt="Profile"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full hover:bg-indigo-700 shadow-lg"
          >
            <Camera className="w-4 h-4 text-white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          {/* Verified Badge - Green for certification */}
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-green-400 to-emerald-500 p-1.5 rounded-full shadow-lg">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
        </div>

        {isEditing ? (
          <div className="mt-4 space-y-3 max-w-xs mx-auto">
            <input
              value={editForm.firstName}
              onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
              placeholder="Prénom"
              className="w-full bg-gray-100 rounded-lg px-4 py-2 text-sm outline-none border border-gray-300 focus:border-indigo-500"
            />
            <input
              value={editForm.lastName}
              onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
              placeholder="Nom"
              className="w-full bg-gray-100 rounded-lg px-4 py-2 text-sm outline-none border border-gray-300 focus:border-indigo-500"
            />
            <input
              value={editForm.username}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              placeholder="Pseudo"
              className="w-full bg-gray-100 rounded-lg px-4 py-2 text-sm outline-none border border-gray-300 focus:border-indigo-500"
            />

            <select
              value={editForm.relationship}
              onChange={(e) => setEditForm({ ...editForm, relationship: e.target.value })}
              className="w-full bg-gray-100 rounded-lg px-4 py-2 text-sm outline-none border border-gray-300 focus:border-indigo-500"
            >
              <option value="">Situation amoureuse</option>
              {RELATIONSHIP_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <input
              value={editForm.city}
              onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
              placeholder="Ville où vous habitez"
              className="w-full bg-gray-100 rounded-lg px-4 py-2 text-sm outline-none border border-gray-300 focus:border-indigo-500"
            />

            <input
              value={editForm.education}
              onChange={(e) => setEditForm({ ...editForm, education: e.target.value })}
              placeholder="Études/Education"
              className="w-full bg-gray-100 rounded-lg px-4 py-2 text-sm outline-none border border-gray-300 focus:border-indigo-500"
            />

            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              placeholder="Bio"
              className="w-full bg-gray-100 rounded-lg px-4 py-2 text-sm outline-none border border-gray-300 focus:border-indigo-500 min-h-20 resize-none"
            />

            <div className="flex gap-2">
              <button onClick={handleSave} className="flex-1 bg-indigo-600 py-2 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-2 hover:bg-indigo-700">
                <Save className="w-4 h-4" /> Enregistrer
              </button>
              <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-200 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-300">
                <X className="w-4 h-4" /> Annuler
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">
                {user.name || `${user.firstName} ${user.lastName}`}
              </h2>
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-0.5 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-gray-500 text-sm">@{user.username || 'username'}</p>

            {/* Bio Info */}
            <div className="mt-3 flex flex-wrap justify-center gap-2 text-sm">
              {user.relationship && (
                <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-medium">
                  {user.relationship}
                </span>
              )}
              {user.city && (
                <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  <MapPin className="w-3 h-3" /> {user.city}
                </span>
              )}
              {user.education && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                  {user.education}
                </span>
              )}
            </div>

            {user.bio && (
              <p className="mt-2 text-gray-600 text-sm max-w-xs mx-auto">{user.bio}</p>
            )}

            <button
              onClick={() => setIsEditing(true)}
              className="mt-3 bg-gray-100 px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 mx-auto hover:bg-gray-200 transition-colors"
            >
              <Edit2 className="w-4 h-4" /> Modifier le profil
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-12 mb-6">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900">{userPostsList.length}</p>
          <p className="text-xs text-gray-500">Posts</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900">{user.followers?.length || 0}</p>
          <p className="text-xs text-gray-500">Abonnés</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900">{user.following?.length || 0}</p>
          <p className="text-xs text-gray-500">Abonnements</p>
        </div>
      </div>

      {/* Posts Grid */}
      <h3 className="font-bold mb-3 text-gray-900 px-4">Mes Posts</h3>
      {userPostsList.length === 0 ? (
        <p className="text-center text-gray-500 py-8 px-4">Aucun post - partagez quelque chose!</p>
      ) : (
        <div className="grid grid-cols-3 gap-1 px-1">
          {userPostsList.slice(0, 9).map((post) => (
            <div
              key={post.id}
              className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative"
              onClick={() => onPostClick(post.id)}
            >
              <img src={post.contentUrl} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <span className="text-white text-xs flex items-center gap-1 font-medium">
                  <HeartIcon className="w-4 h-4 fill-current" /> {post.likes?.length || 0}
                </span>
                <span className="text-white text-xs flex items-center gap-1 font-medium">
                  <MessageCircleIcon className="w-4 h-4" /> {post.comments?.length || 0}
                </span>
              </div>
              {(post.type === 'video' || post.type === 'reel') && (
                <div className="absolute top-2 left-2 bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Reel
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
