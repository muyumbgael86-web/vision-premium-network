import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

interface AuthProps {
  onLogin: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: email.split('@')[0] || Date.now().toString(),
      firstName: name.split(' ')[0] || '',
      lastName: name.split(' ')[1] || '',
      name: name || email.split('@')[0],
      username: email.split('@')[0] || 'user',
      avatar: `https://picsum.photos/seed/${email || Date.now()}/200/200`,
      isVerified: false,
      followers: [],
      following: [],
      email
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 shadow-xl shadow-indigo-500/30">V</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">VISION</h1>
          <p className="text-gray-500 mt-2">{isLogin ? 'Connectez-vous' : 'Créez votre compte'}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl">
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">Nom complet</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" className="w-full bg-gray-50 rounded-xl pl-12 pr-4 py-3 outline-none border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" className="w-full bg-gray-50 rounded-xl pl-12 pr-4 py-3 outline-none border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" required />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-gray-50 rounded-xl pl-12 pr-12 py-3 outline-none border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all text-white">
            {isLogin ? 'Se connecter' : 'Créer un compte'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            {isLogin ? "Pas encore de compte? " : "Déjà un compte? "}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 hover:underline font-medium">
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
