import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Smartphone, Laptop, Check, Search, Calendar, Clock, User, Mail, Phone, Tablet, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Interfaces
interface Device {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: 'mobile' | 'laptop';
}

interface DeviceSubtype {
  id: string;
  name: string;
  icon: React.ReactNode;
  parentType: 'mobile' | 'laptop';
}

interface Brand {
  _id?: string;
  name: string;
  models?: string[];
  repairCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface RepairDocument {
  _id: string;
  brand: string;
  model: string;
  repairOptions: RepairService[];
  createdAt?: string;
  updatedAt?: string;
}

interface RepairService {
  name: string;
  estimatedCost: number;
  description: string;
  screenType?: string;
  includesKeyboard?: boolean;
  includesStylus?: boolean;
  includesControllers?: boolean;
  _id?: string;
}

interface RepairBookingProps {
  deviceType?: 'mobile' | 'laptop';
  onBackToHome?: () => void;
}

const API_BASE_URL = 'https://rppe4wbr3k.execute-api.eu-west-3.amazonaws.com/api';

const RepairBooking: React.FC<RepairBookingProps> = ({ deviceType, onBackToHome }) => {
  // Devices array
  const devices: Device[] = [
    {
      id: 'mobile',
      name: 'Téléphone Mobile',
      icon: <Smartphone className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />,
      type: 'mobile'
    },
    {
      id: 'laptop',
      name: 'Ordinateur Portable',
      icon: <Laptop className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />,
      type: 'laptop'
    }
  ];

  // Device subtypes
  const deviceSubtypes: DeviceSubtype[] = [
    {
      id: 'mobile',
      name: 'Téléphone Mobile',
      icon: <Smartphone className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />,
      parentType: 'mobile'
    },
    {
      id: 'tablet',
      name: 'Tablette',
      icon: <Tablet className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />,
      parentType: 'mobile'
    },
    {
      id: 'laptop',
      name: 'Ordinateur Portable',
      icon: <Laptop className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />,
      parentType: 'laptop'
    },
    {
      id: 'console',
      name: 'Console de Jeu',
      icon: <Gamepad2 className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />,
      parentType: 'laptop'
    }
  ];

  // Get device emoji for model selection
  const getDeviceEmoji = (type: string) => {
    switch(type) {
      case 'mobile': return '📱';
      case 'tablet': return '📱';
      case 'laptop': return '💻';
      case 'console': return '🎮';
      default: return '📱';
    }
  };

  // State initialization
  const [currentStep, setCurrentStep] = useState(deviceType ? 2 : 1);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(
    deviceType ? devices.find(d => d.type === deviceType) || null : null
  );
  const [selectedSubtype, setSelectedSubtype] = useState<DeviceSubtype | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedRepairDoc, setSelectedRepairDoc] = useState<RepairDocument | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    name: '',
    firstName: '',
    email: '',
    phone: ''
  });
  const [isMobile, setIsMobile] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [repairDocs, setRepairDocs] = useState<RepairDocument[]>([]);
  const [isLoading, setIsLoading] = useState({
    brands: false,
    models: false,
    submitting: false
  });
  const [error, setError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  // Reset form function
  const resetForm = () => {
    setCurrentStep(deviceType ? 2 : 1);
    if (!deviceType) {
      setSelectedDevice(null);
    }
    setSelectedSubtype(null);
    setSelectedBrand(null);
    setSelectedRepairDoc(null);
    setSelectedServices([]);
    setAppointmentData({
      date: '',
      time: '',
      name: '',
      firstName: '',
      email: '',
      phone: ''
    });
    setSearchTerm('');
  };

  // Fetch brands when subtype is selected
  useEffect(() => {
    if (selectedSubtype) {
      const fetchBrands = async () => {
        setIsLoading(prev => ({ ...prev, brands: true }));
        setError(null);
        try {
          let category;
          switch(selectedSubtype.id) {
            case 'mobile':
              category = 'mobile';
              break;
            case 'tablet':
              category = 'tablet';
              break;
            case 'laptop':
              category = 'laptop';
              break;
            case 'console':
              category = 'console';
              break;
            default:
              throw new Error('Invalid subtype');
          }
  
          const response = await fetch(`${API_BASE_URL}/brands/${category}`);
          if (!response.ok) throw new Error('Failed to fetch brands');
          const data = await response.json();
          setBrands(data);
        } catch (err) {
          setError('Failed to load brands');
          console.error(err);
        } finally {
          setIsLoading(prev => ({ ...prev, brands: false }));
        }
      };
      fetchBrands();
    }
  }, [selectedSubtype]);

  // Fetch repair documents (models) for selected brand and subtype
  useEffect(() => {
    if (selectedBrand && selectedSubtype) {
      const fetchRepairDocs = async () => {
        setIsLoading(prev => ({ ...prev, models: true }));
        setError(null);
        try {
          let endpoint = '';
          switch(selectedSubtype.id) {
            case 'mobile':
              endpoint = 'mobiles';
              break;
            case 'tablet':
              endpoint = 'tablets';
              break;
            case 'laptop':
              endpoint = 'laptops';
              break;
            case 'console':
              endpoint = 'consoles';
              break;
            default:
              throw new Error('Invalid subtype');
          }

          const response = await fetch(
            `${API_BASE_URL}/repairs/${endpoint}?brand=${encodeURIComponent(selectedBrand.name)}`
          );
          if (!response.ok) throw new Error('Failed to fetch models');
          const data = await response.json();
          setRepairDocs(data);
        } catch (err) {
          setError('Failed to load models');
          console.error(err);
        } finally {
          setIsLoading(prev => ({ ...prev, models: false }));
        }
      };
      fetchRepairDocs();
    }
  }, [selectedBrand, selectedSubtype]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter functions
  const filteredSubtypes = deviceSubtypes.filter(subtype => 
    selectedDevice ? subtype.parentType === selectedDevice.type : true
  );

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRepairDocs = repairDocs.filter(doc =>
    doc.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleModelSelection = (repairDoc: RepairDocument) => {
    setSelectedRepairDoc(repairDoc);
    nextStep();
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const totalPrice = selectedServices.reduce((total, serviceId) => {
    const service = selectedRepairDoc?.repairOptions.find(s => s._id === serviceId);
    return total + (service ? service.estimatedCost : 0);
  }, 0);

  useEffect(() => {
    window.history.pushState({ step: currentStep }, '');

    const handlePopState = (event) => {
      if (currentStep > 1) {
        prevStep();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentStep]);

  const prevStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      
      if (newStep === 1 && deviceType && onBackToHome) {
        onBackToHome();
        return;
      }
      
      if (newStep === 1) {
        setSelectedDevice(null);
        setSelectedSubtype(null);
        setSelectedBrand(null);
        setSelectedRepairDoc(null);
        setSelectedServices([]);
      } else if (newStep === 2) {
        setSelectedSubtype(null);
        setSelectedBrand(null);
        setSelectedRepairDoc(null);
        setSelectedServices([]);
      } else if (newStep === 3) {
        setSelectedBrand(null);
        setSelectedRepairDoc(null);
        setSelectedServices([]);
      } else if (newStep === 4) {
        setSelectedRepairDoc(null);
        setSelectedServices([]);
      } else if (newStep === 5) {
        setSelectedServices([]);
      }
      
      setCurrentStep(newStep);
      setSearchTerm('');
      window.history.replaceState({ step: newStep }, '');
    }
  };

  const nextStep = () => {
    if (currentStep < 6) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      setSearchTerm('');
      window.history.pushState({ step: newStep }, '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!appointmentData.date || !appointmentData.time || !appointmentData.name || !appointmentData.email) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!selectedRepairDoc) {
      setError('Aucun document de réparation sélectionné');
      return;
    }

    setIsLoading(prev => ({ ...prev, submitting: true }));
    setError(null);

    try {
      const appointmentPayload = {
        deviceType: selectedDevice?.type,
        deviceName: selectedDevice?.name,
        subtype: selectedSubtype?.id,
        subtypeName: selectedSubtype?.name,
        brand: selectedBrand?.name,
        model: selectedRepairDoc.model,
        services: selectedServices.map(id => {
          const service = selectedRepairDoc.repairOptions.find(s => s._id === id);
          return {
            id,
            name: service?.name,
            price: service?.estimatedCost,
            description: service?.description
          };
        }),
        totalPrice,
        customer: {
          name: appointmentData.name,
          firstName: appointmentData.firstName,
          email: appointmentData.email,
          phone: appointmentData.phone
        },
        appointment: {
          date: appointmentData.date,
          time: appointmentData.time
        },
        createdAt: new Date().toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la création du rendez-vous');
      }
      
      const data = await response.json();
      console.log('Rendez-vous créé:', data);
      
      // Show success popup
      setShowSuccessPopup(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        resetForm();
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'Échec de la création du rendez-vous');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  const renderStepIndicator = () => {
    const steps = Array.from({ length: 6 }, (_, i) => i + 1);
    
    return (
      <div className="flex justify-center mb-4 md:mb-8 overflow-x-auto py-2">
        <div className="flex items-center space-x-2 md:space-x-4 px-2">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border-2 text-xs sm:text-sm ${
                step <= currentStep 
                  ? 'bg-yellow-400 border-yellow-400 text-gray-900' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {step < currentStep ? <Check className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" /> : step}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-4 sm:w-6 md:w-12 h-0.5 ${
                  step < currentStep ? 'bg-yellow-400' : 'bg-gray-300'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderStepLabels = () => {
    return (
      <div className="flex justify-center mb-4 sm:mb-6 md:mb-8 overflow-x-auto">
        <div className="grid grid-cols-6 gap-1 sm:gap-2 md:gap-8 text-center text-xs sm:text-sm px-2">
          <div className={`min-w-[50px] sm:min-w-[60px] ${currentStep === 1 ? 'text-yellow-400 font-semibold' : 'text-gray-400'}`}>
            Appareil
          </div>
          <div className={`min-w-[50px] sm:min-w-[60px] ${currentStep === 2 ? 'text-yellow-400 font-semibold' : 'text-gray-400'}`}>
            Type
          </div>
          <div className={`min-w-[50px] sm:min-w-[60px] ${currentStep === 3 ? 'text-yellow-400 font-semibold' : 'text-gray-400'}`}>
            Marque
          </div>
          <div className={`min-w-[50px] sm:min-w-[60px] ${currentStep === 4 ? 'text-yellow-400 font-semibold' : 'text-gray-400'}`}>
            Modèle
          </div>
          <div className={`min-w-[50px] sm:min-w-[60px] ${currentStep === 5 ? 'text-yellow-400 font-semibold' : 'text-gray-400'}`}>
            Services
          </div>
          <div className={`min-w-[50px] sm:min-w-[60px] ${currentStep === 6 ? 'text-yellow-400 font-semibold' : 'text-gray-400'}`}>
            Rendez-vous
          </div>
        </div>
      </div>
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section className="py-6 sm:py-8 md:py-12 bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500 text-white p-3 rounded-lg mb-4 text-center"
          >
            {error}
          </motion.div>
        )}

        {onBackToHome && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4 sm:mb-6"
          >
            <button
              onClick={onBackToHome}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Retour à l'Accueil</span>
            </button>
          </motion.div>
        )}

        {selectedDevice && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-center mb-4 sm:mb-6 md:mb-8"
          >
            <div className="inline-flex items-center space-x-2 md:space-x-3 bg-gray-800 px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg">
              <div className="text-yellow-400">
                {selectedDevice.icon}
              </div>
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-white">
                Réservation Réparation {selectedDevice.name}
                {selectedSubtype && ` - ${selectedSubtype.name}`}
              </h1>
            </div>
          </motion.div>
        )}

        {renderStepIndicator()}
        {renderStepLabels()}

        <AnimatePresence mode="wait">
          {/* Step 1: Device Selection */}
          {currentStep === 1 && !deviceType && (
            <motion.div
              key="step1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 md:mb-8 px-4"
              >
                Quel type d'appareil a besoin d'une réparation ?
              </motion.h2>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 max-w-2xl mx-auto"
              >
                {devices.map((device) => (
                  <motion.button
                    key={device.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedDevice(device);
                      setCurrentStep(2);
                    }}
                    className="bg-gray-800 hover:bg-gray-700 border-2 border-gray-700 hover:border-yellow-400 rounded-xl p-4 sm:p-6 transition-all duration-300 group"
                  >
                    <div className="text-yellow-400 mb-2 sm:mb-3 md:mb-4 flex justify-center group-hover:scale-110 transition-transform">
                      {device.icon}
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white">{device.name}</h3>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Device Subtype Selection */}
          {currentStep === 2 && (
            <motion.div
              key="step2-subtype"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 md:mb-8 px-4"
              >
                Quel type précis souhaitez-vous réparer ?
              </motion.h2>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 max-w-2xl mx-auto"
              >
                {filteredSubtypes.map((subtype) => (
                  <motion.button
                    key={subtype.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedSubtype(subtype);
                      nextStep();
                    }}
                    className="bg-gray-800 hover:bg-gray-700 border-2 border-gray-700 hover:border-yellow-400 rounded-xl p-4 sm:p-6 transition-all duration-300 group"
                  >
                    <div className="text-yellow-400 mb-2 sm:mb-3 md:mb-4 flex justify-center group-hover:scale-110 transition-transform">
                      {subtype.icon}
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white">{subtype.name}</h3>
                  </motion.button>
                ))}
              </motion.div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 sm:mt-6 md:mt-8"
              >
                <button
                  onClick={prevStep}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white mx-auto transition-colors text-sm sm:text-base"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Retour</span>
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 3: Brand Selection (with brand logos) */}
          {currentStep === 3 && (
            <motion.div
              key="step3-brand"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 md:mb-8 px-4"
              >
                Quelle est votre marque ?
              </motion.h2>
              
              {isLoading.brands ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
                  <p className="text-gray-400 mt-4">Chargement des marques...</p>
                </div>
              ) : brands.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">Aucune marque disponible pour cette catégorie</p>
                </div>
              ) : (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-4 sm:mb-6 md:mb-8"
                  >
                    <div className="relative max-w-md mx-auto">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5" />
                      <input
                        type="text"
                        placeholder="Rechercher une marque"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 md:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base"
                      />
                    </div>
                  </motion.div>
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6 max-w-4xl mx-auto"
                  >
                    {filteredBrands.map((brand) => (
                      <motion.button
                        key={brand._id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedBrand(brand);
                          nextStep();
                        }}
                        className="bg-gray-800 hover:bg-gray-700 border-2 border-gray-700 hover:border-yellow-400 rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-300 group"
                      >
                        <img
                          src={`./assests/mobile_brands/${brand.name.toLowerCase()}.png`}
                          alt={brand.name}
                          className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 object-contain mx-auto mb-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.className = 'text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2 md:mb-4';
                            fallback.textContent = brand.name.charAt(0).toUpperCase();
                            (e.target as HTMLImageElement).parentNode?.insertBefore(fallback, e.target.nextSibling);
                          }}
                        />
                        <h3 className="text-xs sm:text-sm md:text-lg font-semibold text-white">{brand.name}</h3>
                      </motion.button>
                    ))}
                  </motion.div>
                </>
              )}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 sm:mt-6 md:mt-8"
              >
                <button
                  onClick={prevStep}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white mx-auto transition-colors text-sm sm:text-base"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Retour</span>
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 4: Model Selection (with emoji icons) */}
          {currentStep === 4 && (
            <motion.div
              key="step4-model"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 md:mb-8 px-4"
              >
                Quel est votre modèle {selectedBrand?.name} ?
              </motion.h2>
              
              {isLoading.models ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
                  <p className="text-gray-400 mt-4">Chargement des modèles...</p>
                </div>
              ) : repairDocs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">Aucun modèle disponible pour {selectedBrand?.name}</p>
                </div>
              ) : (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-4 sm:mb-6 md:mb-8"
                  >
                    <div className="relative max-w-md mx-auto">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5" />
                      <input
                        type="text"
                        placeholder={`Rechercher un modèle ${selectedBrand?.name}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 md:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm md:text-base"
                      />
                    </div>
                  </motion.div>
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6"
                  >
                    {filteredRepairDocs.map((repairDoc) => (
                      <motion.button
                        key={repairDoc._id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleModelSelection(repairDoc)}
                        className="bg-gray-800 hover:bg-gray-700 border-2 border-gray-700 hover:border-yellow-400 rounded-lg p-2 sm:p-3 md:p-4 transition-all duration-300 group"
                      >
                        <div className="text-4xl mb-1 sm:mb-2 md:mb-3">
                          {selectedSubtype && getDeviceEmoji(selectedSubtype.id)}
                        </div>
                        <h3 className="text-xs sm:text-sm font-semibold text-white text-center line-clamp-2 mb-1">
                          {repairDoc.model}
                        </h3>
                        <p className="text-xs text-gray-400 text-center">
                          {repairDoc.repairOptions.length} service(s) disponible(s)
                        </p>
                      </motion.button>
                    ))}
                  </motion.div>
                </>
              )}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 sm:mt-6 md:mt-8"
              >
                <button
                  onClick={prevStep}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white mx-auto transition-colors text-sm sm:text-base"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Retour</span>
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* Services Selection Step */}
          {currentStep === 5 && selectedRepairDoc && (
            <motion.div
              key="services"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-4 sm:mb-6 md:mb-8"
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 md:mb-4 px-4">
                  Sélectionnez les réparations à effectuer
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm md:text-base px-4">
                  Tous nos prix sont à jour au {new Date().toLocaleDateString('fr-FR')} et sont indiqués TTC, pièces et main-d'œuvre comprises.
                </p>
              </motion.div>

              {selectedRepairDoc.repairOptions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">Aucun service disponible pour ce modèle</p>
                </div>
              ) : (
                <>
                  {/* Discount Banners */}
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8"
                  >
                    <motion.div 
                      variants={itemVariants}
                      className="bg-green-600 text-white p-2 sm:p-3 md:p-4 rounded-lg"
                    >
                      <div className="text-lg sm:text-xl md:text-2xl font-bold">25€</div>
                      <div className="text-xs sm:text-sm">
                        <strong>REMISE IMMÉDIATE !</strong><br />
                        GRÂCE AU BONUS QUALIREPAR*<br />
                        <em>aucune action requise de votre part</em>
                      </div>
                    </motion.div>
                    <motion.div 
                      variants={itemVariants}
                      className="bg-purple-600 text-white p-2 sm:p-3 md:p-4 rounded-lg"
                    >
                      <div className="text-lg sm:text-xl md:text-2xl font-bold">20€</div>
                      <div className="text-xs sm:text-sm">
                        <strong>REMISE SUR VOTRE DEUXIÈME RÉPARATION</strong><br />
                        <em>offre cumulable avec le bonus qualifié</em>
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-cyan-500 text-white p-2 sm:p-3 md:p-4 rounded-lg mb-4 sm:mb-6 md:mb-8 text-center"
                  >
                    <h3 className="text-base sm:text-lg md:text-xl font-bold">
                      Réparations {selectedBrand?.name || ''} {selectedRepairDoc.model}
                      {selectedSubtype && ` (${selectedSubtype.name})`}
                    </h3>
                  </motion.div>

                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-2 sm:space-y-3 md:space-y-4"
                  >
                    {selectedRepairDoc.repairOptions.map((service) => (
                      <motion.div
                        key={service._id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.005 }}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-2 sm:p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:border-yellow-400 transition-colors"
                      >
                        <div className="flex items-start space-x-2 sm:space-x-3 md:space-x-4 mb-2 sm:mb-0 w-full sm:w-auto">
                          <button
                            onClick={() => toggleService(service._id!)}
                            className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-2 rounded flex-shrink-0 mt-1 ${
                              selectedServices.includes(service._id!)
                                ? 'bg-yellow-400 border-yellow-400'
                                : 'border-gray-400'
                            }`}
                          >
                            {selectedServices.includes(service._id!) && (
                              <Check className="h-2 w-2 sm:h-3 sm:w-3 md:h-4 md:w-4 text-gray-900 mx-auto" />
                            )}
                          </button>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold text-xs sm:text-sm md:text-base">{service.name}</h4>
                            <p className="text-gray-400 text-xs sm:text-sm">{service.description}</p>
                            {service.screenType && (
                              <span className="inline-block bg-blue-500 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded mt-1">
                                {service.screenType}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-white font-bold text-xs sm:text-sm md:text-base ml-6 sm:ml-0 self-end sm:self-center">
                          {service.estimatedCost.toFixed(2)} €
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-4 sm:mt-6 md:mt-8 flex flex-col-reverse sm:flex-row justify-between items-center gap-3 sm:gap-4"
                  >
                    <button
                      onClick={prevStep}
                      className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                    >
                      <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Retour</span>
                    </button>
                    <div className="text-white text-center sm:text-right">
                      <span className="text-sm sm:text-base md:text-lg">Montant du devis : </span>
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400">
                        {totalPrice.toFixed(2)} €
                      </span>
                    </div>
                    <button
                      onClick={nextStep}
                      disabled={selectedServices.length === 0}
                      className={`bg-pink-500 hover:bg-pink-600 disabled:bg-gray-600 text-white px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-colors w-full sm:w-auto text-xs sm:text-sm md:text-base ${
                        selectedServices.length === 0 ? 'cursor-not-allowed' : ''
                      }`}
                    >
                      Prendre rendez-vous
                    </button>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}

          {/* Appointment Booking Step */}
          {currentStep === 6 && (
            <motion.div
              key="appointment"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-4 sm:mb-6 md:mb-8"
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 md:mb-4 px-4">
                  Réservez Votre Rendez-vous
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm md:text-base px-4">
                  Complétez votre réservation en remplissant vos informations
                </p>
              </motion.div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8"
              >
                {/* Summary */}
                <motion.div 
                  variants={itemVariants}
                  className="bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg order-2 lg:order-1"
                >
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 md:mb-4">Résumé</h3>
                  <div className="space-y-1 sm:space-y-2 text-gray-300 text-xs sm:text-sm md:text-base">
                    <p><strong>Appareil :</strong> {selectedDevice?.name}</p>
                    <p><strong>Type :</strong> {selectedSubtype?.name}</p>
                    <p><strong>Modèle :</strong> {selectedBrand?.name || ''} {selectedRepairDoc?.model}</p>
                    <div>
                      <strong>Services :</strong>
                      <ul className="ml-3 sm:ml-4 mt-1 md:mt-2 space-y-1">
                        {selectedServices.map(serviceId => {
                          const service = selectedRepairDoc?.repairOptions.find(s => s._id === serviceId);
                          return service ? (
                            <li key={serviceId} className="flex justify-between text-xs sm:text-sm">
                              <span className="flex-1 pr-2">{service.name}</span>
                              <span className="font-medium">{service.estimatedCost.toFixed(2)} €</span>
                            </li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                    <div className="border-t border-gray-700 pt-2 mt-2 sm:mt-3 md:mt-4">
                      <p className="text-cyan-400 font-bold text-sm sm:text-base md:text-lg">
                        TOTAL (TTC) : {totalPrice.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Appointment Form */}
                <motion.div 
                  variants={itemVariants}
                  className="bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg order-1 lg:order-2"
                >
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 md:mb-4">Rendez-vous</h3>
                  <form className="space-y-2 sm:space-y-3 md:space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                      <div>
                        <label className="block text-white text-xs sm:text-sm font-medium mb-1">
                          Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
                          <input
                            type="date"
                            value={appointmentData.date}
                            onChange={(e) => setAppointmentData({...appointmentData, date: e.target.value})}
                            className="w-full pl-7 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-white text-xs sm:text-sm font-medium mb-1">
                          Créneau horaire <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
                          <select
                            value={appointmentData.time}
                            onChange={(e) => setAppointmentData({...appointmentData, time: e.target.value})}
                            className="w-full pl-7 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none"
                            required
                          >
                            <option value="">Choisir un horaire</option>
                            {timeSlots.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                      <div>
                        <label className="block text-white text-xs sm:text-sm font-medium mb-1">
                          Nom <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
                          <input
                            type="text"
                            value={appointmentData.name}
                            onChange={(e) => setAppointmentData({...appointmentData, name: e.target.value})}
                            className="w-full pl-7 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-white text-xs sm:text-sm font-medium mb-1">
                          Prénom
                        </label>
                        <div className="relative">
                          <User className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
                          <input
                            type="text"
                            value={appointmentData.firstName}
                            onChange={(e) => setAppointmentData({...appointmentData, firstName: e.target.value})}
                            className="w-full pl-7 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                      <div>
                        <label className="block text-white text-xs sm:text-sm font-medium mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
                          <input
                            type="email"
                            value={appointmentData.email}
                            onChange={(e) => setAppointmentData({...appointmentData, email: e.target.value})}
                            className="w-full pl-7 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-white text-xs sm:text-sm font-medium mb-1">
                          Téléphone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
                          <input
                            type="tel"
                            value={appointmentData.phone}
                            onChange={(e) => setAppointmentData({...appointmentData, phone: e.target.value})}
                            className="w-full pl-7 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-2 sm:gap-3 pt-2 sm:pt-3 md:pt-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
                      >
                        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>Retour</span>
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading.submitting}
                        className={`bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-3 py-2 sm:px-4 sm:py-2 md:px-8 md:py-3 rounded-lg font-semibold transition-colors w-full sm:w-auto text-xs sm:text-sm md:text-base ${
                          isLoading.submitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading.submitting ? 'Traitement en cours...' : 'Confirmer le Rendez-vous'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 p-4"
        >
          <motion.div 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="bg-green-500 text-white p-6 rounded-lg max-w-md w-full text-center"
          >
            <Check className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Rendez-vous confirmé!</h3>
            <p className="mb-4">Votre rendez-vous a été enregistré avec succès.</p>
            <p className="text-sm">Un email de confirmation vous a été envoyé.</p>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default RepairBooking;