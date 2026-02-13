const translations = {
  fr: {
    welcome: "L'Évidence.",
    add: "Ajouter",
    stories: "Stories",
    reels: "Reels",
    news: "Actualité",
    shop: "Boutique",
    messages: "Messages",
    live: "Direct Live",
    profile: "Profil",
    search: "Rechercher...",
    publish: "Publier",
    editProfile: "Éditer Profil",
    follow: "Suivre",
    followers: "Abonnés",
    following: "Suivis",
    likes: "Likes",
    certification: "Badge",
    downloading: "Téléchargement avec filtre Vision...",
    speed: "Vitesse",
    source: "Source obligatoire :",
    ai_news_tag: "VISION AI BOT",
    no_content: "Aucune transmission détectée"
  },
  en: {
    welcome: "The Evidence.",
    add: "Add",
    stories: "Stories",
    reels: "Reels",
    news: "News",
    shop: "Shop",
    messages: "Messages",
    live: "Live Stream",
    profile: "Profile",
    search: "Search...",
    publish: "Publish",
    editProfile: "Edit Profile",
    follow: "Follow",
    followers: "Followers",
    following: "Following",
    likes: "Likes",
    certification: "Badge",
    downloading: "Downloading with Vision filter...",
    speed: "Speed",
    source: "Mandatory Source:",
    ai_news_tag: "VISION AI BOT",
    no_content: "No transmissions detected"
  }
};

const lang = navigator.language.startsWith('en') ? 'en' : 'fr';
export const t = (key: keyof typeof translations.fr) => translations[lang][key] || key;
export const currentLang = lang;
