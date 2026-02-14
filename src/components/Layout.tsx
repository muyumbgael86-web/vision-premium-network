import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Play, ShoppingBag, MessageCircle, User, Bell, Search, Newspaper, Moon, Sun, Radio, X, CheckCircle2, Heart, MessageSquare } from 'lucide-react';
import { VisionNotification } from '../types';
import { formatTimeAgo } from '../utils/time';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  notifications: VisionNotification[];
  onClearNotifications: () => void;
  onNotificationClick?: (notif: VisionNotification) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, theme, setTheme, notifications, onClearNotifications, onNotificationClick }) => {
  const location = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const isActive = (path: string) => location.pathname === path;

  // Theme classes
  const isDark = theme === 'dark';
  const bgGradient = isDark
    ? 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950'
    : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200';
  const glassBg = isDark ? 'bg-zinc-900/80' : 'bg-white/80';
  const glassBorder = isDark ? 'border-white/10' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-zinc-400' : 'text-gray-600';
  const textTertiary = isDark ? 'text-zinc-500' : 'text-gray-400';
  const hoverBg = isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100';
  const navActive = isDark
    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
    : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25';
  const navInactive = isDark
    ? 'text-zinc-400 hover:bg-white/5 hover:text-white'
    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900';

  const navItems = [
    { path: '/', icon: Home, label: "Accueil" },
    { path: '/reels', icon: Play, label: 'Reels' },
    { path: '/actualite', icon: Newspaper, label: 'Actualité' },
    { path: '/shop', icon: ShoppingBag, label: 'Boutique' },
    { path: '/messenger', icon: MessageCircle, label: 'Messages' },
    { path: '/live', icon: Radio, label: 'Direct' },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`min-h-screen relative transition-colors duration-300 overflow-x-hidden ${bgGradient}`}>
      <header className={`fixed top-0 z-[60] w-full ${glassBg} px-4 py-2.5 flex items-center justify-between border-b ${glassBorder}`}>
        <div className="flex items-center gap-3">
          <Link to="/profile" className="relative group">
            <div className="relative">
              <img src={user.avatar} className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30" alt="Profil" />
              {user.isVerified && <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full p-0.5"><CheckCircle2 className="w-3 h-3 text-white" /></div>}
            </div>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">V</div>
            <span className={`text-lg font-bold tracking-tight hidden sm:inline bg-gradient-to-r ${isDark ? 'from-white to-zinc-400' : 'from-gray-800 to-gray-500'} bg-clip-text text-transparent`}>VISION</span>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className={`p-2.5 ${hoverBg} rounded-xl transition-all`}>
            {theme === 'light' ? <Moon className="w-5 h-5 text-zinc-600" /> : <Sun className="w-5 h-5 text-yellow-400" />}
          </button>

          <div className="relative" ref={notifRef}>
            <button onClick={() => setNotifOpen(!notifOpen)} className={`p-2.5 ${hoverBg} rounded-xl transition-all relative`}>
              <Bell className={`w-5 h-5 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full animate-pulse"></span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute top-full right-0 mt-3 w-80 glass rounded-3xl shadow-2xl border border-white/10 overflow-hidden z-[100]" style={{ backgroundColor: isDark ? 'rgba(24, 24, 27, 0.9)' : 'rgba(255, 255, 255, 0.95)' }}>
                <div className={`p-4 border-b ${glassBorder} flex justify-between items-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <h3 className="text-xs font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Notifications</h3>
                  <button onClick={onClearNotifications} className={`text-[10px] ${isDark ? 'text-zinc-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}>Effacer</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center opacity-40">
                      <Bell className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-xs">Aucune notification</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} onClick={() => { onNotificationClick?.(n); setNotifOpen(false); }} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!n.read ? 'bg-indigo-500/5' : ''}`}>
                        <p className="text-xs font-medium">{n.message}</p>
                        <p className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-gray-400'} mt-1`}>{formatTimeAgo(parseInt(n.timestamp))}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <aside className={`hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 ${glassBg} p-4 pt-20 z-[50] border-r ${glassBorder}`}>
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive(item.path) ? navActive : navInactive}`}>
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="md:pl-64 mt-20 pb-24 md:pb-0 w-full">
        <div className="max-w-2xl mx-auto p-4 md:p-6 w-full">{children}</div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass flex items-center justify-around z-50 border-t border-white/10" style={{ backgroundColor: isDark ? 'rgba(24, 24, 27, 0.9)' : 'rgba(255, 255, 255, 0.95)' }}>
        {navItems.slice(0, 5).map((item) => (
          <Link key={item.path} to={item.path} className={`flex items-center justify-center w-14 h-14 rounded-xl transition-all ${isActive(item.path) ? 'text-indigo-500' : isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
            <item.icon className="w-6 h-6" />
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
