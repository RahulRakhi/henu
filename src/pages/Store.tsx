import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Grid, List } from 'lucide-react';

const Store = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);

  const products = [
    {
      id: 1,
      name: "HENU OS Classic T-Shirt",
      price: 29.99,
      originalPrice: 39.99,
      category: "tshirts",
      image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Premium quality cotton t-shirt with the iconic HENU OS logo",
      rating: 4.8,
      reviews: 124,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Black", "Navy", "Purple"],
      bestseller: true
    },
    {
      id: 2,
      name: "Developer Hoodie",
      price: 59.99,
      originalPrice: 79.99,
      category: "hoodies",
      image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Comfortable hoodie perfect for coding sessions",
      rating: 4.9,
      reviews: 89,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Gray", "Purple"],
      bestseller: false
    },
    {
      id: 3,
      name: "Terminal Command Stickers Pack",
      price: 9.99,
      originalPrice: 14.99,
      category: "stickers",
      image: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Pack of 20 waterproof stickers with popular terminal commands",
      rating: 4.7,
      reviews: 256,
      sizes: ["One Size"],
      colors: ["Multi"],
      bestseller: true
    },
    {
      id: 4,
      name: "HENU OS Logo Mug",
      price: 19.99,
      originalPrice: 24.99,
      category: "accessories",
      image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "High-quality ceramic mug with HENU OS branding",
      rating: 4.6,
      reviews: 178,
      sizes: ["350ml", "500ml"],
      colors: ["Black", "White"],
      bestseller: false
    },
    {
      id: 5,
      name: "Programmer's Cap",
      price: 24.99,
      originalPrice: 29.99,
      category: "accessories",
      image: "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Adjustable cap with embroidered HENU OS logo",
      rating: 4.5,
      reviews: 92,
      sizes: ["One Size"],
      colors: ["Black", "Navy", "Purple"],
      bestseller: false
    },
    {
      id: 6,
      name: "Coding Enthusiast Sweatshirt",
      price: 49.99,
      originalPrice: 64.99,
      category: "sweatshirts",
      image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Soft and warm sweatshirt for the coding lifestyle",
      rating: 4.8,
      reviews: 143,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Gray", "Black", "Navy"],
      bestseller: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'tshirts', name: 'T-Shirts', count: products.filter(p => p.category === 'tshirts').length },
    { id: 'hoodies', name: 'Hoodies', count: products.filter(p => p.category === 'hoodies').length },
    { id: 'sweatshirts', name: 'Sweatshirts', count: products.filter(p => p.category === 'sweatshirts').length },
    { id: 'accessories', name: 'Accessories', count: products.filter(p => p.category === 'accessories').length },
    { id: 'stickers', name: 'Stickers', count: products.filter(p => p.category === 'stickers').length }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const addToCart = (product: any) => {
    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            Store
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-body leading-relaxed">
            Official HENU OS merchandise. Show your support with premium quality apparel and accessories.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12"
        >
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                {category.name} ({category.count})
              </motion.button>
            ))}
          </div>

          {/* View Mode and Cart */}
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-800/50 rounded-full p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List size={20} />
              </button>
            </div>

            {/* Cart Icon */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="relative p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white shadow-lg"
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`group bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-400/30 hover:border-purple-400/60 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Image */}
              <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                  {product.bestseller && (
                    <span className="px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold rounded-full">
                      Bestseller
                    </span>
                  )}
                  {product.originalPrice > product.price && (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                      Sale
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <Heart 
                    size={16} 
                    className={`${
                      wishlist.includes(product.id) 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-white'
                    }`}
                  />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 flex-1">
                <h3 className="text-lg font-heading font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                  {product.name}
                </h3>

                <p className="text-gray-300 font-body text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl font-bold text-white">
                    ${product.price}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-lg text-gray-400 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Sizes and Colors */}
                <div className="space-y-3 mb-4">
                  <div>
                    <span className="text-gray-400 text-sm">Sizes: </span>
                    <span className="text-gray-200 text-sm">{product.sizes.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Colors: </span>
                    <span className="text-gray-200 text-sm">{product.colors.join(', ')}</span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(product)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Products */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-2xl text-gray-400 font-body">
              No products found in this category.
            </p>
          </motion.div>
        )}

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="p-12 bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-3xl border border-purple-400/30 max-w-4xl mx-auto">
            <h2 className="text-4xl font-heading font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Stay Updated
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-body">
              Get notified about new products, exclusive deals, and HENU OS updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-gray-800/50 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors duration-300"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold transition-all duration-300"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Store;