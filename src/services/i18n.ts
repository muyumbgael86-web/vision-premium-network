// Internationalization service for Vision app
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

export const LANGUAGES: Language[] = [
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', dir: 'rtl' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'fil', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
];

// Comprehensive translations
const TRANSLATIONS: Record<string, Record<string, string>> = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.reels': 'Reels',
    'nav.news': 'Actualité',
    'nav.shop': 'Boutique',
    'nav.messages': 'Messages',
    'nav.live': 'Live',
    'nav.profile': 'Profil',
    // Actions
    'action.like': 'J\'aime',
    'action.comment': 'Commenter',
    'action.share': 'Partager',
    'action.save': 'Enregistrer',
    'action.delete': 'Supprimer',
    'action.edit': 'Modifier',
    'action.report': 'Signaler',
    // Settings
    'settings.title': 'Paramètres',
    'settings.theme': 'Thème',
    'settings.theme.light': 'Mode Clair',
    'settings.theme.dark': 'Mode Sombre',
    'settings.theme.system': 'Système',
    'settings.language': 'Langue',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Confidentialité',
    'settings.security': 'Sécurité',
    'settings.account': 'Compte',
    'settings.help': 'Aide',
    'settings.about': 'À propos',
    'settings.logout': 'Déconnexion',
    'settings.deleteAccount': 'Supprimer le compte',
    'settings.certification': 'Certification',
    'settings.certification.request': 'Demander la certification',
    'settings.certification.status': 'Statut de certification',
    // Certification
    'certification.title': 'Demande de certification',
    'certification.category': 'Catégorie',
    'certification.reason': 'Raison',
    'certification.proof': 'Preuve',
    'certification.submit': 'Soumettre',
    'certification.pending': 'En attente',
    'certification.approved': 'Approuvée',
    'certification.rejected': 'Refusée',
    'certification.none': 'Non certifié',
    // Common
    'common.cancel': 'Annuler',
    'common.confirm': 'Confirmer',
    'common.save': 'Enregistrer',
    'common.close': 'Fermer',
    'common.search': 'Rechercher',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.empty': 'Aucune notification',
    // Posts
    'post.new': 'Nouvelle publication',
    'post.caption': 'Légende',
    'post.placeholders.caption': 'Qu\'avez-vous en pikiran ?',
    // Stories
    'story.add': 'Ajouter une story',
    // Delete account
    'deleteAccount.title': 'Supprimer le compte',
    'deleteAccount.warning': 'Cette action est irréversible. Toutes vos données seront supprimées définitivement.',
    'deleteAccount.confirm': 'Je comprends et souhaite supprimer mon compte',
    // Verified
    'verified': 'Vérifié',
    // Welcome
    'welcome': 'Bienvenue sur VISION',
    // Search placeholder
    'search.placeholder': 'Rechercher...',
  },
  en: {
    'nav.home': 'Home',
    'nav.reels': 'Reels',
    'nav.news': 'News',
    'nav.shop': 'Shop',
    'nav.messages': 'Messages',
    'nav.live': 'Live',
    'nav.profile': 'Profile',
    'action.like': 'Like',
    'action.comment': 'Comment',
    'action.share': 'Share',
    'action.save': 'Save',
    'action.delete': 'Delete',
    'action.edit': 'Edit',
    'action.report': 'Report',
    'settings.title': 'Settings',
    'settings.theme': 'Theme',
    'settings.theme.light': 'Light Mode',
    'settings.theme.dark': 'Dark Mode',
    'settings.theme.system': 'System',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.security': 'Security',
    'settings.account': 'Account',
    'settings.help': 'Help',
    'settings.about': 'About',
    'settings.logout': 'Logout',
    'settings.deleteAccount': 'Delete Account',
    'settings.certification': 'Certification',
    'settings.certification.request': 'Request Certification',
    'settings.certification.status': 'Certification Status',
    'certification.title': 'Certification Request',
    'certification.category': 'Category',
    'certification.reason': 'Reason',
    'certification.proof': 'Proof',
    'certification.submit': 'Submit',
    'certification.pending': 'Pending',
    'certification.approved': 'Approved',
    'certification.rejected': 'Rejected',
    'certification.none': 'Not Certified',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.close': 'Close',
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'notifications.title': 'Notifications',
    'notifications.empty': 'No notifications',
    'post.new': 'New Post',
    'post.caption': 'Caption',
    'post.placeholders.caption': 'What\'s on your mind?',
    'story.add': 'Add Story',
    'deleteAccount.title': 'Delete Account',
    'deleteAccount.warning': 'This action is irreversible. All your data will be permanently deleted.',
    'deleteAccount.confirm': 'I understand and want to delete my account',
    'verified': 'Verified',
    'welcome': 'Welcome to VISION',
    'search.placeholder': 'Search...',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.reels': 'Reels',
    'nav.news': 'Noticias',
    'nav.shop': 'Tienda',
    'nav.messages': 'Mensajes',
    'nav.live': 'En vivo',
    'nav.profile': 'Perfil',
    'settings.title': 'Configuración',
    'settings.language': 'Idioma',
    'settings.logout': 'Cerrar sesión',
    'settings.deleteAccount': 'Eliminar cuenta',
    'settings.certification.request': 'Solicitar certificación',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.save': 'Guardar',
    'common.close': 'Cerrar',
    'common.search': 'Buscar',
    'verified': 'Verificado',
    'welcome': 'Bienvenido a VISION',
    'search.placeholder': 'Buscar...',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.reels': 'Reels',
    'nav.news': 'Nachrichten',
    'nav.shop': 'Shop',
    'nav.messages': 'Nachrichten',
    'nav.live': 'Live',
    'nav.profile': 'Profil',
    'settings.title': 'Einstellungen',
    'settings.language': 'Sprache',
    'settings.logout': 'Abmelden',
    'settings.deleteAccount': 'Konto löschen',
    'common.cancel': 'Abbrechen',
    'common.confirm': 'Bestätigen',
    'common.save': 'Speichern',
    'common.close': 'Schließen',
    'common.search': 'Suchen',
    'verified': 'Verifiziert',
    'welcome': 'Willkommen bei VISION',
    'search.placeholder': 'Suchen...',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.reels': 'ريلز',
    'nav.news': 'الأخبار',
    'nav.shop': 'المتجر',
    'nav.messages': 'الرسائل',
    'nav.live': 'بث مباشر',
    'nav.profile': 'الملف الشخصي',
    'settings.title': 'الإعدادات',
    'settings.language': 'اللغة',
    'settings.logout': 'تسجيل الخروج',
    'settings.deleteAccount': 'حذف الحساب',
    'common.cancel': 'إلغاء',
    'common.confirm': 'تأكيد',
    'common.save': 'حفظ',
    'common.close': 'إغلاق',
    'common.search': 'بحث',
    'verified': 'مقق',
    'welcome': 'مرحباً في VISION',
    'search.placeholder': 'بحث...',
  },
};

