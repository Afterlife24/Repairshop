import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-6 sm:py-8 md:py-12 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4 px-4">
            Entrer en <span className="text-yellow-400">Contact</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
            Prêt à réparer votre appareil ou à discuter de votre prochain projet ? 
            Contactez-nous dès aujourd'hui pour une consultation et un devis gratuits.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Contact Information */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="bg-gray-800 p-3 sm:p-4 md:p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Informations de Contact</h3>
              
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="bg-yellow-400 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gray-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-xs sm:text-sm md:text-base">Emplacement Principal</h4>
                    <p className="text-gray-300 text-xs sm:text-sm">123 Rue Tech, Plaza Centre-ville<br />Ville, Région 12345</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="bg-yellow-400 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gray-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-xs sm:text-sm md:text-base">Numéros de Téléphone</h4>
                    <p className="text-gray-300 text-xs sm:text-sm">Principal : 01 23 45 67 89<br />Mobile : 06 12 34 56 78</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="bg-yellow-400 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gray-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-xs sm:text-sm md:text-base">Email</h4>
                    <p className="text-gray-300 text-xs sm:text-sm">info@techfixpro.com<br />support@techfixpro.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="bg-yellow-400 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gray-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-xs sm:text-sm md:text-base">Heures d'Ouverture</h4>
                    <p className="text-gray-300 text-xs sm:text-sm">Lun-Ven : 9h00 - 19h00<br />Sam-Dim : 10h00 - 17h00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="bg-gray-800 p-3 sm:p-4 md:p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Contact Rapide</h3>
              <form className="space-y-2 sm:space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <input
                    type="text"
                    placeholder="Votre Nom"
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs sm:text-sm text-white placeholder-gray-400"
                  />
                  <input
                    type="email"
                    placeholder="Votre Email"
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs sm:text-sm text-white placeholder-gray-400"
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Numéro de Téléphone"
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs sm:text-sm text-white placeholder-gray-400"
                />
                <textarea
                  placeholder="Comment pouvons-nous vous aider ?"
                  rows={2}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs sm:text-sm text-white placeholder-gray-400"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg transition-colors text-xs sm:text-sm"
                >
                  Envoyer le Message
                </button>
              </form>
            </div>
          </div>

          {/* Google Map */}
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
            <div className="h-48 sm:h-64 md:h-80 lg:h-full min-h-[300px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2449325806825!2d-73.98832368459421!3d40.75877727932539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sfr!2sfr!4v1625067653985!5m2!1sfr!2sfr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Emplacement  Pro"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;