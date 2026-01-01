import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

const slides = [
  {
    id: 'batana-hero',
    badge: 'Cheveux sublimes',
    title: 'Pousse & force des cheveux',
    subtitle: '',
    description: '',
    image: '/batana_carousel.png',
    ctaLabel: 'Voir la gamme Batana',
    ctaHref: '/boutique?category=beaute',
  },
 
  {
    id: 'carousel2',
    badge: 'Mode & élégance',
    title: 'Découvrez nos looks tendance',
    subtitle: '',
    description: '',
    image: 'carousel2.png',
    ctaLabel: 'Produits tendance',
    ctaHref: '',
  },
  
  {
    id: 'cremes-corps',
    badge: 'Crèmes & laits corps',
    title: 'Peau douce & éclatante',
    subtitle: 'Hydratation et soin quotidien',
    description:
      'Nos crèmes et laits corporels nourrissent, unifient et illuminent toutes les peaux. Idéal pour le climat sahélien.',
    image:
      'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ctaLabel: 'Découvrir les soins corps',
    ctaHref: '/boutique?category=beaute',
  },
  {
    id: 'maquillage',
    badge: 'Maquillage & accessoires',
    title: 'Palette, rouges à lèvres, pinceaux',
    subtitle: 'Pour toutes les occasions',
    description:
      'Maquillage adapté à toutes les peaux, pour le quotidien ou les grandes occasions. Osez la couleur et l’élégance !',
    image:
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ctaLabel: 'Découvrir le maquillage',
    ctaHref: '/boutique?category=beaute',
  },
  
  {
    id: 'quotidien',
    badge: 'Routine quotidienne',
    title: 'Beauté simple & efficace',
    subtitle: 'Pour chaque jour',
    description:
      'Des gestes simples, des produits sûrs et adaptés pour prendre soin de soi au quotidien, avec le sourire.',
    image:
      'https://images.pexels.com/photos/1153371/pexels-photo-1153371.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ctaLabel: 'Voir la routine',
    ctaHref: '/boutique?category=beaute',
  },
];

const Hero = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const autoplay = window.setInterval(() => {
      if (!api) {
        return;
      }
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 6000);

    return () => window.clearInterval(autoplay);
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateIndex = () => setActiveIndex(api.selectedScrollSnap());
    updateIndex();
    api.on('select', updateIndex);

    return () => {
      api.off('select', updateIndex);
    };
  }, [api]);

  return (
    <section className="relative">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        className="relative"
      >
        <CarouselContent className="h-[520px] md:h-[640px]">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="h-full">
              <div className="relative flex h-full items-center overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,127,39,0.35),_transparent_60%)] mix-blend-screen" />
                <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-start gap-6 px-6 text-left text-white md:px-12">
                  {slide.id === 'batana-hero' ? (
                    <>
                      <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                        {slide.badge}
                      </span>
                      <h1 className="mt-2 text-4xl font-bold leading-tight md:text-6xl drop-shadow-lg">
                        {slide.title}
                      </h1>
                      <Link to={slide.ctaHref}>
                        <Button
                          size="lg"
                          className="rounded-full bg-accent px-8 py-6 text-accent-foreground shadow-lg shadow-accent/20 transition-transform hover:-translate-y-1 hover:bg-accent/90 mt-4"
                        >
                          {slide.ctaLabel}
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                        {slide.badge}
                      </span>
                      <div>
                        {slide.subtitle && (
                          <p className="text-sm font-medium text-white/80 md:text-base">
                            {slide.subtitle}
                          </p>
                        )}
                        <h1 className="mt-2 text-4xl font-bold leading-tight md:text-6xl">
                          {slide.title}
                        </h1>
                      </div>
                      {slide.description && (
                        <p className="max-w-2xl text-base text-white/90 md:text-lg">
                          {slide.description}
                        </p>
                      )}
                      <Link to={slide.ctaHref}>
                        <Button
                          size="lg"
                          className="rounded-full bg-accent px-8 py-6 text-accent-foreground shadow-lg shadow-accent/20 transition-transform hover:-translate-y-1 hover:bg-accent/90"
                        >
                          {slide.ctaLabel}
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex border-white/40 bg-white/15 text-white hover:bg-white/25" />
        <CarouselNext className="hidden md:flex border-white/40 bg-white/15 text-white hover:bg-white/25" />
      </Carousel>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => api?.scrollTo(index)}
            className={`h-2 w-10 rounded-full transition-all ${
              activeIndex === index
                ? 'bg-accent shadow-[0_0_15px_rgba(255,127,39,0.6)]'
                : 'bg-white/40'
            }`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
