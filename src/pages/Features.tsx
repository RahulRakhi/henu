import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Zap, 
  Cpu, 
  Terminal, 
  Code, 
  Mic, 
  Globe, 
  Shield, 
  Rocket,
  Palette,
  Database,
  Wifi,
  Settings
} from 'lucide-react';

const Features = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast Installer",
      description: "Custom installer with automated partitioning, driver detection, and one-click setup process.",
      category: "installer"
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Optimized Performance",
      description: "Kernel-level optimizations for maximum performance with minimal resource usage.",
      category: "performance"
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Complete Dev Environment",
      description: "Pre-installed with VS Code, Docker, Node.js, Python, Git, and all major development tools.",
      category: "tools"
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Voice Commands",
      description: "Execute system commands, navigate files, and control applications using natural voice.",
      category: "voice"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-Language Support",
      description: "Full Hindi, English, and regional language support in UI and voice recognition.",
      category: "language"
    },
    {
      icon: <Terminal className="w-8 h-8" />,
      title: "Advanced Terminal",
      description: "Custom terminal with syntax highlighting, auto-completion, and productivity shortcuts.",
      category: "tools"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enhanced Security",
      description: "Built-in firewall, encrypted storage, and secure boot with privacy-focused defaults.",
      category: "security"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Fast Boot Time",
      description: "Optimized boot sequence achieving desktop ready state in under 10 seconds.",
      category: "performance"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Beautiful Themes",
      description: "Multiple dark and light themes with customizable accent colors and layouts.",
      category: "ui"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Package Manager",
      description: "Advanced package management with automatic dependency resolution and updates.",
      category: "tools"
    },
    {
      icon: <Wifi className="w-8 h-8" />,
      title: "Network Tools",
      description: "Built-in network diagnostics, VPN support, and connection management tools.",
      category: "network"
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Easy Configuration",
      description: "Intuitive settings panel with advanced options for power users and simple mode for beginners.",
      category: "ui"
    }
  ];

  const categories = [
    { id: 'installer', name: 'Installer', color: 'from-purple-600 to-blue-600' },
    { id: 'performance', name: 'Performance', color: 'from-green-600 to-teal-600' },
    { id: 'tools', name: 'Developer Tools', color: 'from-orange-600 to-red-600' },
    { id: 'voice', name: 'Voice Control', color: 'from-pink-600 to-purple-600' },
    { id: 'language', name: 'Multi-Language', color: 'from-indigo-600 to-purple-600' },
    { id: 'security', name: 'Security', color: 'from-red-600 to-pink-600' },
    { id: 'ui', name: 'User Interface', color: 'from-cyan-600 to-blue-600' },
    { id: 'network', name: 'Networking', color: 'from-yellow-600 to-orange-600' }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            Powerful Features
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-body leading-relaxed">
            HENU OS combines cutting-edge technology with user-friendly design to deliver 
            the ultimate Linux experience for developers and power users.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`px-6 py-3 bg-gradient-to-r ${category.color} rounded-full text-white font-semibold text-sm cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg`}
            >
              {category.name}
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, rotateY: -10 }}
              animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                z: 50
              }}
              className="group relative p-8 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl border border-purple-400/30 hover:border-purple-400/60 transition-all duration-500 shadow-2xl hover:shadow-purple-500/20"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* 3D Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-2xl transform group-hover:scale-105 transition-transform duration-500" />
              
              {/* Icon */}
              <motion.div
                className="text-purple-400 mb-6 relative z-10"
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6 }}
              >
                {feature.icon}
              </motion.div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-heading font-semibold mb-4 text-white group-hover:text-purple-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 font-body leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-20"
        >
          <div className="p-12 bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-3xl border border-purple-400/30 max-w-4xl mx-auto">
            <h2 className="text-4xl font-heading font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ready to Experience HENU OS?
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-body">
              Download now and join thousands of developers who have made the switch.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full transition-all duration-300 shadow-2xl"
            >
              Download ISO
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;