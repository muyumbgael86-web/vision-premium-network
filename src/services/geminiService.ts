// Gemini AI Service pour les fonctionnalités intelligentes
import { User, Post } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export interface GeminiResponse {
  text: string;
  error?: string;
}

export const generateAIContent = async (prompt: string): Promise<GeminiResponse> => {
  if (!GEMINI_API_KEY) {
    return { text: 'Fonctionnalité IA non configurée. Ajoutez VITE_GEMINI_API_KEY dans .env', error: 'No API Key' };
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    return { text: data.candidates?.[0]?.content?.parts?.[0]?.text || 'Pas de réponse' };
  } catch (error) {
    return { text: '', error: (error as Error).message };
  }
};

export const suggestHashtags = async (caption: string): Promise<string[]> => {
  const response = await generateAIContent(`Suggère 5 hashtags pertinents pour ce post: "${caption}"`);
  if (response.error) return ['#vision', '#premium', '#network'];
  return response.text.match(/#\w+/g) || ['#vision', '#premium', '#network'];
};

export const improveCaption = async (caption: string): Promise<string> => {
  const response = await generateAIContent(`Améliore cette légende de post: "${caption}"`);
  return response.error ? caption : response.text;
};

export const generateAltText = async (imageUrl: string): Promise<string> => {
  const response = await generateAIContent(`Décris cette image pour l'accessibilité: ${imageUrl}`);
  return response.error ? 'Image' : response.text;
};
