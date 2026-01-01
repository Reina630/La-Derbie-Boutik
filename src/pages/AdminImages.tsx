import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const AdminImages = () => {
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=500&auto=format&fit=crop',
  ]);
  const [urlInput, setUrlInput] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      toast.info('Upload d\'images sera disponible avec le backend (mode démo)');
      // Simulation: on ajoute une image placeholder
      setImages([...images, 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&auto=format&fit=crop']);
    }
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      setImages([...images, urlInput]);
      setUrlInput('');
      toast.success('Image ajoutée avec succès');
    }
  };

  const handleDelete = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    toast.success('Image supprimée');
  };

  return (
    <div className="min-h-screen py-8 mb-16 md:mb-0">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link to="/admin" className="inline-flex items-center text-accent hover:underline mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Link>
          <h1 className="text-4xl font-bold">Gestion des Images</h1>
          <p className="text-muted-foreground mt-2">
            Uploadez les photos de vos produits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Upload depuis ordinateur */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Upload depuis votre ordinateur</h3>
              <Label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent transition-smooth"
              >
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Cliquez pour sélectionner des images
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  (JPG, PNG, WebP)
                </span>
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
              <p className="text-xs text-muted-foreground mt-3">
                📌 L'upload de fichiers sera fonctionnel avec le backend
              </p>
            </CardContent>
          </Card>

          {/* Ajouter via URL */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Ajouter une image par URL</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="url-input">URL de l'image</Label>
                  <Input
                    id="url-input"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleAddUrl}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Ajouter l'image
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Galerie d'images */}
        <div>
          <h3 className="font-semibold text-xl mb-4">
            Images disponibles ({images.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-2">
                  <div className="aspect-square overflow-hidden rounded-lg">
                    <img
                      src={image}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {images.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Aucune image pour le moment. Commencez par en ajouter !
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminImages;
