-- Ajouter la colonne created_at à la table products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Politique pour permettre la lecture publique des produits et catégories
-- (nécessaire pour que les visiteurs puissent voir les produits sur la boutique)

-- Pour les produits : lecture publique
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);

-- Pour les catégories : lecture publique
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);

-- Si les politiques existent déjà, les supprimer d'abord :
-- DROP POLICY IF EXISTS "Allow public read access to products" ON products;
-- DROP POLICY IF EXISTS "Allow public read access to categories" ON categories;