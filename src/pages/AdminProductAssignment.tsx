import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductAssignment {
  productId: string;
  productName: string;
  assignedTo: string | null;
  assignedToName: string | null;
}

// Note: admins are loaded from supabase users table

const AdminProductAssignment = () => {
  const [assignments, setAssignments] = useState<ProductAssignment[]>([]);
  const [admins, setAdmins] = useState<{ id: string; name: string }[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleAssignment = async (productId: string, adminId: string) => {
    try {
      // upsert: if exists update, else insert
      setLoading(true);
      // Insert or update product_assignments
      const { data, error } = await supabase
        .from('product_assignments')
        .upsert({ product_id: productId, admin_id: adminId }, { onConflict: 'product_id' });
      if (error) throw error;
      // Update local state
      const assignedAdmin = admins.find((a) => a.id === adminId);
      setAssignments((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, assignedTo: adminId, assignedToName: assignedAdmin?.name || null }
            : item
        )
      );
      toast.success(`Produit attribué à ${assignedAdmin?.name}`);
    } catch (err) {
      console.error('Erreur assignation:', err);
      toast.error('Erreur lors de l\'attribution');
    } finally {
      setLoading(false);
    }
  };

  const handleUnassign = async (productId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.from('product_assignments').delete().eq('product_id', productId);
      if (error) throw error;
      setAssignments((prev) => prev.map((item) => (item.productId === productId ? { ...item, assignedTo: null, assignedToName: null } : item)));
      toast.success('Attribution retirée');
    } catch (err) {
      console.error('Erreur retirer attribution:', err);
      toast.error('Erreur lors du retrait d\'attribution');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Load admins (users with role admin/superadmin)
        const { data: adminsData, error: adminsError } = await supabase.from('users').select('id, email, username, role').in('role', ['admin', 'superadmin']);
        if (adminsError) throw adminsError;
        const adminList = (adminsData || []).map((u: any) => ({ id: u.id, name: u.username || u.email }));
        setAdmins(adminList);

        // Load products
        const { data: productsData, error: productsError } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (productsError) throw productsError;
        setProductsList(productsData || []);

        // Load assignments
        const { data: assignmentsData, error: assignmentsError } = await supabase.from('product_assignments').select('*');
        if (assignmentsError) throw assignmentsError;
        // Build assignment mapping
        const mapped: ProductAssignment[] = (productsData || []).map((p: any) => {
          const ass = (assignmentsData || []).find((a: any) => a.product_id === p.id);
          const admin = adminList.find((a) => a.id === (ass ? ass.admin_id : null));
          return { productId: p.id, productName: p.name, assignedTo: ass ? ass.admin_id : null, assignedToName: admin ? admin.name : null };
        });
        setAssignments(mapped);
      } catch (err) {
        console.error('Erreur chargement attribution produit:', err);
        toast.error('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen py-8 mb-16 md:mb-0">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link to="/admin" className="inline-flex items-center text-accent hover:underline mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Link>
          <h1 className="text-4xl font-bold">Attribution des Produits</h1>
          <p className="text-muted-foreground mt-2">
            Attribuez les produits aux administrateurs qui vont les gérer
          </p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            productsList.length === 0 ? (
              <div className="text-center py-8">Aucun produit trouvé</div>
            ) : (
              productsList.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image_url || product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {product.price?.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductAssignment;
