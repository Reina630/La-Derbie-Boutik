import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    image: string;
    description: string;
  };
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link to={`/boutique?category=${category.id}`}>
      <Card className="overflow-hidden hover-lift group cursor-pointer">
        <div className="aspect-square overflow-hidden relative">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover transition-smooth group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent flex flex-col justify-end p-6">
            <h3 className="text-white text-2xl font-bold mb-1">{category.name}</h3>
            <p className="text-white/80 text-sm">{category.description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CategoryCard;
