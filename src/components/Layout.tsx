import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Heart, MessageCircle, ShoppingBag, Video, User, Settings, LogOut, Moon, Sun, Bell, Search, Menu, X, Globe, Globe2 } from 'lucide-react';
import { User as UserType, VisionNotification } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserType;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  notifications: VisionNotification[];
  onClearNotifications: () => void;
  onLogout: () => void;
}

// Language options
const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'fil', name: 'Filipino', flag: '🇵🇭' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
];

const Layout: React.FC<LayoutProps> = ({ children, user, theme, setTheme, notifications, onClearNotifications, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const [showLanguage, setShowLanguage] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const handleGoProfile = () => {
    navigate('/profile');
  };

  // Navigation items - without profile (it will be separate button)
  const navItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/reels', icon: Compass, label: 'Reels' },
    { path: '/actualite', icon: Globe2, label: 'Actualite' },
    { path: '/shop', icon: ShoppingBag, label: 'Boutique' },
    { path: '/messenger', icon: MessageCircle, label: 'Messages' },
    { path: '/live', icon: Video, label: 'Live' },
  ];

  const isReelsPage = location.pathname === '/reels';
  const isLivePage = location.pathname === '/live';

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} min-h-screen transition-colors duration-300`}>
      {/* Glass Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 glass-header`}>
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left: Profile Photo + V Logo + Vision */}
          <div className="flex items-center gap-2">
            {/* Profile Photo - Fixed to navigate properly */}
            <button
              onClick={handleGoProfile}
              className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-green-400 hover:ring-green-500 transition-all cursor-pointer"
            >
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </button>

            {/* V Logo - Green color */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <span className="text-white font-bold text-lg">V</span>
            </div>

            {/* Logo Text - Green gradient */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Vision</span>
              </h1>
            </div>
          </div>

          {/* Center: Search Bar - Hidden on small screens */}
          <div className={`hidden md:flex flex-1 max-w-md mx-4 ${isSearching ? '' : 'justify-center'}`}>
            {isSearching ? (
              <div className={`flex items-center w-full px-4 py-2 rounded-full glass-search`}>
                <Search className="w-5 h-5 text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  autoFocus
                  onBlur={() => setIsSearching(false)}
                  className={`flex-1 bg-transparent outline-none ${theme === 'dark' ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}`}
                />
                <button onClick={() => setIsSearching(false)} className="text-gray-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearching(true)}
                className={`flex items-center px-4 py-2 rounded-full glass-search ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-white/60'} transition-colors`}
              >
                <Search className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-500">Rechercher...</span>
              </button>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowSettings(false); }}
                className={`p-2 rounded-full glass-button ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-white/60'} transition-colors relative`}
              >
                <Bell className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className={`absolute right-0 top-full mt-2 w-80 glass-dropdown ${theme === 'dark' ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'} border rounded-2xl shadow-2xl z-50`}>
                  <div className={`p-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Notifications</span>
                    {notifications.length > 0 && (
                      <button onClick={onClearNotifications} className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} hover:text-green-500`}>
                        Effacer
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className={`p-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Aucune notification</p>
                    ) : (
                      notifications.map((notif, i) => (
                        <div key={i} className={`p-3 border-b ${theme === 'dark' ? 'border-gray-700 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'} ${!notif.read ? 'bg-green-50/50 dark:bg-green-900/20' : ''}`}>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{notif.message}</p>
                          <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{notif.timestamp}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="relative">
              <button
                onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); }}
                className={`p-2 rounded-full glass-button ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-white/60'} transition-colors`}
              >
                <Settings className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>

              {showSettings && (
                <div className={`absolute right-0 top-full mt-2 w-56 glass-dropdown ${theme === 'dark' ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'} border rounded-2xl shadow-2xl z-50 overflow-hidden`}>
                  <div className={`p-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                  </div>

                  {/* Lighting/Eclairage Option - Green */}
                  <button
                    onClick={toggleTheme}
                    className={`w-full flex items-center gap-3 p-3 ${theme === 'dark' ? 'hover:bg-green-900/30' : 'hover:bg-green-50'} transition-colors`}
                  >
                    {theme === 'light' ? (
                      <>
                        <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                          <Moon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-900">Mode Sombre</span>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/30">
                          <Sun className="w-4 h-4 text-gray-900" />
                        </div>
                        <span className="text-green-400">Mode Clair</span>
                      </>
                    )}
                  </button>

                  {/* Language Option - Green */}
                  <button
                    onClick={() => setShowLanguage(!showLanguage)}
                    className={`w-full flex items-center gap-3 p-3 ${theme === 'dark' ? 'hover:bg-green-900/30' : 'hover:bg-green-50'} transition-colors`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Langue</span>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Français</span>
                    </div>
                  </button>

                  {/* Language Dropdown */}
                  {showLanguage && (
                    <div className={`max-h-48 overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors ${lang.code === 'fr' ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Deconnexion - Red */}
                  <button
                    onClick={onLogout}
                    className={`w-full flex items-center gap-3 p-3 ${theme === 'dark' ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-600'} transition-colors`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
                      <LogOut className="w-4 h-4 text-white" />
                    </div>
                    <span>Deconnexion</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`md:hidden p-2 rounded-full glass-button ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-white/60'} transition-colors`}
            >
              <Menu className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className={`fixed inset-0 z-50 md:hidden ${theme === 'dark' ? 'bg-black/80' : 'bg-black/60'}`} onClick={() => setShowMobileMenu(false)}>
          <div className={`absolute top-16 left-0 right-0 glass-dropdown ${theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'} shadow-2xl`} onClick={(e) => e.stopPropagation()}>
            <nav className="p-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-green-500 text-white shadow-lg'
                        : `${theme === 'dark' ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
              {/* Profile link in mobile menu */}
              <NavLink
                to="/profile"
                onClick={() => setShowMobileMenu(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-green-500 text-white shadow-lg'
                      : `${theme === 'dark' ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`
                  }`
                }
              >
                <User className="w-5 h-5" />
                <span>Profil</span>
              </NavLink>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`${isReelsPage || isLivePage ? '' : 'pt-16'} pb-20 md:pb-6`}>
        <div className={isReelsPage || isLivePage ? '' : 'max-w-2xl mx-auto px-4'}>
          {children}
        </div>
      </main>

      {/* Glass Desktop Navigation - Hidden on mobile */}
      <nav className={`hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 glass-nav rounded-2xl shadow-2xl shadow-black/20 border border-white/20 px-3 py-2 gap-1 z-50`}>
        {navItems.slice(0, 6).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `p-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                  : `${theme === 'dark' ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`
              }`
            }
          >
            <item.icon className="w-5 h-5" />
          </NavLink>
        ))}
      </nav>

      {/* Glass Mobile Bottom Navigation - WITHOUT Profile, only Vision next to items */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 glass-nav border-t border-white/20 z-50`}>
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'text-green-600 dark:text-green-400'
                    : `${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          ))}
          {/* Profile button - separate, not in nav items */}
          <button
            onClick={handleGoProfile}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 ${
              location.pathname === '/profile'
                ? 'text-green-600 dark:text-green-400'
                : `${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`
            }`}
          >
            <div className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-green-400">
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs">Profil</span>
          </button>
        </div>
      </nav>

      {/* Global Glass Styles */}
      <style>{`
        /* Glass Header */
        .glass-header {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        .dark .glass-header {
          background: rgba(0, 0, 0, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Glass Search */
        .glass-search {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        .dark .glass-search {
          background: rgba(31, 41, 55, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Glass Button */
        .glass-button {
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        .dark .glass-button {
          background: rgba(31, 41, 55, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Glass Dropdown */
        .glass-dropdown {
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }

        /* Glass Navigation */
        .glass-nav {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        .dark .glass-nav {
          background: rgba(0, 0, 0, 0.95);
        }

        /* Smooth transitions */
        * {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default Layout;