// Default fallback language
const FALLBACK_LANG = 'fr';

class I18nService {
  private currentLanguage: string = 'fr';
  private listeners: Set<(lang: string) => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    // Check saved preference
    const saved = localStorage.getItem('vision_language');
    if (saved) {
      this.currentLanguage = saved;
    } else {
      // Detect browser language
      if (typeof navigator !== 'undefined') {
        const browserLang = navigator.language?.split('-')[0] || 'fr';
        const supportedLang = LANGUAGES.find(l => l.code === browserLang);
        if (supportedLang) {
          this.currentLanguage = supportedLang.code;
        }
      }
    }

    // Apply direction
    this.applyDirection();
  }

  private applyDirection() {
    const lang = LANGUAGES.find(l => l.code === this.currentLanguage);
    if (lang?.dir === 'rtl') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = this.currentLanguage;
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = this.currentLanguage;
    }
  }

  setLanguage(langCode: string) {
    const lang = LANGUAGES.find(l => l.code === langCode);
    if (lang) {
      this.currentLanguage = lang.code;
      localStorage.setItem('vision_language', lang.code);
      this.applyDirection();
      this.listeners.forEach(listener => listener(lang.code));
    }
  }

  getLanguage(): string {
    return this.currentLanguage;
  }

  t(key: string, params?: Record<string, string>): string {
    const lang = this.getLanguage();
    const translations = TRANSLATIONS[lang] || TRANSLATIONS[FALLBACK_LANG];

    let text = translations[key] || TRANSLATIONS[FALLBACK_LANG][key] || key;

    if (params) {
      Object.entries(params).forEach(([placeholder, value]) => {
        text = text.replace(new RegExp(`{{${placeholder}}}`, 'g'), value);
      });
    }

    return text;
  }

  onLanguageChange(callback: (lang: string) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  getDirection(): 'ltr' | 'rtl' {
    const lang = LANGUAGES.find(l => l.code === this.getLanguage());
    return lang?.dir || 'ltr';
  }

  formatRelativeTime(date: Date | number): string {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    const lang = this.getLanguage();

    if (diffSecs < 60) {
      return lang === 'fr' ? 'A l\'instant' : 'Just now';
    }
    if (diffMins < 60) {
      return lang === 'fr'
        ? `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`
        : `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    }
    if (diffHours < 24) {
      return lang === 'fr'
        ? `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`
        : `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }
    if (diffDays < 7) {
      return lang === 'fr'
        ? `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
        : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }

    return new Date(date).toLocaleDateString(lang);
  }
}

export const i18n = new I18nService();
export default i18n;
