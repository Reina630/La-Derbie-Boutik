import { useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setAuthState } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('Tentative de connexion avec:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Erreur Supabase Auth:', error);
      setError(`Erreur: ${error.message}`);
      setLoading(false);
      toast.error(`Erreur: ${error.message}`);
      return;
    }
    
    console.log('Connexion Auth réussie, user ID:', data.user?.id);
    
    // Vérification du rôle dans la table users
    const { data: userRows, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user?.id)
      .single();
      
    if (userError || !userRows) {
      console.error('Erreur récupération rôle:', userError);
      setError("Vous n'avez pas accès à l'administration");
      setLoading(false);
      toast.error("Vous n'avez pas accès à l'administration");
      return;
    }
    
    // Redirection selon le rôle
    if (userRows.role === 'superadmin') {
      // Synchronisation avec le contexte admin
      setAuthState({ isAuthenticated: true, isSuperAdmin: true, userId: data.user?.id || null, username: email });
      console.log('AdminLogin: setAuthState(superadmin)');
      // Ensure local storage fallback
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('superAdmin', 'true');
      localStorage.setItem('adminUserId', data.user?.id || '');
      localStorage.setItem('adminUsername', email);
      toast.success('Connexion superadmin réussie');
      navigate('/admin');
    } else if (userRows.role === 'admin') {
      setAuthState({ isAuthenticated: true, isSuperAdmin: false, userId: data.user?.id || null, username: email });
      console.log('AdminLogin: setAuthState(admin)');
      // Ensure local storage fallback
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('superAdmin', 'false');
      localStorage.setItem('adminUserId', data.user?.id || '');
      localStorage.setItem('adminUsername', email);
      toast.success('Connexion admin réussie');
      navigate('/admin/produits');
    } else {
      setError("Accès refusé");
      toast.error("Accès refusé");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 mb-16 md:mb-0">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-accent" />
          </div>
          <CardTitle className="text-2xl">Espace Administrateur</CardTitle>
          <CardDescription>Connectez-vous pour accéder au panneau d'administration</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@exemple.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
            {error && <div className="text-center text-red-600 text-sm mt-2">{error}</div>}
          </form>
          
          <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-sm font-semibold text-accent mb-2">🔑 Authentification</p>
            <p className="text-xs text-muted-foreground">
              Utilisez l'email et le mot de passe créés dans votre projet Supabase Auth.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
