import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

const AdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', id: null, image_url: '' });
  const [editing, setEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any).from('categories').select('*').order('id');
    if (!error) setCategories(data || []);
    setLoading(false);
  };

  const uploadImage = async () => {
    if (!imageFile) return form.image_url;
    // Compression et optimisation de l'image (comme pour les produits)
    const compressedFile = await compressImage(imageFile);
    const fileExt = compressedFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('categories')
      .upload(`public/${fileName}`, compressedFile, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage
      .from('categories')
      .getPublicUrl(data.path);
    return publicUrl;
  };

  // Fonction de compression d'image (identique à produits)
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();
      img.onload = () => {
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          const compressedFile = new File([blob!], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        }, 'image/jpeg', 0.8);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Le nom est requis');
    let image_url = form.image_url;
    try {
      if (imageFile) {
        image_url = await uploadImage();
      }
      if (editing) {
        const { error } = await (supabase as any).from('categories').update({ name: form.name, image_url }).eq('id', form.id);
        if (!error) toast.success('Catégorie modifiée');
      } else {
        const { error } = await (supabase as any).from('categories').insert([{ name: form.name, image_url }]);
        if (!error) toast.success('Catégorie ajoutée');
      }
      setForm({ name: '', id: null, image_url: '' });
      setImageFile(null);
      setEditing(false);
      loadCategories();
    } catch (err) {
      toast.error('Erreur upload image');
    }
  };

  const handleEdit = (cat: any) => {
    setForm({ name: cat.name, id: cat.id, image_url: cat.image_url || '' });
    setImageFile(null);
    setEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    const { error } = await (supabase as any).from('categories').delete().eq('id', id);
    if (!error) toast.success('Catégorie supprimée');
    loadCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Catégories</h1>
          <p className="text-muted-foreground">{loading ? 'Chargement...' : `${categories.length} catégories`}</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="cat-name">Nom *</Label>
              <Input id="cat-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="cat-image">Image</Label>
              <Input
                id="cat-image"
                type="file"
                accept="image/*"
                onChange={e => setImageFile(e.target.files?.[0] || null)}
                className="file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-accent-foreground hover:file:bg-accent/90"
              />
              {form.image_url && (
                <img src={form.image_url} alt="aperçu" className="w-12 h-12 object-cover rounded mt-2" />
              )}
            </div>
            <Button type="submit" className="h-10">
              {editing ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {editing ? 'Modifier' : 'Ajouter'}
            </Button>
            {editing && (
              <Button type="button" variant="outline" onClick={() => { setForm({ name: '', id: null, image_url: '' }); setEditing(false); setImageFile(null); }}>
                Annuler
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Liste des catégories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {loading ? (
              <div className="py-8 text-center">Chargement...</div>
            ) : categories.length === 0 ? (
              <div className="py-8 text-center">Aucune catégorie</div>
            ) : (
              categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between py-3">
                  <span className="flex items-center gap-2">
                    {cat.image_url && (
                      <img src={cat.image_url} alt="cat" className="w-8 h-8 object-cover rounded" />
                    )}
                    {cat.name}
                  </span>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(cat)}><Edit className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(cat.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCategories;
