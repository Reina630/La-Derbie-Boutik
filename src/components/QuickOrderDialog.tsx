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
import { Package, ArrowLeft, Check } from 'lucide-react';
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
  const [step, setStep] = useState<1 | 2>(1);
  const [quantity, setQuantity] = useState(1);
  const [orderForm, setOrderForm] = useState({ name: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      loadProducts();
      setStep(1);
      setSubmitting(false);
      setOrderForm({ name: '', phone: '' });
      setQuantity(1);
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
    if (submitting) return;

    const currentProduct = products.find(p => p.id.toString() === selectedProductId);
    if (!currentProduct) return;

    setSubmitting(true);
    try {
      const { error } = await (supabase as any)
        .from('orders')
        .insert([{
          customer_name: orderForm.name,
          customer_phone: orderForm.phone,
          customer_address: ' ',
          product_name: currentProduct.name,
          quantity,
          total_price: currentProduct.price * quantity,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      onOpenChange(false);
      setOrderForm({ name: '', phone: '' });
      setQuantity(1);
      setStep(1);

      toast.success('Commande enregistrée ! Un commercial vous contactera très prochainement.', {
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
      toast.error(error?.message || 'Erreur lors de la commande');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (products.length === 0) return null;

  const currentProduct = products.find(p => p.id.toString() === selectedProductId) || products[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {step === 1 ? 'Choisissez votre pack' : 'Vos informations'}
          </DialogTitle>
          {/* Indicateur d'étapes */}
          <div className="flex items-center gap-2 pt-2">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${step >= 1 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
              {step > 1 ? <Check className="h-4 w-4" /> : '1'}
            </div>
            <div className={`flex-1 h-1 rounded ${step >= 2 ? 'bg-accent' : 'bg-muted'}`} />
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${step >= 2 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
              2
            </div>
          </div>
        </DialogHeader>

        {/* ÉTAPE 1 : Choix du produit */}
        {step === 1 && (
          <div className="space-y-3 mt-2">
            {products.map((product) => {
              const isSelected = product.id.toString() === selectedProductId;
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setSelectedProductId(product.id.toString())}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-accent/50 hover:bg-accent/5'
                  }`}
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm leading-tight">{product.name}</div>
                    <div className="text-accent font-bold mt-1">{product.price.toLocaleString()} FCFA</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                    isSelected ? 'border-accent bg-accent' : 'border-muted-foreground'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}

            <Button
              className="w-full bg-accent hover:bg-accent/90 py-5 mt-2"
              onClick={() => setStep(2)}
            >
              Continuer →
            </Button>
          </div>
        )}

        {/* ÉTAPE 2 : Informations */}
        {step === 2 && (
          <form onSubmit={handleOrderSubmit} className="space-y-4 mt-2">
            {/* Récap produit sélectionné */}
            <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-xl">
              <img
                src={currentProduct.image_url}
                alt={currentProduct.name}
                className="w-14 h-14 object-cover rounded-lg"
              />
              <div>
                <div className="font-semibold text-sm">{currentProduct.name}</div>
                <div className="text-accent font-bold">{currentProduct.price.toLocaleString()} FCFA</div>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="ml-auto text-xs text-muted-foreground underline"
              >
                Changer
              </button>
            </div>

            <div>
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                required
                value={orderForm.name}
                onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                placeholder="Votre nom"
                className="mt-1"
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
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold">Quantité</Label>
              <div className="flex items-center gap-3 mt-1">
                <Button type="button" variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-10 w-10">−</Button>
                <span className="text-center font-bold text-lg w-10">{quantity}</span>
                <Button type="button" variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)} className="h-10 w-10">+</Button>
                <div className="ml-auto text-right">
                  <div className="text-xs text-muted-foreground">Total</div>
                  <div className="font-bold text-accent">{(currentProduct.price * quantity).toLocaleString()} FCFA</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-shrink-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button type="submit" disabled={submitting} className="flex-1 bg-accent hover:bg-accent/90 py-5">
                <Package className="mr-2 h-4 w-4" />
                {submitting ? 'Envoi...' : 'Confirmer la commande'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuickOrderDialog;
