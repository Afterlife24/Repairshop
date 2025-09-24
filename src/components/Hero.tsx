import React, { useState } from 'react';
import { Smartphone, Laptop, MapPin, Clock } from 'lucide-react';
import ProductCarousel from './ProductCarousel';
import ProductDetails from './ProductDetails';

interface Product {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating: number;
  reviews: number;
  features: string[];
  specifications: Record<string, string>;
  description: string;
  inStock: boolean;
  category: string;
}

interface HeroProps {
  onNavigateToBooking: (deviceType: 'mobile' | 'laptop') => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigateToBooking }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDetailsOpen(true);
  };

  const handleCloseProductDetails = () => {
    setIsProductDetailsOpen(false);
    setSelectedProduct(null);
  };

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col justify-center py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Bubbles */}
        <div className="absolute top-20 left-10 w-16 h-16 md:w-20 md:h-20 bg-yellow-400/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 md:w-32 md:h-32 bg-yellow-400/5 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 md:w-16 md:h-16 bg-yellow-400/15 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-60 left-1/3 w-20 h-20 md:w-24 md:h-24 bg-yellow-400/8 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/4 w-24 h-24 md:w-28 md:h-28 bg-yellow-400/6 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
        
        {/* Geometric Lines */}
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="#FDE047" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            
            {/* Diagonal Lines */}
            <line x1="0" y1="0" x2="200" y2="200" stroke="url(#lineGradient)" strokeWidth="1" className="animate-pulse"/>
            <line x1="100" y1="0" x2="300" y2="200" stroke="url(#lineGradient)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '1s' }}/>
            <line x1="200" y1="0" x2="400" y2="200" stroke="url(#lineGradient)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '2s' }}/>
            
            {/* Circuit-like patterns */}
            <path d="M50 100 L150 100 L150 200 L250 200" stroke="#FDE047" strokeWidth="1" fill="none" opacity="0.2" className="animate-pulse" style={{ animationDelay: '0.5s' }}/>
            <path d="M300 50 L400 50 L400 150 L500 150" stroke="#FDE047" strokeWidth="1" fill="none" opacity="0.15" className="animate-pulse" style={{ animationDelay: '1.5s' }}/>
            
            {/* Tech-inspired dots */}
            <circle cx="150" cy="100" r="2" fill="#FDE047" opacity="0.4" className="animate-ping" style={{ animationDelay: '1s' }}/>
            <circle cx="250" cy="200" r="2" fill="#FDE047" opacity="0.4" className="animate-ping" style={{ animationDelay: '2s' }}/>
            <circle cx="400" cy="50" r="2" fill="#FDE047" opacity="0.4" className="animate-ping" style={{ animationDelay: '3s' }}/>
            <circle cx="500" cy="150" r="2" fill="#FDE047" opacity="0.4" className="animate-ping" style={{ animationDelay: '0.5s' }}/>
          </svg>
        </div>
        
        {/* Floating Tech Icons */}
        <div className="absolute top-32 right-32 text-yellow-400/20 animate-bounce hidden md:block" style={{ animationDuration: '6s' }}>
          <Smartphone className="h-6 w-6 md:h-8 md:w-8" />
        </div>
        <div className="absolute bottom-32 left-32 text-yellow-400/20 animate-bounce hidden md:block" style={{ animationDuration: '5s', animationDelay: '2s' }}>
          <Laptop className="h-8 w-8 md:h-10 md:w-10" />
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-r from-yellow-400/5 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-l from-yellow-400/8 to-transparent rounded-full blur-lg animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10 flex-1 flex flex-col justify-center">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Services de <span className="text-yellow-400">Réparation Tech</span> Experts
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            Réparation professionnelle de mobiles et ordinateurs portables avec solutions le jour même
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto mb-8 md:mb-16">
          {/* Mobile Repair Card */}
          <div className="bg-white text-gray-900 rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm cursor-pointer"
               onClick={() => onNavigateToBooking('mobile')}>
            <div className="relative h-32 sm:h-40 overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Réparation de téléphone mobile" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-yellow-400 p-1.5 sm:p-2 rounded-full">
                <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900" />
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">Centre de Réparation Mobile
</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                Remplacement d'écran, problèmes de batterie, récupération après dégâts des eaux
              </p>
              
              <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                <div className="flex items-center text-xs text-gray-700">
                  <MapPin className="h-3 w-3 text-yellow-500 mr-2 flex-shrink-0" />
                  <span className="truncate">Smart Phone City 
82 Boulevard Victor Hugo
44200 Nantes
</span>
                </div>
                <div className="flex items-center text-xs text-gray-700">
                  <Clock className="h-3 w-3 text-yellow-500 mr-2 flex-shrink-0" />
                  <span>Réparations le jour même disponibles</span>
                </div>
              </div>

              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors text-xs sm:text-sm">
                Réserver Réparation Mobile
              </button>
            </div>
          </div>

          {/* Laptop Repair Card */}
          <div className="bg-white text-gray-900 rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm cursor-pointer"
               onClick={() => onNavigateToBooking('laptop')}>
            <div className="relative h-32 sm:h-40 overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/5582596/pexels-photo-5582596.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Service de réparation d'ordinateur portable" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-yellow-400 p-1.5 sm:p-2 rounded-full">
                <Laptop className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900" />
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">Centre de Réparation Ordinateur Portable</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                Mises à niveau matérielles, suppression de virus, récupération de données
              </p>
              
              <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                <div className="flex items-center text-xs text-gray-700">
                  <MapPin className="h-3 w-3 text-yellow-500 mr-2 flex-shrink-0" />
                  <span className="truncate">Smart Informatique
6 Place Mangin
44200 Nantes
</span>
                </div>
                <div className="flex items-center text-xs text-gray-700">
                  <Clock className="h-3 w-3 text-yellow-500 mr-2 flex-shrink-0" />
                  <span>Délai de traitement 24-48 heures</span>
                </div>
              </div>

              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors text-xs sm:text-sm">
                Réserver Réparation Ordinateur Portable
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Product Showcase Carousels */}
        <div className="space-y-8 md:space-y-12 max-w-7xl mx-auto w-full">
          {/* Mobile Products Carousel */}
          <ProductCarousel 
            type="mobile" 
            title="📱 Mobiles Premium - Dernières Nouveautés"
            onProductClick={handleProductClick}
          />
          
          {/* Laptop Products Carousel */}
          <ProductCarousel 
            type="laptop" 
            title="💻 Ordinateurs Portables - Performance & Innovation"
            onProductClick={handleProductClick}
          />
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={handleCloseProductDetails}
          isOpen={isProductDetailsOpen}
        />
      )}
    </section>
  );
};

export default Hero;