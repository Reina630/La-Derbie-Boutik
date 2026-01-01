-- Supprimer la table si elle existe déjà (pour éviter les conflits)
DROP TABLE IF EXISTS public.orders CASCADE;

-- Créer la table des commandes (orders)
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_price NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Créer un index pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Désactiver RLS pour permettre les insertions publiques
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
