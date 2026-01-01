import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const MobileNavBar = () => {
  const location = useLocation();
  const { getTotalItems } = useCart();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Boutique', href: '/boutique', icon: ShoppingBag },
    { name: 'Panier', href: '/panier', icon: ShoppingCart },
    { name: 'Compte', href: '/contact', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center space-y-1 flex-1 h-full transition-smooth ${
                active ? 'text-accent' : 'text-muted-foreground'
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.name === 'Panier' && getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </div>
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavBar;
