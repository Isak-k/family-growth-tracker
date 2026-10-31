import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'admin' | 'student';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  religion: string | null;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: AppRole | null;
  religion: string | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    role: null,
    religion: null,
    loading: true,
  });

  useEffect(() => {
    // Set up auth state listener BEFORE getting session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(prev => ({ ...prev, session, user: session?.user ?? null }));
        
        if (session?.user) {
          // Fetch profile and role
          setTimeout(async () => {
            const [profileRes, roleRes, religionRes] = await Promise.all([
              supabase
                .from('profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .single(),
              supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', session.user.id)
                .single(),
              supabase.rpc('get_family_religion', { _user_id: session.user.id }),
            ]);

            setState(prev => ({
              ...prev,
              profile: profileRes.data,
              role: roleRes.data?.role as AppRole | null,
              religion: (religionRes.data as string | null) ?? null,
              loading: false,
            }));
          }, 0);
        } else {
          setState({
            user: null,
            session: null,
            profile: null,
            role: null,
            religion: null,
            loading: false,
          });
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setState(prev => ({ ...prev, loading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!state.user) return;
    const userId = state.user.id;
    let active = true;
    const refreshReligion = async () => {
      const { data, error } = await supabase.rpc('get_family_religion', { _user_id: userId });
      if (active && !error) {
        setState(prev => ({ ...prev, religion: data ?? null }));
      }
    };
    window.addEventListener('family-profile-updated', refreshReligion);
    window.addEventListener('focus', refreshReligion);
    return () => {
      active = false;
      window.removeEventListener('family-profile-updated', refreshReligion);
      window.removeEventListener('focus', refreshReligion);
    };
  }, [state.user?.id]);

  const signUp = async (
    email: string,
    password: string,
    role: AppRole,
    fullName: string,
    religion?: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          role,
          full_name: fullName,
          religion: religion || '',
        },
      },
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!state.user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', state.user.id)
      .select()
      .single();

    if (data) {
      setState(prev => ({ ...prev, profile: data }));
      window.dispatchEvent(new Event('family-profile-updated'));
    }

    return { data, error };
  };

  return {
    ...state,
    isAdmin: state.role === 'admin',
    isStudent: state.role === 'student',
    isMuslim: state.religion === 'islam',
    signUp,
    signIn,
    signOut,
    updateProfile,
  };
}
