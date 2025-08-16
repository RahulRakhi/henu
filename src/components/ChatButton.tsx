import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Logo from './Logo';

interface ChatButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ChatButton: React.FC<ChatButtonProps> = ({ isOpen, onToggle }) => {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-40 flex items-center justify-center"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <div className="w-7 h-7">
            <Logo size="sm" showText={false} />
          </div>
        )}
      </motion.div>
    </motion.button>
  );
};

export default ChatButton; 