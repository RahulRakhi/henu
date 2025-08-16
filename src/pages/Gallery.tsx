import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Eye } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const galleryItems = [
    {
      id: 1,
      title: "Boot Animation",
      category: "boot",
      image: "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Smooth animated boot sequence with the HENU OS logo"
    },
    {
      id: 2,
      title: "GRUB Bootloader",
      category: "boot",
      image: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Custom GRUB theme with modern dark design"
    },
    {
      id: 3,
      title: "Desktop Environment",
      category: "desktop",
      image: "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Clean and modern desktop with customizable panels"
    },
    {
      id: 4,
      title: "Terminal Interface",
      category: "terminal",
      image: "https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Advanced terminal with syntax highlighting and themes"
    },
    {
      id: 5,
      title: "File Manager",
      category: "desktop",
      image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Modern file manager with preview capabilities"
    },
    {
      id: 6,
      title: "Code Editor",
      category: "tools",
      image: "https://images.pexels.com/photos/270373/pexels-photo-270373.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Integrated development environment with all tools"
    },
    {
      id: 7,
      title: "System Monitor",
      category: "tools",
      image: "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Real-time system performance monitoring"
    },
    {
      id: 8,
      title: "Network Manager",
      category: "tools",
      image: "https://images.pexels.com/photos/159275/network-cable-ethernet-computer-159275.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Advanced network configuration and monitoring"
    },
    {
      id: 9,
      title: "Dark Wallpaper",
      category: "wallpapers",
      image: "https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Beautiful dark theme wallpaper collection"
    },
    {
      id: 10,
      title: "Purple Gradient",
      category: "wallpapers",
      image: "https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Stunning purple gradient wallpaper"
    },
    {
      id: 11,
      title: "Abstract Design",
      category: "wallpapers",
      image: "https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Modern abstract wallpaper design"
    },
    {
      id: 12,
      title: "Voice Assistant",
      category: "features",
      image: "https://images.pexels.com/photos/3913025/pexels-photo-3913025.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Voice command interface demonstration"
    }
  ];

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'boot', name: 'Boot & GRUB' },
    { id: 'desktop', name: 'Desktop' },
    { id: 'terminal', name: 'Terminal' },
    { id: 'tools', name: 'Tools' },
    { id: 'wallpapers', name: 'Wallpapers' },
    { id: 'features', name: 'Features' }
  ];

  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

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
            Gallery
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-body leading-relaxed">
            Explore screenshots, wallpapers, and visual demonstrations of HENU OS features and interface.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-400/30 hover:border-purple-400/60 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                {/* Image */}
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-lg font-heading font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-sm font-body opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.description}
                  </p>
                </div>

                {/* Hover Icons */}
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-full"
                  >
                    <Eye size={16} className="text-white" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-full"
                  >
                    <Download size={16} className="text-white" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-4xl max-h-full bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-purple-400/30 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200"
                >
                  <X size={24} className="text-white" />
                </button>

                {/* Image */}
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-heading font-bold text-white mb-2">
                    {selectedImage.title}
                  </h2>
                  <p className="text-gray-300 font-body">
                    {selectedImage.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold flex items-center space-x-2 transition-all duration-300"
                    >
                      <Download size={16} />
                      <span>Download</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Gallery;