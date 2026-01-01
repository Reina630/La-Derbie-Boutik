import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle, PackageCheck } from 'lucide-react';
import { products } from '@/data/products';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const AdminStock = () => {
  const [stockData, setStockData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');
      if (error || !data) {
        setStockData([]);
        setLoading(false);
        return;
      }
      // Ajoute un seuil d'alerte par défaut si besoin
      setStockData(data.map((product: any) => ({
        ...product,
        alertThreshold: 10,
      })));
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen py-8 mb-16 md:mb-0">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link to="/admin" className="inline-flex items-center text-accent hover:underline mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Link>
          <h1 className="text-4xl font-bold">Gestion du Stock</h1>
          <p className="text-muted-foreground mt-2">
            Suivez les niveaux de stock de vos produits
          </p>
        </div>

        <div className="grid gap-4">
          {stockData.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{item.price.toLocaleString()} FCFA</p>
                    </div>
                  </div>
                  {item.stock < item.alertThreshold ? (
                    <Badge className="bg-red-100 text-red-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Stock faible
                    </Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800">
                      <PackageCheck className="h-3 w-3 mr-1" />
                      En stock
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label className="text-sm font-medium">Quantité en stock</Label>
                    <Input
                      type="number"
                      defaultValue={item.stock}
                      className="mt-1"
                      min="0"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm font-medium">Seuil d'alerte</Label>
                    <Input
                      type="number"
                      defaultValue={item.alertThreshold}
                      className="mt-1"
                      min="0"
                    />
                  </div>
                  <Button variant="outline" className="mt-6">
                    Mettre à jour
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <label className={className}>{children}</label>
);

export default AdminStock;
