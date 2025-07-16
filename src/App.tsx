import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import RepairBooking from './components/RepairBooking';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'mobile-booking' | 'laptop-booking'>('home');

  const handleNavigateToBooking = (deviceType: 'mobile' | 'laptop') => {
    setCurrentView(deviceType === 'mobile' ? 'mobile-booking' : 'laptop-booking');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  if (currentView === 'mobile-booking') {
    return (
      <div className="min-h-screen">
        <Header onBackToHome={handleBackToHome} />
        <RepairBooking deviceType="mobile" onBackToHome={handleBackToHome} />
        <Footer />
      </div>
    );
  }

  if (currentView === 'laptop-booking') {
    return (
      <div className="min-h-screen">
        <Header onBackToHome={handleBackToHome} />
        <RepairBooking deviceType="laptop" onBackToHome={handleBackToHome} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header onBackToHome={handleBackToHome} />
      <Hero onNavigateToBooking={handleNavigateToBooking} />
      <About />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;