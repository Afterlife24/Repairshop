import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart, ShoppingCart, Eye } from 'lucide-react';

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

interface ProductCarouselProps {
  type: 'mobile' | 'laptop';
  title: string;
  onProductClick: (product: Product) => void;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ type, title, onProductClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsToShow = 4;

const fetchProducts = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);
    
    const endpoint = type === 'mobile' 
      ? 'https://rppe4wbr3k.execute-api.eu-west-3.amazonaws.com/api/products/mobile' 
      : 'https://rppe4wbr3k.execute-api.eu-west-3.amazonaws.com/api/products/laptop';

    console.log("yesss")
    
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Ensure image URLs are properly formatted
    const processedProducts = data.map((product: Product) => ({
  ...product,
  // No need to modify image URL since it's already absolute
}));
    
    setProducts(processedProducts);
  } catch (err) {
    setError(err.message);
    console.error('Fetch error:', err);
    setProducts([]);
  } finally {
    setLoading(false);
  }
}, [type]);



  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);


  useEffect(() => {
    if (!isAutoPlaying || isTransitioning || products.length === 0) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % Math.ceil(products.length / itemsToShow) * itemsToShow);
        setIsTransitioning(false);
      }, 150);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isTransitioning, products.length]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + itemsToShow) % products.length);
      setIsTransitioning(false);
    }, 150);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev - itemsToShow + products.length) % products.length);
      setIsTransitioning(false);
    }, 150);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index * itemsToShow);
      setIsTransitioning(false);
    }, 150);
  };

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
      />
    ));
  };

  if (loading) {
    return (
      <div className="relative bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong>Error: </strong>
          {error}
          <button 
            onClick={fetchProducts}
            className="ml-2 bg-yellow-400 text-gray-900 font-semibold py-1 px-3 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="relative bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl text-center">
        <h3 className="text-xl font-bold text-white mb-4">No Products Available</h3>
        <button 
          onClick={fetchProducts}
          className="bg-yellow-400 text-gray-900 font-semibold py-2 px-4 rounded-lg"
        >
          Refresh Products
        </button>
      </div>
    );
  }

  if (error) {
  return (
    <div className="error-container">
      <h3>Error Loading Products</h3>
      <p>{error}</p>
      <button 
        onClick={fetchProducts}
        className="retry-button"
      >
        Retry
      </button>
      <details>
        <summary>Technical Details</summary>
        <p>Endpoint: {type === 'mobile' ? '/api/products/mobiles' : '/api/products/laptops'}</p>
        <p>Please check:
          <ul>
            <li>Backend server is running</li>
            <li>Correct endpoint URL</li>
            <li>Network connection</li>
          </ul>
        </p>
      </details>
    </div>
  );
}

  return (
    <div 
      className="relative bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-700/50 shadow-2xl"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
            {title}
          </h3>
          <p className="text-gray-400 text-sm">
            {products.length} products available • Free shipping
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-400">
            <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
            <span>{isAutoPlaying ? 'Auto' : 'Manual'}</span>
          </div>
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="p-2 sm:p-3 bg-gray-700/80 hover:bg-gray-600 disabled:opacity-50 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="p-2 sm:p-3 bg-gray-700/80 hover:bg-gray-600 disabled:opacity-50 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl">
        <div 
          className={`flex transition-all duration-700 ease-in-out ${isTransitioning ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}
          style={{ 
            transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` 
          }}
        >
          {products.map((product) => {
            const isFavorite = favorites.includes(product.id);
            
            return (
               <div key={product.id} className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-2 transition-all duration-500">
                <div 
              className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-xl p-4 border border-gray-700/50 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer backdrop-blur-sm"
              onClick={() => onProductClick(product)}
            >
                  <div className="relative mb-4 overflow-hidden rounded-lg group">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Product+Image';
                  }}
                />
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onProductClick(product);
                        }}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                      >
                        <Eye className="h-4 w-4 text-white" />
                      </button>
                      <button
                        onClick={(e) => toggleFavorite(product.id, e)}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                      >
                        <Heart className={`h-4 w-4 ${isFavorite ? 'text-red-400 fill-current' : 'text-white'}`} />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                      >
                        <ShoppingCart className="h-4 w-4 text-white" />
                      </button>
                    </div>

                    <div className="absolute top-2 left-2 flex flex-col space-y-1">
                      {product.discount && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                          {product.discount}
                        </span>
                      )}
                      {!product.inStock && (
                        <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          Out of stock
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2 right-2">
                      <span className="bg-yellow-400/90 text-gray-900 text-xs px-2 py-1 rounded-full font-semibold">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2">
                      <p className="text-gray-400 text-xs font-medium">{product.brand}</p>
                      <h4 className="text-sm sm:text-base font-semibold text-white line-clamp-2 group-hover:text-yellow-400 transition-colors">
                        {product.name}
                      </h4>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center space-x-1">
                        {renderStars(product.rating)}
                      </div>
                      <span className="text-xs text-gray-400">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    <div className="mb-3 space-y-1">
                      {product.features.slice(0, 2).map((feature, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-800/80 text-gray-300 text-xs px-2 py-1 rounded mr-1 mb-1 border border-gray-700/50"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg sm:text-xl font-bold text-yellow-400">
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onProductClick(product);
                      }}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-semibold py-2 px-3 rounded-lg transition-all duration-300 text-sm hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
        {Array.from({ length: Math.ceil(products.length / itemsToShow) }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className={`transition-all duration-300 ${
              Math.floor(currentIndex / itemsToShow) === index
                ? 'w-8 h-3 bg-yellow-400 rounded-full'
                : 'w-3 h-3 bg-gray-600 hover:bg-gray-500 rounded-full'
            }`}
          />
        ))}
      </div>

      <div className="mt-4 w-full bg-gray-700 rounded-full h-1 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-700 ease-out"
          style={{ 
            width: `${((currentIndex + itemsToShow) / products.length) * 100}%` 
          }}
        />
      </div>
    </div>
  );
};

export default ProductCarousel;