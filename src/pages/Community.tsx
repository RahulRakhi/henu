import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ref as dbRef, set } from 'firebase/database';
import { 
  Mail, 
  Github, 
  MessageCircle, 
  Send, 
  Users, 
  Upload,
  ExternalLink,
  Star,
  MessageSquare,
  Heart
} from 'lucide-react';

const Community = () => {
  const [feedbackForm, setFeedbackForm] = useState({
    type: 'bug',
    email: '',
    subject: '',
    message: '',
    file: null as File | null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const communityStats = [
    { label: 'Active Members', value: '15,000+', icon: <Users className="w-6 h-6" /> },
    { label: 'GitHub Stars', value: '2,500+', icon: <Star className="w-6 h-6" /> },
    { label: 'Discord Members', value: '8,000+', icon: <MessageCircle className="w-6 h-6" /> },
    { label: 'Contributors', value: '150+', icon: <Heart className="w-6 h-6" /> }
  ];

  const communityLinks = [
    {
      name: 'GitHub',
      description: 'Source code, issues, and contributions',
      icon: <Github className="w-8 h-8" />,
      url: 'https://github.com/henu-os',
      color: 'from-gray-600 to-gray-800',
      members: '2.5K+ Stars'
    },
    {
      name: 'Discord',
      description: 'Real-time chat and community support',
      icon: <MessageCircle className="w-8 h-8" />,
      url: 'https://discord.gg/henu-os',
      color: 'from-indigo-600 to-purple-600',
      members: '8K+ Members'
    },
    {
      name: 'Telegram',
      description: 'News, updates, and discussions',
      icon: <Send className="w-8 h-8" />,
      url: 'https://t.me/henu_os',
      color: 'from-blue-600 to-cyan-600',
      members: '3K+ Subscribers'
    },
    {
      name: 'Email',
      description: 'Direct contact for important matters',
      icon: <Mail className="w-8 h-8" />,
      url: 'mailto:contact@henu-os.org',
      color: 'from-orange-600 to-red-600',
      members: 'Official Support'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFeedbackForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFeedbackForm(prev => ({ ...prev, file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // Prepare feedback data
      const feedbackData = {
        type: feedbackForm.type,
        email: feedbackForm.email,
        subject: feedbackForm.subject,
        message: feedbackForm.message,
        fileName: feedbackForm.file ? feedbackForm.file.name : null,
        fileSize: feedbackForm.file ? feedbackForm.file.size : null,
        fileType: feedbackForm.file ? feedbackForm.file.type : null,
        submittedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      };
      
      // Save to Firebase Realtime Database
      const { getDatabase } = await import('firebase/database');
      const db = getDatabase();
      const newFeedbackRef = dbRef(db, 'community_feedback/' + Date.now());
      await set(newFeedbackRef, feedbackData);
      
      console.log('✅ Feedback saved to Firebase Realtime Database:', feedbackData);
      
      // Show success message
      setSubmitStatus('success');
      setSubmitMessage('Thank you! Your feedback has been submitted successfully.');
      
      // Reset form
      setFeedbackForm({
        type: 'bug',
        email: '',
        subject: '',
        message: '',
        file: null
      });
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error: any) {
      console.error('❌ Error saving feedback:', error);
      setSubmitStatus('error');
      setSubmitMessage('There was an error submitting your feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
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
            Community
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-body leading-relaxed">
            Join the HENU OS community. Connect with developers, contribute to the project, 
            and help shape the future of voice-powered Linux.
          </p>
        </motion.div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-16"
        >
          {communityStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center p-6 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl border border-purple-400/30"
            >
              <div className="text-purple-400 mb-3 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-3xl font-heading font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-gray-300 font-body text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Community Links */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-3xl font-heading font-bold text-white mb-8">
              Connect With Us
            </h2>
            
            <div className="space-y-6">
              {communityLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group block p-6 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl border border-purple-400/30 hover:border-purple-400/60 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 bg-gradient-to-br ${link.color} rounded-xl text-white group-hover:scale-110 transition-transform duration-300`}>
                      {link.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-heading font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">
                          {link.name}
                        </h3>
                        <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-300" />
                      </div>
                      <p className="text-gray-300 font-body mb-2">
                        {link.description}
                      </p>
                      <span className="text-purple-400 text-sm font-semibold">
                        {link.members}
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl font-heading font-bold text-white mb-8">
              Send Feedback
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="p-8 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl border border-purple-400/30">
                {/* Feedback Type */}
                <div className="mb-6">
                  <label className="block text-gray-300 font-body mb-3">
                    Feedback Type
                  </label>
                  <select
                    name="type"
                    value={feedbackForm.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-purple-400 transition-colors duration-300"
                  >
                    <option value="bug">Bug Report</option>
                    <option value="suggestion">Feature Suggestion</option>
                    <option value="query">General Query</option>
                    <option value="contribution">Contribution</option>
                  </select>
                </div>

                {/* Email */}
                <div className="mb-6">
                  <label className="block text-gray-300 font-body mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={feedbackForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors duration-300"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Subject */}
                <div className="mb-6">
                  <label className="block text-gray-300 font-body mb-3">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={feedbackForm.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors duration-300"
                    placeholder="Brief description of your feedback"
                  />
                </div>

                {/* Message */}
                <div className="mb-6">
                  <label className="block text-gray-300 font-body mb-3">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={feedbackForm.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors duration-300 resize-vertical"
                    placeholder="Detailed description of your feedback..."
                  />
                </div>

                {/* File Upload */}
                <div className="mb-8">
                  <label className="block text-gray-300 font-body mb-3">
                    Attach File (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.gif,.pdf,.txt,.log"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center justify-center w-full px-4 py-8 bg-gray-800/30 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-purple-400 transition-colors duration-300"
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                        <span className="text-gray-300 font-body">
                          {feedbackForm.file ? feedbackForm.file.name : 'Click to upload file'}
                        </span>
                        <p className="text-gray-500 text-sm mt-1">
                          PNG, JPG, PDF, TXT, LOG up to 10MB
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare size={20} />
                      <span>Send Feedback</span>
                    </>
                  )}
                </motion.button>
                
                {/* Status Message */}
                {submitStatus !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-4 rounded-xl text-center ${
                      submitStatus === 'success' 
                        ? 'bg-green-900/30 border border-green-400/50 text-green-300' 
                        : 'bg-red-900/30 border border-red-400/50 text-red-300'
                    }`}
                  >
                    {submitMessage}
                  </motion.div>
                )}
              </div>
            </form>
          </motion.div>
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
              Ready to Contribute?
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-body">
              Join our community of developers and help make HENU OS even better.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="https://github.com/henu-os"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold flex items-center justify-center space-x-2 transition-all duration-300"
              >
                <Github size={20} />
                <span>View on GitHub</span>
              </motion.a>
              <motion.a
                href="https://discord.gg/henu-os"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="px-8 py-3 border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black rounded-full font-semibold flex items-center justify-center space-x-2 transition-all duration-300"
              >
                <MessageCircle size={20} />
                <span>Join Discord</span>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Community;