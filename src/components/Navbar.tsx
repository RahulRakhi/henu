import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import Logo from './Logo';

// EyeLogo: Animated logo that follows mouse direction
const EyeLogo: React.FC = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = ((e.clientY - innerHeight / 2) / innerHeight) * 30;
      const y = ((e.clientX - innerWidth / 2) / innerWidth) * 30;
      setRotation({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return (
    <motion.div
      animate={{ rotateX: rotation.x, rotateY: rotation.y }}
      transition={{ type: 'spring', stiffness: 80, damping: 15 }}
      style={{ perspective: 800 }}
      className="flex items-center justify-center"
    >
      <Logo size="md" showText={false} />
    </motion.div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'Store', path: '/store' },
    { name: 'Community', path: '/community' },
    { name: 'Team', path: '/team' },
    { name: 'Docs', path: '/documentation' },
    { name: 'Download', path: '/download' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Only EyeLogo (animated logo) */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <EyeLogo />
            <span className="text-2xl font-heading font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent ml-2">HENU OS</span>
          </Link>
        </div>
        {/* Center/Right: Navigation and Auth */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-body relative transition-colors duration-200 hover:text-purple-400 ${
                  location.pathname === item.path
                    ? 'text-purple-400 drop-shadow-[0_4px_16px_rgba(168,85,247,0.7)] scale-110 font-bold'
                    : 'text-gray-300'
                }`}
                style={location.pathname === item.path ? { perspective: 400, transform: 'translateZ(8px) rotateX(6deg)' } : {}}
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-400"
                  />
                )}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4 ml-8">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-300">{user.email}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-300 hover:text-purple-400 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Mobile Navigation Menu */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="md:hidden overflow-hidden bg-black/90 backdrop-blur-md mt-4 rounded-lg"
      >
        <div className="py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 font-body transition-colors duration-200 hover:text-purple-400 ${
                location.pathname === item.path ? 'text-purple-400 bg-purple-400/10 drop-shadow-[0_4px_16px_rgba(168,85,247,0.7)] scale-110 font-bold' : 'text-gray-300'
              }`}
              style={location.pathname === item.path ? { perspective: 400, transform: 'translateZ(8px) rotateX(6deg)' } : {}}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </motion.div>
      {showLogin && (
        <Login onClose={() => setShowLogin(false)} />
      )}
    </motion.nav>
  );
};

export default Navbar;