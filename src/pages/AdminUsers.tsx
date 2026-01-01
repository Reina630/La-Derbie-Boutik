import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UserPlus, Trash2, Shield, User } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'superadmin';
  created_at: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', role: 'admin' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any).from('users').select('id, email, role, created_at').order('created_at', { ascending: false });
    if (!error && data) setUsers(data);
    setLoading(false);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    // Crée d'abord l'utilisateur dans Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: form.email,
      password: form.password,
      email_confirm: true,
    });
    if (error || !data.user) {
      toast.error('Erreur création utilisateur Auth: ' + (error?.message || ''));
      return;
    }
    // Ajoute l'utilisateur dans la table users avec le bon rôle
    const { error: dbError } = await (supabase as any).from('users').insert({
      id: data.user.id,
      email: form.email,
      role: form.role,
    });
    if (dbError) {
      toast.error('Erreur table users: ' + dbError.message);
      return;
    }
    toast.success('Utilisateur ajouté avec succès');
    setShowDialog(false);
    setForm({ email: '', password: '', role: 'admin' });
    loadUsers();
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    // Supprime d'abord de la table users
    const { error } = await (supabase as any).from('users').delete().eq('id', userId);
    if (error) {
      toast.error('Erreur suppression table users: ' + error.message);
      return;
    }
    // Supprime aussi du système d'auth (optionnel, nécessite droits service_role)
    // await supabase.auth.admin.deleteUser(userId);
    toast.success('Utilisateur supprimé avec succès');
    loadUsers();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground">Gérez les administrateurs de la plateforme</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter un admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un administrateur</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="role">Rôle</Label>
                <Select value={form.role} onValueChange={value => setForm(f => ({ ...f, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="superadmin">SuperAdmin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3">
                <Button type="submit">Créer l'utilisateur</Button>
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4}>Chargement...</TableCell></TableRow>
              ) : users.length === 0 ? (
                <TableRow><TableCell colSpan={4}>Aucun utilisateur</TableCell></TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'superadmin' ? 'default' : 'secondary'}>
                        {user.role === 'superadmin' ? 'SuperAdmin' : 'Admin'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
