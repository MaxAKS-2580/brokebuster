import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthService } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    AuthService.getSession().then(session => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { user, session } = await AuthService.signUp(email, password);
    if (user && session) {
      setUser(user);
      setSession(session);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { user, session } = await AuthService.signIn(email, password);
    setUser(user);
    setSession(session);
  };

  const signOut = async () => {
    await AuthService.signOut();
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email: string) => {
    await AuthService.resetPassword(email);
  };

  const signInWithGitHub = async () => {
    await AuthService.signInWithGitHub();
  };

  const signInWithGoogle = async () => {
    await AuthService.signInWithGoogle();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGitHub,
    signInWithGoogle,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
