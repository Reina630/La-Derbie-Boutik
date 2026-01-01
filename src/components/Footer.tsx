import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold text-accent">La</span>
              <span className="text-xl font-light">Derbie</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Sublimez votre beauté, à portée de clic.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-accent transition-smooth text-sm"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/boutique"
                  className="text-muted-foreground hover:text-accent transition-smooth text-sm"
                >
                  Boutique
                </Link>
              </li>
              <li>
                <Link
                  to="/a-propos"
                  className="text-muted-foreground hover:text-accent transition-smooth text-sm"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-accent transition-smooth text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Catégories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/boutique?category=bijoux"
                  className="text-muted-foreground hover:text-accent transition-smooth text-sm"
                >
                  Bijoux
                </Link>
              </li>
              <li>
                <Link
                  to="/boutique?category=chaussures"
                  className="text-muted-foreground hover:text-accent transition-smooth text-sm"
                >
                  Chaussures
                </Link>
              </li>
              <li>
                <Link
                  to="/boutique?category=beaute"
                  className="text-muted-foreground hover:text-accent transition-smooth text-sm"
                >
                  Beauté
                </Link>
              </li>
              <li>
                <Link
                  to="/boutique?category=accessoires"
                  className="text-muted-foreground hover:text-accent transition-smooth text-sm"
                >
                  Accessoires
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-smooth"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-smooth"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/22790000000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-smooth"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2025 La Derbie. Tous droits réservés.</p>
          <Link to="/admin/login" className="text-muted-foreground/50 hover:text-muted-foreground text-xs mt-2 inline-block">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
