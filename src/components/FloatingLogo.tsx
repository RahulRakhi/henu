import React from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';

const FloatingLogo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
    >
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotateY: [0, 5, 0],
          rotateX: [0, 5, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative"
      >
        <div className="relative p-6 bg-gradient-to-br from-purple-600/30 via-pink-600/25 to-cyan-600/20 backdrop-blur-md rounded-3xl border border-purple-400/40 shadow-2xl">
          <Logo size="lg" showText={false} />
          
          {/* Enhanced 3D glow effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/15 to-cyan-600/10 rounded-3xl blur-xl scale-110 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/10 via-transparent to-pink-400/10 rounded-3xl blur-lg scale-105" />
          
          {/* Shimmer effect using CSS class */}
          <div className="absolute inset-0 rounded-3xl opacity-30 logo-shimmer" />
        </div>
        
        {/* Floating particles */}
        <motion.div
          className="absolute -top-4 -left-4 w-3 h-3 bg-purple-400 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
            y: [0, -10, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 0
          }}
        />
        <motion.div
          className="absolute -bottom-4 -right-4 w-2 h-2 bg-pink-400 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
            y: [0, 8, 0]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: 1
          }}
        />
        <motion.div
          className="absolute -top-6 right-2 w-1.5 h-1.5 bg-cyan-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
            x: [0, 5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.5
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default FloatingLogo;