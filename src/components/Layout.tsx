import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Compass, MessageCircle, ShoppingBag, Video, User, Settings, LogOut, Moon, Sun,
  Bell, Search, Menu, X, Globe, Globe2, Shield, Trash2, Award, ChevronRight, Check
} from 'lucide-react';
import { User as UserType, VisionNotification } from '../types';
import { LANGUAGES, i18n } from '../services/i18n';

interface LayoutProps {
  children: React.ReactNode;
  user: UserType;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  notifications: VisionNotification[];
  onClearNotifications: () => void;
  onLogout: () => void;
  onRequestCertification?: () => void;
  onDeleteAccount?: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children, user, theme, setTheme, notifications,
  onClearNotifications, onLogout, onRequestCertification, onDeleteAccount
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showCertification, setShowCertification] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const handleGoProfile = () => {
    navigate('/profile');
  };

  const handleLanguageChange = (code: string) => {
    i18n.setLanguage(code);
    setShowLanguage(false);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText.toLowerCase() === 'supprimer') {
      onDeleteAccount?.();
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
    }
  };

  // Navigation items
  const navItems = [
    { path: '/', icon: Home, label: i18n.t('nav.home') },
    { path: '/reels', icon: Compass, label: i18n.t('nav.reels') },
    { path: '/actualite', icon: Globe2, label: i18n.t('nav.news') },
    { path: '/shop', icon: ShoppingBag, label: i18n.t('nav.shop') },
    { path: '/messenger', icon: MessageCircle, label: i18n.t('nav.messages') },
    { path: '/live', icon: Video, label: i18n.t('nav.live') },
  ];

  const isReelsPage = location.pathname === '/reels';
  const isLivePage = location.pathname === '/live';

  const currentLang = LANGUAGES.find(l => l.code === i18n.getLanguage());

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} min-h-screen transition-colors duration-300`}>
      {/* Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-header">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left: Profile + V Logo + Vision */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleGoProfile}
              className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-green-400/50 hover:ring-green-500 transition-all cursor-pointer"
            >
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </button>

            {/* V Logo - Lighter green */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-400/30">
              <span className="text-white font-bold text-lg">V</span>
            </div>

            {/* Logo Text */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold">
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">Vision</span>
              </h1>
            </div>
          </div>

          {/* Center: Search */}
          <div className={`hidden md:flex flex-1 max-w-md mx-4 ${isSearching ? '' : 'justify-center'}`}>
            {isSearching ? (
              <div className="flex items-center w-full px-4 py-2 rounded-full glass-search">
                <Search className="w-5 h-5 text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder={i18n.t('common.search')}
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
                <span className="text-sm text-gray-500">{i18n.t('search.placeholder')}</span>
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
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className={`absolute right-0 top-full mt-2 w-80 glass-dropdown notifications-dropdown ${theme === 'dark' ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'} border rounded-2xl shadow-2xl z-50`}>
                  <div className={`p-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{i18n.t('notifications.title')}</span>
                    {notifications.length > 0 && (
                      <button onClick={onClearNotifications} className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} hover:text-green-500 transition-colors`}>
                        {i18n.t('action.delete')}
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className={`p-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{i18n.t('notifications.empty')}</p>
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
                <div className={`absolute right-0 top-full mt-2 w-64 glass-dropdown ${theme === 'dark' ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'} border rounded-2xl shadow-2xl z-50 overflow-hidden`}>
                  <div className={`p-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                  </div>

                  {/* Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    className={`w-full flex items-center justify-between gap-3 p-3 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-400/20 flex items-center justify-center">
                        {theme === 'light' ? <Moon className="w-4 h-4 text-green-500" /> : <Sun className="w-4 h-4 text-yellow-400" />}
                      </div>
                      <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{i18n.t('settings.theme')}</span>
                    </div>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {theme === 'light' ? i18n.t('settings.theme.light') : i18n.t('settings.theme.dark')}
                    </span>
                  </button>

                  {/* Language */}
                  <button
                    onClick={() => setShowLanguage(!showLanguage)}
                    className={`w-full flex items-center justify-between gap-3 p-3 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-400/20 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-green-500" />
                      </div>
                      <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{i18n.t('settings.language')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg">{currentLang?.flag}</span>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{currentLang?.nativeName}</span>
                      <ChevronRight className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                  </button>

                  {/* Language Dropdown */}
                  {showLanguage && (
                    <div className={`max-h-48 overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full flex items-center justify-between px-3 py-2 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors ${lang.code === i18n.getLanguage() ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{lang.flag}</span>
                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{lang.nativeName}</span>
                          </div>
                          {lang.code === i18n.getLanguage() && <Check className="w-4 h-4 text-green-500" />}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Certification Request */}
                  {user.certificationStatus !== 'approved' && (
                    <button
                      onClick={() => { setShowCertification(true); setShowSettings(false); }}
                      className={`w-full flex items-center justify-between gap-3 p-3 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-400/20 flex items-center justify-center">
                          <Award className="w-4 h-4 text-green-500" />
                        </div>
                        <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{i18n.t('settings.certification.request')}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                    </button>
                  )}

                  {/* Delete Account */}
                  <button
                    onClick={() => { setShowDeleteConfirm(true); setShowSettings(false); }}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="text-red-500">{i18n.t('settings.deleteAccount')}</span>
                  </button>

                  {/* Logout */}
                  <button
                    onClick={onLogout}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <LogOut className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="text-red-500">{i18n.t('settings.logout')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`md:hidden p-2 rounded-full glass-button ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-white/60'} transition-colors`}
            >
              <Menu className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Certification Modal */}
      {showCertification && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowCertification(false)}>
          <div className={`relative w-full max-w-sm glass-card rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-lg">{i18n.t('certification.title')}</h3>
              <button onClick={() => setShowCertification(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {i18n.t('settings.certification.request')} pour obtenir le badge vérifié.
              </p>
              <select className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                <option value="business">Business</option>
                <option value="creator">Creator</option>
                <option value="brand">Brand</option>
                <option value="public">Public Figure</option>
              </select>
              <input
                type="text"
                placeholder={i18n.t('certification.reason')}
                className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
              />
              <input
                type="text"
                placeholder={i18n.t('certification.proof')}
                className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
              />
              <button
                onClick={() => { setShowCertification(false); onRequestCertification?.(); }}
                className="w-full py-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg font-bold text-white shadow-lg shadow-green-500/30"
              >
                {i18n.t('certification.submit')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className={`relative w-full max-w-sm glass-card rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-red-500/30 flex justify-between items-center">
              <h3 className="font-bold text-lg text-red-500">{i18n.t('deleteAccount.title')}</h3>
              <button onClick={() => setShowDeleteConfirm(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-center py-4">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <p className={`text-sm text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {i18n.t('deleteAccount.warning')}
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Tapez 'supprimer' pour confirmer"
                className={`w-full p-3 rounded-lg border text-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
              />
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText.toLowerCase() !== 'supprimer'}
                className="w-full py-3 bg-red-500 rounded-lg font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {i18n.t('settings.deleteAccount')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className={`fixed inset-0 z-50 md:hidden ${theme === 'dark' ? 'bg-black/80' : 'bg-black/60'}`} onClick={() => setShowMobileMenu(false)}>
          <div className={`absolute top-16 left-0 right-0 glass-dropdown ${theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'} shadow-2xl`} onClick={e => e.stopPropagation()}>
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
                <span>{i18n.t('nav.profile')}</span>
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

      {/* Desktop Navigation */}
      <nav className={`hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 glass-nav rounded-2xl shadow-2xl shadow-black/20 border border-white/10 px-3 py-2 gap-1 z-50`}>
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

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-nav border-t border-white/20 z-50">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'text-green-500'
                    : `${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={handleGoProfile}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 ${
              location.pathname === '/profile'
                ? 'text-green-500'
                : `${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`
            }`}
          >
            <div className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-green-400/50">
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs">{i18n.t('nav.profile')}</span>
          </button>
        </div>
      </nav>

      {/* Styles */}
      <style>{`
        .glass-header {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }
        .dark .glass-header {
          background: rgba(0, 0, 0, 0.85);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .glass-search {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 0, 0, 0.08);
        }
        .dark .glass-search {
          background: rgba(31, 41, 55, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .glass-button {
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 0, 0, 0.08);
        }
        .dark .glass-button {
          background: rgba(31, 41, 55, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .glass-dropdown {
          backdrop-filter: blur(24px);
        }
        .glass-nav {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(24px);
        }
        .dark .glass-nav {
          background: rgba(0, 0, 0, 0.85);
        }
      `}</style>
    </div>
  );
};

export default Layout;
