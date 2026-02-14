import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, MessageCircle, ShoppingBag, Video, User, Settings, LogOut, Moon, Sun, Bell, Search, Menu, X } from 'lucide-react';
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

const Layout: React.FC<LayoutProps> = ({ children, user, theme, setTheme, notifications, onClearNotifications, onLogout }) => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const navItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/reels', icon: Compass, label: 'Reels' },
    { path: '/actualite', icon: Search, label: 'Actualité' },
    { path: '/shop', icon: ShoppingBag, label: 'Boutique' },
    { path: '/messenger', icon: MessageCircle, label: 'Messages' },
    { path: '/live', icon: Video, label: 'Live' },
    { path: '/profile', icon: User, label: 'Profil' },
  ];

  const isReelsPage = location.pathname === '/reels';
  const isLivePage = location.pathname === '/live';

  return (
    <div className={`${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'} min-h-screen transition-colors duration-300`}>
      {/* Header - Fixed top with profile photo and logo */}
      <header className={`fixed top-0 left-0 right-0 z-50 ${theme === 'dark' ? 'bg-gray-900/95 backdrop-blur-sm border-b border-gray-700' : 'bg-white/95 backdrop-blur-sm border-b border-gray-200'} shadow-sm`}>
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left: Profile Photo + Logo */}
          <div className="flex items-center gap-3">
            {/* Profile Photo */}
            <button
              onClick={() => window.location.href = '/profile'}
              className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-indigo-500 hover:ring-indigo-600 transition-all"
            >
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </button>
            
            {/* Logo */}
            <div className="flex items-center">
              <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Vision</span>
              </h1>
            </div>
          </div>

          {/* Center: Search Bar - Hidden on small screens */}
          <div className={`hidden md:flex flex-1 max-w-md mx-4 ${isSearching ? '' : 'justify-center'}`}>
            {isSearching ? (
              <div className={`flex items-center w-full px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <Search className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  autoFocus
                  onBlur={() => setIsSearching(false)}
                  className={`flex-1 bg-transparent outline-none ${theme === 'dark' ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}`}
                />
                <button onClick={() => setIsSearching(false)} className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearching(true)}
                className={`flex items-center px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
              >
                <Search className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Rechercher...</span>
              </button>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowSettings(false); }}
                className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors relative`}
              >
                <Bell className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className={`absolute right-0 top-full mt-2 w-80 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-xl z-50`}>
                  <div className={`p-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Notifications</span>
                    {notifications.length > 0 && (
                      <button onClick={onClearNotifications} className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} hover:text-indigo-500`}>
                        Effacer
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className={`p-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Aucune notification</p>
                    ) : (
                      notifications.map((notif, i) => (
                        <div key={i} className={`p-3 border-b ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'} ${!notif.read ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}>
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
                className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
              >
                <Settings className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>

              {showSettings && (
                <div className={`absolute right-0 top-full mt-2 w-56 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-xl z-50 overflow-hidden`}>
                  <div className={`p-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                  </div>
                  
                  {/* Lighting/Eclairage Option */}
                  <button
                    onClick={toggleTheme}
                    className={`w-full flex items-center gap-3 p-3 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}
                  >
                    {theme === 'light' ? (
                      <>
                        <Moon className="w-5 h-5 text-indigo-500" />
                        <span className="text-gray-900">Mode Sombre</span>
                      </>
                    ) : (
                      <>
                        <Sun className="w-5 h-5 text-yellow-500" />
                        <span className="text-white">Mode Clair</span>
                      </>
                    )}
                  </button>

                  {/* Déconnexion */}
                  <button
                    onClick={onLogout}
                    className={`w-full flex items-center gap-3 p-3 ${theme === 'dark' ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-600'} transition-colors`}
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`md:hidden p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
            >
              <Menu className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className={`fixed inset-0 z-50 md:hidden ${theme === 'dark' ? 'bg-black/90' : 'bg-black/80'}`} onClick={() => setShowMobileMenu(false)}>
          <div className={`absolute top-16 left-0 right-0 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-xl`} onClick={(e) => e.stopPropagation()}>
            <nav className="p-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : `${theme === 'dark' ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
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

      {/* Desktop Navigation - Hidden on mobile */}
      <nav className={`hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 ${theme === 'dark' ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-full shadow-xl shadow-black/20 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} px-2 py-2 gap-1 z-50`}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `p-3 rounded-full transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : `${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`
              }`
            }
          >
            <item.icon className="w-5 h-5" />
          </NavLink>
        ))}
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 ${theme === 'dark' ? 'bg-gray-900/95 border-t border-gray-800' : 'bg-white/95 border-t border-gray-200'} backdrop-blur-sm z-50`}>
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : `${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          ))}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : `${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`
              }`
            }
          >
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs">Profil</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
