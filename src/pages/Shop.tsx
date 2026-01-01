import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les données depuis Supabase
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Charger les catégories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      // Charger les produits
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });
      
      if (productsError) {
        console.error('Erreur produits:', productsError);
      }
      
      setCategories(categoriesData || []);
      setProducts(productsData || []);
      console.log('Produits chargés:', productsData?.length);
      console.log('Catégories chargées:', categoriesData?.length);
    } catch (error) {
      console.error('Erreur chargement:', error);
    }
    setLoading(false);
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;
    console.log('Produits disponibles:', products.length);

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (product) => product.category_id.toString() === selectedCategory
      );
      console.log('Après filtre catégorie:', filtered.length);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log('Après filtre recherche:', filtered.length);
    }

    return filtered;
  }, [selectedCategory, searchQuery, products]);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Boutique</h1>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className={
              selectedCategory === 'all'
                ? 'bg-accent hover:bg-accent/90 text-accent-foreground'
                : ''
            }
          >
            Tous
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id.toString() ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id.toString())}
              className={
                selectedCategory === category.id.toString()
                  ? 'bg-accent hover:bg-accent/90 text-accent-foreground'
                  : ''
              }
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg p-4 animate-pulse">
                <div className="bg-muted rounded-lg h-48 mb-4"></div>
                <div className="bg-muted rounded h-4 mb-2"></div>
                <div className="bg-muted rounded h-4 w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Aucun produit trouvé pour cette recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
