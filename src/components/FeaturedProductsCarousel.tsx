
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/contexts/CartContext';


const FeaturedProductsCarousel = () => {
  const { addToCart } = useCart();
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false })
        .limit(6);
      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!api) return;
    const autoplay = window.setInterval(() => {
      if (!api) return;
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 7000);
    return () => window.clearInterval(autoplay);
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const handleSelect = () => setSelectedIndex(api.selectedScrollSnap());
    handleSelect();
    api.on('select', handleSelect);
    return () => {
      api.off('select', handleSelect);
    };
  }, [api]);

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent/80">
              Coup de cœur des clientes
            </p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Les indispensables beauté du Niger
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
              Sélectionnée grâce aux retours WhatsApp, aux salons partenaires et aux
              ventes flash de Niamey à Maradi.
            </p>
          </div>
          <Link to="/boutique" className="md:pb-1">
            <Button variant="outline" className="rounded-full border-accent text-accent hover:bg-accent/10">
              Voir la boutique complète
            </Button>
          </Link>
        </div>

        <Carousel
          opts={{ align: 'start', loop: true }}
          setApi={setApi}
          className="relative"
        >
          <CarouselContent className="-ml-6">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-6 md:basis-1/2 lg:basis-1/3"
              >
                <article className="group relative h-[420px] overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
                  <img
                    src={product.image_url || product.image}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />
                  <div className="relative z-10 flex h-full flex-col justify-end gap-4 p-6 text-white">
                    <div>
                      <h3 className="text-2xl font-bold leading-tight">
                        {product.name}
                      </h3>
                    </div>
                    <p className="text-lg font-semibold text-accent">
                      {product.price.toLocaleString()} FCFA
                    </p>
                    <div className="flex gap-3">
                      <Link to={`/produit/${product.id}`} className="flex-1">
                        <Button className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                          Voir le produit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="flex-1 rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20"
                        onClick={() => addToCart(product)}
                      >
                        Ajouter au panier
                      </Button>
                    </div>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="-left-10 hidden border-white/30 bg-white/10 text-white hover:bg-white/20 md:flex" />
          <CarouselNext className="-right-10 hidden border-white/30 bg-white/10 text-white hover:bg-white/20 md:flex" />
        </Carousel>

        <div className="mt-6 flex justify-center gap-2">
          {products.map((product, index) => (
            <button
              key={product.id}
              type="button"
              onClick={() => api?.scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                selectedIndex === index ? 'w-8 bg-accent' : 'w-3 bg-muted'
              }`}
              aria-label={`Voir ${product.name}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsCarousel;
