import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Play, ShoppingBag, MessageCircle, User, Bell, Search, Newspaper, Moon, Sun, Radio, CheckCircle2, Plus } from 'lucide-react';
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
    ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-black'
    : 'bg-gradient-to-b from-gray-100 via-white to-gray-200';
  const glassBg = isDark ? 'bg-black/40' : 'bg-white/80';
  const glassBorder = isDark ? 'border-white/10' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const navActive = 'text-white';

  const navItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/reels', icon: Play, label: 'Reels' },
    { path: '/actualite', icon: Newspaper, label: 'Actualité' },
    { path: '/shop', icon: ShoppingBag, label: 'Boutique' },
    { path: '/messenger', icon: MessageCircle, label: 'Messages' },
    { path: '/live', icon: Radio, label: 'Live' },
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
    <div className={`min-h-screen relative transition-colors duration-300 ${bgGradient}`}>
      {/* Header - Mobile Only */}
      <header className={`md:hidden fixed top-0 left-0 right-0 z-[60] ${glassBg} px-4 py-3 flex items-center justify-between border-b ${glassBorder}`}>
        <Link to="/profile" className="relative">
          <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" alt="Profil" />
        </Link>
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          V
        </div>
        <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-1">
          <Bell className={`w-5 h-5 ${textSecondary}`} />
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
          )}
        </button>
      </header>

      {/* Main Content - Full Screen */}
      <main className="md:pl-20 pt-16 md:pt-4 pb-20 md:pb-0 h-screen overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-hide">
          {children}
        </div>
      </main>

      {/* Right Navigation - Desktop TikTok Style */}
      <aside className="hidden md:flex flex-col fixed right-4 top-1/2 -translate-y-1/2 z-[50] gap-4">
        {/* Profile */}
        <Link to="/profile" className="flex flex-col items-center gap-1">
          <img src={user.avatar} className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500" alt="Profil" />
        </Link>

        <div className="w-8 h-px bg-gray-700"></div>

        {/* Navigation Icons */}
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className="flex flex-col items-center gap-1 group">
            <div className={`p-3 rounded-full transition-all ${isActive(item.path) ? 'bg-rose-500' : 'hover:bg-white/10'}`}>
              <item.icon className={`w-6 h-6 ${isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
            </div>
            {isActive(item.path) && <span className="text-[10px] text-rose-500 font-medium">{item.label}</span>}
          </Link>
        ))}

        {/* Theme Toggle */}
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="flex flex-col items-center gap-1 group">
          <div className="p-3 rounded-full hover:bg-white/10 transition-all">
            {theme === 'light' ? <Moon className="w-6 h-6 text-gray-400 group-hover:text-gray-600" /> : <Sun className="w-6 h-6 text-yellow-400" />}
          </div>
        </button>
      </aside>

      {/* Bottom Navigation - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass flex items-center justify-around z-50 border-t border-white/10" style={{ backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)' }}>
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className="flex flex-col items-center justify-center w-14 h-14">
            <item.icon className={`w-6 h-6 ${isActive(item.path) ? 'text-rose-500' : 'text-gray-400'}`} />
          </Link>
        ))}
      </nav>

      {/* Notifications Modal */}
      {notifOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-end" onClick={() => setNotifOpen(false)}>
          <div ref={notifRef} className="w-full max-w-sm h-full glass border-l border-white/10 overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(20, 20, 20, 0.95)' : 'rgba(255, 255, 255, 0.95)' }} onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-bold text-white">Notifications</h3>
              <button onClick={onClearNotifications} className="text-xs text-gray-400">Effacer</button>
            </div>
            <div className="overflow-y-auto h-full pb-20">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune notification</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} onClick={() => { onNotificationClick?.(n); setNotifOpen(false); }} className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer ${!n.read ? 'bg-indigo-500/10' : ''}`}>
                    <p className="text-sm font-medium text-white">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(parseInt(n.timestamp))}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
