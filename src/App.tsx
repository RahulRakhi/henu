import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Features from './pages/Features';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import Store from './pages/Store';
import Community from './pages/Community';
import Documentation from './pages/Documentation';
import Download from './pages/Download';
import Team from './pages/Team';
import Admin from './pages/Admin';
import Chatbot from './components/Chatbot';
import ChatButton from './components/ChatButton';
import ParticleBackground from './components/ParticleBackground';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-x-hidden relative">
          {/* Animated Particle Background (z-[-1]) */}
          <div className="fixed inset-0 z-[-1] pointer-events-none">
            <ParticleBackground />
          </div>

          <Navbar />
          
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="pt-20"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/store" element={<Store />} />
              <Route path="/community" element={<Community />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/download" element={<Download />} />
              <Route path="/team" element={<Team />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </motion.main>

          <ChatButton isOpen={isChatOpen} onToggle={toggleChat} />
          <Chatbot isOpen={isChatOpen} onToggle={toggleChat} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;