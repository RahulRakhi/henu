import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-heading font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                HENU hai tho
              </span>
              <br />
              <span className="text-white">ky fikr hai......</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto font-body leading-relaxed">
              Experience the future of Linux with voice-powered commands, 
              multi-language support, and developer-focused tools. 
              Built for creators, by creators.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link
              to="/download"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-2"
            >
              <span className="mr-2">⬇️</span>
              <span>Download ISO</span>
            </Link>
            
            <Link
              to="/documentation"
              className="px-8 py-4 border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black font-semibold rounded-full transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <span className="mr-2">📄</span>
              <span>View Documentation</span>
            </Link>
            <a
              href="https://youtu.be/-NYIYiMqb54"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black font-semibold rounded-full transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <span className="mr-2">📄</span>
              <span>Research Paper</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30">
              <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center mb-6 overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/CTGvHiQyfwg?autoplay=1&mute=1&rel=0&showinfo=0&controls=1"
                  title="Intro video"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="w-full h-full rounded-lg border-none"
                  style={{ minHeight: 300 }}
                ></iframe>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="flex items-center space-x-3">
                  <span className="mr-2">🎤</span>
                  <span className="font-body">Voice Commands</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="mr-2">🌐</span>
                  <span className="font-body">Multi-Language</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="mr-2">🛠️</span>
                  <span className="font-body">Developer Tools</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-orange-600/10 to-purple-600/10 rounded-full blur-3xl"
          />
        </div>
      </section>

      {/* Quick Features Preview */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Why Choose HENU OS?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-body">
              Revolutionary features designed for the modern developer workflow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <span className="mr-2">🎤</span>,
                title: "Voice Control",
                description: "Execute commands, navigate files, and control your system using natural voice commands in multiple languages."
              },
              {
                icon: <span className="mr-2">🛠️</span>,
                title: "Developer Ready",
                description: "Pre-installed with all major development tools, IDEs, and frameworks. Start coding immediately."
              },
              {
                icon: <span className="mr-2">🌐</span>,
                title: "Multi-Language",
                description: "Full support for Hindi, English, and other regional languages in both UI and voice commands."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-xl border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-purple-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-heading font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-300 font-body">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;