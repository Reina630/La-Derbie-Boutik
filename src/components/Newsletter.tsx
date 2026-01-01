import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Merci pour votre inscription !');
      setEmail('');
    }
  };

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Restez informée
        </h2>
        <p className="text-muted-foreground mb-8">
          Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives
          et nouveautés en avant-première.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <Input
            type="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
          />
          <Button
            type="submit"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            S'inscrire
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
