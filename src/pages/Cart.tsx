import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-8">
            Découvrez nos produits et ajoutez-les à votre panier
          </p>
          <Link to="/boutique">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Continuer vos achats
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const whatsappMessage = `Bonjour, je voudrais commander:\n${cart
    .map((item) => `- ${item.name} x${item.quantity} (${(item.price * item.quantity).toLocaleString()} FCFA)`)
    .join('\n')}\n\nTotal: ${getTotalPrice().toLocaleString()} FCFA`;
  const whatsappUrl = `https://wa.me/22790000000?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen py-8 mb-16 md:mb-0">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Mon Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <Link to={`/produit/${item.id}`}>
                      <h3 className="font-semibold hover:text-accent transition-smooth">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-accent font-bold mt-1">
                      {item.price.toLocaleString()} FCFA
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeFromCart(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {(item.price * item.quantity).toLocaleString()} FCFA
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Résumé</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="font-semibold">
                      {getTotalPrice().toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-4 border-t border-border">
                    <span>Total</span>
                    <span className="text-accent">
                      {getTotalPrice().toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mb-3">
                    Passer commande
                  </Button>
                </a>
                <Link to="/boutique">
                  <Button variant="outline" className="w-full">
                    Continuer vos achats
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
