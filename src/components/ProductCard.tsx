import { Link } from 'react-router-dom';
import { Product } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden hover-lift group">
      <Link to={`/produit/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image_url || product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-smooth group-hover:scale-110"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/produit/${product.id}`}>
          <h3 className="font-semibold text-foreground hover:text-accent transition-smooth line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-accent font-bold text-lg mt-2">
          {product.price.toLocaleString()} FCFA
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/produit/${product.id}`} className="w-full">
          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            Voir détails
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
