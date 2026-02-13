// Services i18n
export const translations = {
  fr: {
    welcome: 'Bienvenue sur VISION',
    login: 'Se connecter',
    signup: 'S\'inscrire',
    logout: 'Déconnexion',
    profile: 'Profil',
    settings: 'Paramètres',
    notifications: 'Notifications',
    posts: 'Publications',
    followers: 'Abonnés',
    following: 'Abonnements',
    likes: 'J\'aime',
    comments: 'Commentaires',
    shares: 'Partages',
    views: 'Vues',
    search: 'Rechercher...',
    cancel: 'Annuler',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    post: 'Publier',
    story: 'Story',
    live: 'Live',
    shop: 'Boutique',
    messenger: 'Messages',
    news: 'Actualité',
    reels: 'Reels',
    add: 'Ajouter',
    more: 'Plus',
    verified: 'Vérifié',
    admin: 'Administration',
    report: 'Signaler',
    download: 'Télécharger',
    share: 'Partager',
  }
};

export const getLanguage = () => {
  const lang = navigator.language.split('-')[0];
  return lang in translations ? lang : 'fr';
};

export const t = (key: keyof typeof translations.fr) => {
  const lang = getLanguage();
  return translations[lang as keyof typeof translations]?.[key] || translations.fr[key];
};
