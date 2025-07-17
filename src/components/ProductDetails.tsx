import React, { useState } from 'react';
import { X, Star, Heart, Share2, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
  isOpen: boolean;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onClose, isOpen }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  // Base server URL for serving image path
  const serverUrl = 'https://rppe4wbr3k.execute-api.eu-west-3.amazonaws.com'; // or import.meta.env.VITE_API_URL

  const productImages = [
    `${serverUrl}${product.image}`, // dynamically load from backend
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=600'
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
      />
    ));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">{product.name}</h2>
              <p className="text-gray-400 text-sm">{product.brand} • {product.category}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-square bg-gray-800 rounded-xl overflow-hidden">
                  <img
                    src={productImages[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400x400?text=Image+Not+Found")}
                  />

                  {/* Image Navigation */}
                  <button
                    onClick={() => setSelectedImageIndex(prev => prev === 0 ? productImages.length - 1 : prev - 1)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4 text-white" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(prev => prev === productImages.length - 1 ? 0 : prev + 1)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full"
                  >
                    <ChevronRight className="h-4 w-4 text-white" />
                  </button>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {product.discount && (
                      <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
                        {product.discount}
                      </span>
                    )}
                    <span className="bg-yellow-400 text-gray-900 text-sm px-3 py-1 rounded-full font-semibold">
                      {product.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Rating */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-gray-400 text-sm">
                    {product.rating} ({product.reviews} avis)
                  </span>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold text-yellow-400">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xl text-gray-400 line-through">{product.originalPrice}</span>
                    )}
                  </div>
                  <p className="text-green-400 text-sm font-medium">
                    ✓ En stock • Livraison gratuite • Garantie 2 ans
                  </p>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Caractéristiques principales</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-lg border border-gray-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="flex-1 border border-gray-600 hover:border-yellow-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'text-red-400 fill-current' : 'text-gray-400'}`} />
                    <span>{isFavorite ? 'Retiré des favoris' : 'Ajouter aux favoris'}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
                  >
                    <Share2 className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                {/* Contact */}
                <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 border border-yellow-400/30 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2">Intéressé par ce produit ?</h4>
                  <p className="text-gray-300 text-sm mb-3">
                    Contactez-nous pour plus d'informations ou pour passer commande
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-4 rounded-lg text-sm">
                      Nous contacter
                    </button>
                    <button className="flex-1 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 font-semibold py-2 px-4 rounded-lg text-sm">
                      Demander un devis
                    </button>
                  </div>
                </div>

                {/* Service Icons */}
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-700">
                  <div className="text-center">
                    <Truck className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Livraison gratuite</p>
                  </div>
                  <div className="text-center">
                    <Shield className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Garantie 2 ans</p>
                  </div>
                  <div className="text-center">
                    <RotateCcw className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Retour 30 jours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-700">
              <div className="flex space-x-8 px-4 sm:px-6">
                {['description', 'specifications', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`py-4 border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-yellow-400 text-yellow-400'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab === 'description' ? 'Description' : tab === 'specifications' ? 'Spécifications' : 'Avis'}
                  </button>
                ))}
              </div>

              <div className="p-4 sm:p-6">
                {activeTab === 'description' && (
                  <div className="text-gray-300 leading-relaxed space-y-4">
                    <p>{product.description}</p>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-3 border-b border-gray-800">
                        <span className="text-gray-400 font-medium">{key}</span>
                        <span className="text-white font-medium text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-semibold">Avis clients</h4>
                      <div className="flex items-center space-x-2">
                        {renderStars(product.rating)}
                        <span className="text-gray-400 text-sm">{product.rating}/5 ({product.reviews} avis)</span>
                      </div>
                    </div>
                    <div className="text-gray-400 text-center py-8">
                      <p>Les avis clients seront affichés ici</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductDetails;
