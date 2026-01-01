import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

// ⚠️ AVERTISSEMENT SÉCURITÉ: Ceci est une simulation frontend uniquement
// En production, l'authentification admin DOIT être gérée côté serveur
interface AdminAuthContextType {
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  currentUserId: string | null;
  currentUsername: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  setAuthState: (auth: { isAuthenticated: boolean; isSuperAdmin?: boolean; userId?: string | null; username?: string | null }) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  useEffect(() => {
    // Hydrate from Supabase session and users table
    const hydrateFromSupabase = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;
          if (!user) {
          // try localStorage fallback for dev
          const adminAuth = localStorage.getItem('adminAuth');
          const superAdmin = localStorage.getItem('superAdmin');
          const userId = localStorage.getItem('adminUserId');
          const username = localStorage.getItem('adminUsername');
          setIsAuthenticated(adminAuth === 'true');
          setIsSuperAdmin(superAdmin === 'true');
          setCurrentUserId(userId);
          setCurrentUsername(username);
          return;
        }

        // Find role from users table
        const { data: userRow } = await supabase.from('users').select('role, email').eq('id', user.id).single();
        const role = userRow?.role ?? null;
        const email = userRow?.email ?? user.email;
        setIsAuthenticated(true);
          console.log('AdminAuthContext: hydrated session for', user.id, 'role:', role);
        setCurrentUserId(user.id);
        setCurrentUsername(email ?? user.id);
        setIsSuperAdmin(role === 'superadmin');
        // Persist for dev fallback
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('superAdmin', role === 'superadmin' ? 'true' : 'false');
        localStorage.setItem('adminUserId', user.id);
        localStorage.setItem('adminUsername', email ?? user.id);
      } catch (err) {
        console.error('Error hydrating admin auth:', err);
      }
    };

    hydrateFromSupabase();
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, _session) => {
      hydrateFromSupabase();
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = (username: string, password: string): boolean => {
    // ⚠️ SIMULATION UNIQUEMENT - À remplacer par une vraie API
    // Credentials temporaires pour la démo
    if (username === 'admin' && password === 'admin2024') {
      setIsAuthenticated(true);
      setIsSuperAdmin(false);
      setCurrentUserId('admin_1');
      setCurrentUsername('admin');
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('superAdmin', 'false');
      localStorage.setItem('adminUserId', 'admin_1');
      localStorage.setItem('adminUsername', 'admin');
      return true;
    } else if (username === 'superadmin' && password === 'super2024') {
      setIsAuthenticated(true);
      setIsSuperAdmin(true);
      setCurrentUserId('superadmin_1');
      setCurrentUsername('superadmin');
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('superAdmin', 'true');
      localStorage.setItem('adminUserId', 'superadmin_1');
      localStorage.setItem('adminUsername', 'superadmin');
      return true;
    }
    return false;
  };

  const setAuthState = ({ isAuthenticated: auth, isSuperAdmin: sa = false, userId, username }: { isAuthenticated: boolean; isSuperAdmin?: boolean; userId?: string | null; username?: string | null; }) => {
    setIsAuthenticated(auth);
    setIsSuperAdmin(!!sa);
    setCurrentUserId(userId ?? null);
    setCurrentUsername(username ?? null);
    if (auth) {
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('superAdmin', sa ? 'true' : 'false');
      if (userId) localStorage.setItem('adminUserId', userId);
      if (username) localStorage.setItem('adminUsername', username);
          console.log('AdminAuthContext: setAuthState ->', { auth, sa, userId, username });
    } else {
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('superAdmin');
      localStorage.removeItem('adminUserId');
      localStorage.removeItem('adminUsername');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsSuperAdmin(false);
    setCurrentUserId(null);
    setCurrentUsername(null);
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('superAdmin');
    localStorage.removeItem('adminUserId');
    localStorage.removeItem('adminUsername');
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isSuperAdmin, currentUserId, currentUsername, login, logout, setAuthState }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
