import React from 'react';
import { Users, Award, Clock, ThumbsUp } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: <Users className="h-6 w-6 md:h-8 md:w-8" />, number: "5000+", label: "Clients Satisfaits" },
    { icon: <Award className="h-6 w-6 md:h-8 md:w-8" />, number: "10+", label: "Années d'Expérience" },
    { icon: <Clock className="h-6 w-6 md:h-8 md:w-8" />, number: "24/7", label: "Support Disponible" },
    { icon: <ThumbsUp className="h-6 w-6 md:h-8 md:w-8" />, number: "98%", label: "Taux de Réussite" }
  ];

  return (
    <section id="about" className="py-8 sm:py-12 md:py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4 px-4">
            Pourquoi Choisir <span className="text-yellow-400">Smar</span> ?
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
            Vos experts technologiques locaux de confiance avec plus de 10 ans d'expérience 
            dans la réparation de mobiles et d'ordinateurs portables.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-yellow-400 mb-2 md:mb-3 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">
                {stat.number}
              </div>
              <div className="text-gray-300 text-xs sm:text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <img 
              src="https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="Espace de travail de réparation tech" 
              className="rounded-xl md:rounded-2xl shadow-xl w-full"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 to-transparent rounded-xl md:rounded-2xl"></div>
          </div>

          <div className="order-1 lg:order-2">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 text-white">
              Services de Réparation Professionnels en qui Vous Pouvez Avoir Confiance
            </h3>
            <p className="text-gray-300 mb-3 sm:mb-4 md:mb-6 leading-relaxed text-sm sm:text-base">
              Nous sommes vos experts technologiques locaux de confiance, fournissant des services de réparation 
              de haute qualité pour les appareils mobiles et les ordinateurs portables depuis 2013. Nos techniciens 
              certifiés combinent des années d'expérience avec les derniers outils et des pièces d'origine.
            </p>
            <p className="text-gray-300 mb-4 sm:mb-6 md:mb-8 leading-relaxed text-sm sm:text-base">
              Des simples remplacements d'écran aux réparations complexes de cartes mères, nous traitons 
              chaque travail avec précision et soin. Nous offrons également des services complets de développement 
              web pour aider les entreprises à établir leur présence numérique.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <div className="bg-yellow-400 text-gray-900 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm">
                Techniciens Certifiés
              </div>
              <div className="bg-yellow-400 text-gray-900 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm">
                Pièces d'Origine
              </div>
              <div className="bg-yellow-400 text-gray-900 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm">
                Garantie Incluse
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;