import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, supabaseConfigured } from '../lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase || !supabaseConfigured) {
      setUser(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setError('Failed to connect to authentication service.');
      }
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((error) => {
      console.error('Failed to get session:', error);
      setError('Failed to connect to authentication service.');
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      setError(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    
    if (!supabase || !supabaseConfigured) {
      setLoading(false);
      return { error: { message: 'Authentication not configured' } };
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    
    setLoading(false);
    if (error) {
      setError(error.message);
    }
    return { error: error ? { message: error.message } : null };
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    
    if (!supabase || !supabaseConfigured) {
      setLoading(false);
      return { error: { message: 'Authentication not configured' } };
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    setLoading(false);
    if (error) {
      setError(error.message);
    }
    return { error: error ? { message: error.message } : null };
  };

  const signOut = async () => {
    setError(null);
    if (!supabase || !supabaseConfigured) {
      return { error: { message: 'Authentication not configured' } };
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError(error.message);
    }
    return { error: error ? { message: error.message } : null };
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
  };
};
