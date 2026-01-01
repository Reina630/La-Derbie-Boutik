-- Ajoute une colonne image_url pour les catégories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT;

-- (Optionnel) Crée le bucket 'categories' dans Supabase Storage si pas déjà fait
-- INSERT INTO storage.buckets (id, name, public) VALUES ('categories', 'categories', true);
