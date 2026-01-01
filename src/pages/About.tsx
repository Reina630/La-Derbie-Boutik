const About = () => {
  return (
    <div className="min-h-screen py-8 mb-16 md:mb-0">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">À propos de La Derbie</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Notre Histoire</h2>
            <p className="text-muted-foreground leading-relaxed">
              La Derbie est née d'une passion pour la mode et la beauté féminine.
              Nous croyons que chaque femme mérite de se sentir belle et confiante.
              C'est pourquoi nous avons créé une boutique en ligne proposant une sélection
              soigneusement choisie de bijoux, chaussures, produits de beauté et accessoires
              de qualité, adaptés aux goûts et besoins des femmes nigériennes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Notre Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              Notre mission est de rendre la mode et la beauté accessibles à toutes les femmes
              au Niger, en offrant des produits de qualité à des prix abordables. Nous nous
              engageons à fournir un service client exceptionnel et une expérience d'achat
              en ligne agréable et sécurisée.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Nos Valeurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Qualité</h3>
                <p className="text-muted-foreground text-sm">
                  Nous sélectionnons rigoureusement nos produits pour garantir la meilleure
                  qualité à nos clientes.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Accessibilité</h3>
                <p className="text-muted-foreground text-sm">
                  Des prix justes et une livraison partout au Niger pour rendre nos produits
                  accessibles à toutes.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Service Client</h3>
                <p className="text-muted-foreground text-sm">
                  Une équipe dédiée et à l'écoute pour vous accompagner dans votre expérience
                  d'achat.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Innovation</h3>
                <p className="text-muted-foreground text-sm">
                  Nous suivons les tendances pour vous proposer les dernières nouveautés
                  en matière de mode et beauté.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Pourquoi nous choisir ?</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <span className="text-accent mr-2">✓</span>
                <span>Large sélection de produits de qualité</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">✓</span>
                <span>Prix compétitifs et abordables</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">✓</span>
                <span>Livraison rapide dans tout le Niger</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">✓</span>
                <span>Service client réactif et disponible</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">✓</span>
                <span>Paiement sécurisé et facile</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
