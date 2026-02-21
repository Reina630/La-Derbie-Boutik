import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Package, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface QuickOrderDialogProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuickOrderDialog = ({ productId, open, onOpenChange }: QuickOrderDialogProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: ''
  });

  useEffect(() => {
    if (open) {
      loadProducts();
    }
  }, [open]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data: productsData, error } = await (supabase as any)
        .from('products')
        .select('*, categories(name)')
        .order('id', { ascending: false });

      if (error) throw error;
      setProducts(productsData || []);
      
      // Définir le produit sélectionné après le chargement
      if (productsData && productsData.length > 0) {
        const productExists = productsData.find((p: any) => p.id.toString() === productId);
        setSelectedProductId(productExists ? productId : productsData[0].id.toString());
      }
    } catch (error) {
      console.error('Erreur chargement produits:', error);
      toast.error('Erreur lors du chargement des produits');
    }
    setLoading(false);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentProduct = products.find(p => p.id.toString() === selectedProductId);
    if (!currentProduct) return;
    
    try {
      const { data, error } = await (supabase as any)
        .from('orders')
        .insert([{
          customer_name: orderForm.name,
          customer_phone: orderForm.phone,
          customer_address: ' ',
          product_name: currentProduct.name,
          quantity: quantity,
          total_price: currentProduct.price * quantity,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      onOpenChange(false);
      setOrderForm({ name: '', phone: '' });
      setQuantity(1);
      
      toast.success('Commande enregistrée avec succès ! Un de nos commerciaux vous contactera très prochainement pour confirmer votre commande.', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#10b981',
          color: '#fff',
          fontSize: '16px',
          padding: '20px',
          textAlign: 'center',
          maxWidth: '500px',
        },
      });
    } catch (error: any) {
      console.error('Erreur lors de la commande:', error);
      toast.error(error?.message || 'Erreur lors de l\'enregistrement de la commande');
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const currentProduct = products.find(p => p.id.toString() === selectedProductId) || products[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between">
            <span>Commande Rapide</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={selectedProductId} onValueChange={setSelectedProductId} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2 bg-transparent">
            {products.map((product) => (
              <TabsTrigger
                key={product.id}
                value={product.id.toString()}
                className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                {product.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {products.map((product) => (
            <TabsContent key={product.id} value={product.id.toString()} className="mt-6">
              {/* Aperçu du produit */}
              <div className="flex items-center gap-4 p-4 bg-accent/5 rounded-lg mb-4">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-accent font-bold text-xl">{product.price.toLocaleString()} FCFA</p>
                  {product.categories?.name && (
                    <span className="inline-block mt-1 px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                      {product.categories.name}
                    </span>
                  )}
                </div>
              </div>

              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      required
                      value={orderForm.name}
                      onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                      placeholder="+227 XX XX XX XX"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="quantity" className="text-base font-semibold">Quantité</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10"
                    >
                      −
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="text-center font-bold h-10 w-20"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-10 w-10"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="bg-accent/10 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Produit:</span>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Quantité:</span>
                    <span className="font-medium">{quantity}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-accent/20">
                    <span>Total:</span>
                    <span className="text-accent">{(product.price * quantity).toLocaleString()} FCFA</span>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 py-6">
                  <Package className="mr-2 h-5 w-5" />
                  Confirmer la commande
                </Button>
              </form>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default QuickOrderDialog;
