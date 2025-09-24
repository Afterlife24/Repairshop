import React, { useState } from 'react';
import { Menu, X, Smartphone, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  onBackToHome?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBackToHome }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleBookRepair = () => {
    // Navigate to booking flow
    window.location.hash = '#home';
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      window.location.hash = '#home';
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="mr-1 sm:mr-2 p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Retour à l'accueil"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}
            <button onClick={handleLogoClick} className="flex items-center space-x-2">
              <div className="bg-yellow-400 p-1.5 sm:p-2 rounded-lg">
                <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold">Smartphonecity</h1>
            </button>
          </div>
          
          <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center">
            <a href="#home" className="hover:text-yellow-400 transition-colors text-sm lg:text-base">Accueil</a>
            <a href="#services" className="hover:text-yellow-400 transition-colors text-sm lg:text-base">Services</a>
            <a href="#about" className="hover:text-yellow-400 transition-colors text-sm lg:text-base">À propos</a>
            <a href="#contact" className="hover:text-yellow-400 transition-colors text-sm lg:text-base">Contact</a>
            <button 
              onClick={handleBookRepair}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg font-semibold transition-colors text-sm lg:text-base whitespace-nowrap"
            >
              Réserver une Réparation
            </button>
          </nav>

          <button
            className="md:hidden p-1"
            onClick={toggleMenu}
            aria-label="Basculer le menu"
          >
            {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-3 sm:mt-4 pb-3 sm:pb-4 border-t border-gray-800 pt-3 sm:pt-4">
            <div className="flex flex-col space-y-3 sm:space-y-4">
              <a href="#home" className="hover:text-yellow-400 transition-colors text-sm sm:text-base" onClick={toggleMenu}>Accueil</a>
              <a href="#services" className="hover:text-yellow-400 transition-colors text-sm sm:text-base" onClick={toggleMenu}>Services</a>
              <a href="#about" className="hover:text-yellow-400 transition-colors text-sm sm:text-base" onClick={toggleMenu}>À propos</a>
              <a href="#contact" className="hover:text-yellow-400 transition-colors text-sm sm:text-base" onClick={toggleMenu}>Contact</a>
              <button 
                onClick={handleBookRepair}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-semibold transition-colors text-left text-sm sm:text-base"
              >
                Smart Mepermatic
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;