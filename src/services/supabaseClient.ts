import { createClient } from '@supabase/supabase-js';

// Credentials Supabase de l'utilisateur
const SUPABASE_URL = 'https://dokzbprrcsraypzebjuu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ayN-vmi5_McnQ8abKCSCUA_qJ0rk5B2';

// Créer le client Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Types pour les tables Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          name: string;
          avatar: string;
          username: string;
          email: string | null;
          is_admin: boolean;
          is_verified: boolean;
          certification_status: 'none' | 'pending' | 'approved' | 'rejected';
          followers: string[];
          following: string[];
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      posts: {
        Row: {
          id: string;
          author_id: string;
          type: 'image' | 'video' | 'reel' | 'news';
          content_url: string;
          caption: string;
          title: string | null;
          source: string | null;
          likes: string[];
          comments: any[];
          shares: number;
          views: number;
          timestamp: number;
          category: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['posts']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['posts']['Insert']>;
      };
      stories: {
        Row: {
          id: string;
          user_id: string;
          image_url: string;
          type: 'image' | 'video';
          viewed: boolean;
          views: number;
          timestamp: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['stories']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['stories']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          name: string;
          price: number;
          image: string;
          category: string;
          description: string;
          currency: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          timestamp: number;
          read: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
    };
  };
}

export default supabase;
