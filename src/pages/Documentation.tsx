import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Book, 
  Download, 
  Monitor, 
  HardDrive, 
  Settings, 
  Terminal, 
  Bug, 
  ChevronRight,
  ExternalLink,
  FileText,
  Play,
  CheckCircle
} from 'lucide-react';

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('installation');

  const sidebarItems = [
    {
      id: 'installation',
      title: 'Installation Guide',
      icon: <Download className="w-5 h-5" />,
      subsections: ['USB Creation', 'Dual Boot Setup', 'Full Installation']
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Play className="w-5 h-5" />,
      subsections: ['First Boot', 'Initial Setup', 'Desktop Tour']
    },
    {
      id: 'features',
      title: 'Feature Guide',
      icon: <Settings className="w-5 h-5" />,
      subsections: ['Voice Commands', 'Multi-Language', 'Developer Tools']
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: <Bug className="w-5 h-5" />,
      subsections: ['Common Issues', 'Hardware Problems', 'Bug Reporting']
    },
    {
      id: 'advanced',
      title: 'Advanced Usage',
      icon: <Terminal className="w-5 h-5" />,
      subsections: ['Terminal Customization', 'System Tweaks', 'Development Setup']
    }
  ];

  const installationSteps = [
    {
      title: 'Download HENU OS ISO',
      description: 'Get the latest stable release from our download page',
      icon: <Download className="w-6 h-6" />
    },
    {
      title: 'Create Bootable USB',
      description: 'Use Rufus (Windows) or Etcher (Linux/Mac) to create installation media',
      icon: <HardDrive className="w-6 h-6" />
    },
    {
      title: 'Boot from USB',
      description: 'Configure BIOS/UEFI to boot from USB and start installation',
      icon: <Monitor className="w-6 h-6" />
    },
    {
      title: 'Run Installer',
      description: 'Follow the guided installation process with automatic partitioning',
      icon: <Settings className="w-6 h-6" />
    }
  ];

  const systemRequirements = {
    minimum: {
      cpu: '64-bit processor (x86_64)',
      ram: '2 GB RAM',
      storage: '20 GB free space',
      graphics: 'Integrated graphics or better'
    },
    recommended: {
      cpu: 'Multi-core 64-bit processor',
      ram: '4 GB RAM or more',
      storage: '50 GB SSD storage',
      graphics: 'Dedicated graphics card'
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'installation':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-heading font-bold text-white mb-6">
                Installation Guide
              </h2>
              <p className="text-gray-300 font-body text-lg leading-relaxed mb-8">
                Follow this comprehensive guide to install HENU OS on your system. 
                The process is designed to be simple and user-friendly.
              </p>
            </div>

            {/* System Requirements */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl border border-purple-400/30">
                <h3 className="text-xl font-heading font-semibold text-white mb-4">
                  Minimum Requirements
                </h3>
                <ul className="space-y-2 text-gray-300 font-body">
                  <li>• {systemRequirements.minimum.cpu}</li>
                  <li>• {systemRequirements.minimum.ram}</li>
                  <li>• {systemRequirements.minimum.storage}</li>
                  <li>• {systemRequirements.minimum.graphics}</li>
                </ul>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl border border-purple-400/30">
                <h3 className="text-xl font-heading font-semibold text-white mb-4">
                  Recommended
                </h3>
                <ul className="space-y-2 text-gray-300 font-body">
                  <li>• {systemRequirements.recommended.cpu}</li>
                  <li>• {systemRequirements.recommended.ram}</li>
                  <li>• {systemRequirements.recommended.storage}</li>
                  <li>• {systemRequirements.recommended.graphics}</li>
                </ul>
              </div>
            </div>

            {/* Installation Steps */}
            <div>
              <h3 className="text-2xl font-heading font-semibold text-white mb-6">
                Installation Steps
              </h3>
              <div className="space-y-4">
                {installationSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-6 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl border border-purple-400/30"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="text-purple-400">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-heading font-semibold text-white">
                        {step.title}
                      </h4>
                      <p className="text-gray-300 font-body">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* USB Creation Guide */}
            <div className="p-8 bg-gradient-to-br from-gray-900/30 to-black/30 backdrop-blur-sm rounded-2xl border border-purple-400/30">
              <h3 className="text-2xl font-heading font-semibold text-white mb-6">
                Creating Bootable USB
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-heading font-semibold text-purple-400 mb-4">
                    Windows (Rufus)
                  </h4>
                  <ol className="space-y-2 text-gray-300 font-body">
                    <li>1. Download Rufus from rufus.ie</li>
                    <li>2. Insert USB drive (8GB+)</li>
                    <li>3. Select HENU OS ISO file</li>
                    <li>4. Choose GPT partition scheme</li>
                    <li>5. Click START to create bootable USB</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="text-lg font-heading font-semibold text-purple-400 mb-4">
                    Linux/Mac (Etcher)
                  </h4>
                  <ol className="space-y-2 text-gray-300 font-body">
                    <li>1. Download Etcher from balena.io/etcher</li>
                    <li>2. Insert USB drive (8GB+)</li>
                    <li>3. Select HENU OS ISO file</li>
                    <li>4. Select target USB drive</li>
                    <li>5. Click Flash to create bootable USB</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Dual Boot Setup */}
            <div className="p-8 bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-sm rounded-2xl border border-orange-400/30">
              <h3 className="text-2xl font-heading font-semibold text-white mb-6">
                Dual Boot Setup
              </h3>
              <div className="space-y-4 text-gray-300 font-body">
                <p>
                  <strong className="text-orange-400">⚠️ Important:</strong> Always backup your data before proceeding with dual boot setup.
                </p>
                <div className="space-y-2">
                  <p><strong>1. Shrink existing partition:</strong> Use Disk Management (Windows) or GParted (Linux)</p>
                  <p><strong>2. Create free space:</strong> At least 20GB for HENU OS installation</p>
                  <p><strong>3. Boot from USB:</strong> Start HENU OS installer</p>
                  <p><strong>4. Choose custom installation:</strong> Select the free space for installation</p>
                  <p><strong>5. Install GRUB:</strong> The installer will configure dual boot automatically</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'getting-started':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-heading font-bold text-white mb-6">
                Getting Started
              </h2>
              <p className="text-gray-300 font-body text-lg leading-relaxed mb-8">
                Welcome to HENU OS! This guide will help you get familiar with the system and its unique features.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl border border-purple-400/30">
                <CheckCircle className="w-8 h-8 text-green-400 mb-4" />
                <h3 className="text-lg font-heading font-semibold text-white mb-3">
                  First Boot
                </h3>
                <p className="text-gray-300 font-body text-sm">
                  Set up your user account, configure basic settings, and explore the desktop environment.
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl border border-purple-400/30">
                <Settings className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-lg font-heading font-semibold text-white mb-3">
                  Voice Setup
                </h3>
                <p className="text-gray-300 font-body text-sm">
                  Configure voice recognition, test microphone, and learn basic voice commands.
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl border border-purple-400/30">
                <Terminal className="w-8 h-8 text-orange-400 mb-4" />
                <h3 className="text-lg font-heading font-semibold text-white mb-3">
                  Developer Tools
                </h3>
                <p className="text-gray-300 font-body text-sm">
                  Explore pre-installed development tools and set up your coding environment.
                </p>
              </div>
            </div>
          </div>
        );

      case 'troubleshooting':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-heading font-bold text-white mb-6">
                Troubleshooting
              </h2>
              <p className="text-gray-300 font-body text-lg leading-relaxed mb-8">
                Common issues and their solutions. If you need additional help, visit our community forums.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl border border-purple-400/30">
                <h3 className="text-xl font-heading font-semibold text-white mb-4">
                  Boot Issues
                </h3>
                <div className="space-y-3 text-gray-300 font-body">
                  <p><strong>Problem:</strong> System won't boot after installation</p>
                  <p><strong>Solution:</strong> Check BIOS/UEFI boot order, ensure Secure Boot is disabled</p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl border border-purple-400/30">
                <h3 className="text-xl font-heading font-semibold text-white mb-4">
                  Voice Recognition Not Working
                </h3>
                <div className="space-y-3 text-gray-300 font-body">
                  <p><strong>Problem:</strong> Voice commands not recognized</p>
                  <p><strong>Solution:</strong> Check microphone permissions, recalibrate voice settings</p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl border border-purple-400/30">
                <h3 className="text-xl font-heading font-semibold text-white mb-4">
                  Hardware Compatibility
                </h3>
                <div className="space-y-3 text-gray-300 font-body">
                  <p><strong>Problem:</strong> Hardware not detected properly</p>
                  <p><strong>Solution:</strong> Check hardware compatibility list, install additional drivers</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-red-900/20 to-pink-900/20 backdrop-blur-sm rounded-2xl border border-red-400/30">
              <h3 className="text-2xl font-heading font-semibold text-white mb-6">
                Bug Reporting
              </h3>
              <p className="text-gray-300 font-body mb-6">
                Found a bug? Help us improve HENU OS by reporting it through our community channels.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-full font-semibold flex items-center justify-center space-x-2"
                >
                  <Bug size={20} />
                  <span>Report Bug</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-3 border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-black rounded-full font-semibold flex items-center justify-center space-x-2 transition-all duration-300"
                >
                  <ExternalLink size={20} />
                  <span>View Known Issues</span>
                </motion.button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
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
            Documentation
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-body leading-relaxed">
            Complete guide to installing, configuring, and using HENU OS. 
            Everything you need to get started with voice-powered Linux.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-80 flex-shrink-0"
          >
            <div className="sticky top-32">
              <div className="p-6 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl border border-purple-400/30">
                <h3 className="text-lg font-heading font-semibold text-white mb-6 flex items-center space-x-2">
                  <Book className="w-5 h-5 text-purple-400" />
                  <span>Table of Contents</span>
                </h3>
                
                <nav className="space-y-2">
                  {sidebarItems.map((item) => (
                    <div key={item.id}>
                      <button
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                          activeSection === item.id
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                        }`}
                      >
                        <div className={`${activeSection === item.id ? 'text-white' : 'text-purple-400'}`}>
                          {item.icon}
                        </div>
                        <span className="font-body font-medium">{item.title}</span>
                        <ChevronRight 
                          className={`w-4 h-4 ml-auto transition-transform duration-200 ${
                            activeSection === item.id ? 'rotate-90' : ''
                          }`} 
                        />
                      </button>
                      
                      {activeSection === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="ml-6 mt-2 space-y-1"
                        >
                          {item.subsections.map((subsection, index) => (
                            <a
                              key={index}
                              href={`#${subsection.toLowerCase().replace(/\s+/g, '-')}`}
                              className="block px-4 py-2 text-sm text-gray-400 hover:text-purple-400 transition-colors duration-200"
                            >
                              {subsection}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Quick Links */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <h4 className="text-sm font-heading font-semibold text-gray-400 mb-4 uppercase tracking-wide">
                    Quick Links
                  </h4>
                  <div className="space-y-2">
                    <a
                      href="/download"
                      className="flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-colors duration-200"
                    >
                      <Download size={16} />
                      <span className="font-body text-sm">Download ISO</span>
                    </a>
                    <a
                      href="/community"
                      className="flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-colors duration-200"
                    >
                      <ExternalLink size={16} />
                      <span className="font-body text-sm">Get Help</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-colors duration-200"
                    >
                      <FileText size={16} />
                      <span className="font-body text-sm">PDF Guide</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1"
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;