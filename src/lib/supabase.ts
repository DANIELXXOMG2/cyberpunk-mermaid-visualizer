import { createClient } from '@supabase/supabase-js';

// Supabase configuration - using environment variables for security
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;


export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface Diagram {
  id: string;
  user_id?: string;
  title: string;
  description?: string;
  diagram_type: string;
  mermaid_code: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface DiagramVersion {
  id: string;
  diagram_id: string;
  mermaid_code: string;
  change_description?: string;
  created_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  encrypted_key: string;
  service_name: string;
  expires_at?: string;
  created_at: string;
}

// Database service functions
export const diagramService = {
  // Get all public diagrams or user's diagrams
  async getDiagrams(userId?: string) {
    let query = supabase
      .from('diagrams')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (userId) {
      query = query.or(`user_id.eq.${userId},is_public.eq.true`);
    } else {
      query = query.eq('is_public', true);
    }
    
    return query;
  },

  // Save a new diagram
  async saveDiagram(diagram: Omit<Diagram, 'id' | 'created_at' | 'updated_at'>) {
    return supabase
      .from('diagrams')
      .insert(diagram)
      .select()
      .single();
  },

  // Update an existing diagram
  async updateDiagram(id: string, updates: Partial<Diagram>) {
    return supabase
      .from('diagrams')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
  },

  // Delete a diagram
  async deleteDiagram(id: string) {
    return supabase
      .from('diagrams')
      .delete()
      .eq('id', id);
  },

  // Save a diagram version
  async saveDiagramVersion(version: Omit<DiagramVersion, 'id' | 'created_at'>) {
    return supabase
      .from('diagram_versions')
      .insert(version)
      .select()
      .single();
  },

  // Get diagram versions
  async getDiagramVersions(diagramId: string) {
    return supabase
      .from('diagram_versions')
      .select('*')
      .eq('diagram_id', diagramId)
      .order('created_at', { ascending: false });
  }
};

export const apiKeyService = {
  // Save encrypted API key
  async saveApiKey(apiKey: Omit<ApiKey, 'id' | 'created_at'>) {
    return supabase
      .from('api_keys')
      .upsert(apiKey, { onConflict: 'user_id,service_name' })
      .select()
      .single();
  },

  // Get user's API keys
  async getApiKeys(userId: string) {
    return supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId);
  },

  // Delete API key
  async deleteApiKey(id: string) {
    return supabase
      .from('api_keys')
      .delete()
      .eq('id', id);
  }
};

// Auth helpers
export const authService = {
  // Sign up with email
  async signUp(email: string, password: string) {
    return supabase.auth.signUp({ email, password });
  },

  // Sign in with email
  async signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
  },

  // Sign out
  async signOut() {
    return supabase.auth.signOut();
  },

  // Get current user
  async getCurrentUser() {
    return supabase.auth.getUser();
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};