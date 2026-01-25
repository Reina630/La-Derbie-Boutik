import Hero from '@/components/Hero';
import FeaturedProductsCarousel from '@/components/FeaturedProductsCarousel';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import Newsletter from '@/components/Newsletter';
import { useEffect, useState } from 'react';
import { Truck, Leaf, MessageCircle, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { categories } from '@/data/products';

const Home = () => {

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });
      if (!error) setProducts(productsData || []);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedProductsCarousel />



      {/* Listing de tous les produits depuis Supabase */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Nos produits
        </h2>
        {loading ? (
          <div className="text-center py-12">Chargement des produits...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Pourquoi choisir La Derbie ? */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Pourquoi choisir La Derbie ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-accent/10 text-accent">
                <Truck size={40} />
              </div>
              <h3 className="font-semibold mb-2">Livraison rapide</h3>
              <p className="text-muted-foreground text-sm">Partout au Niger, en 24-72h selon la ville.</p>
            </div>
            <div>
              <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-accent/10 text-accent">
                <Leaf size={40} />
              </div>
              <h3 className="font-semibold mb-2">Produits naturels</h3>
              <p className="text-muted-foreground text-sm">Des soins et cosmétiques sélectionnés pour leur efficacité et leur composition saine.</p>
            </div>
            <div>
              <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-accent/10 text-accent">
                <MessageCircle size={40} />
              </div>
              <h3 className="font-semibold mb-2">Conseils personnalisés</h3>
              <p className="text-muted-foreground text-sm">Une équipe à l’écoute sur WhatsApp pour vous guider dans vos choix.</p>
            </div>
            <div>
              <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-accent/10 text-accent">
                <Star size={40} />
              </div>
              <h3 className="font-semibold mb-2">Satisfaction clients</h3>
              <p className="text-muted-foreground text-sm">Des centaines de clientes satisfaites et des avis authentiques.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {/* <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Nouveautés
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section> */}

      {/* Testimonials */}
      <TestimonialCarousel />

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};

export default Home;
