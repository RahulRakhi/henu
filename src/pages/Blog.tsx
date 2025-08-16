import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, ArrowRight, Search, Filter } from 'lucide-react';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts = [
    {
      id: 1,
      title: "HENU OS 2.0 Release - Voice Commands Revolution",
      excerpt: "Introducing groundbreaking voice command features that will change how you interact with your Linux system.",
      content: "Full content here...",
      author: "HENU Team",
      date: "2024-01-15",
      category: "release",
      tags: ["release", "voice", "features"],
      image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800",
      featured: true
    },
    {
      id: 2,
      title: "Setting Up Development Environment in HENU OS",
      excerpt: "Complete guide to setting up your perfect development environment with pre-installed tools and configurations.",
      content: "Full content here...",
      author: "Dev Community",
      date: "2024-01-10",
      category: "tutorial",
      tags: ["tutorial", "development", "setup"],
      image: "https://images.pexels.com/photos/270366/pexels-photo-270366.jpeg?auto=compress&cs=tinysrgb&w=800",
      featured: false
    },
    {
      id: 3,
      title: "Multi-Language Support: Hindi Commands Tutorial",
      excerpt: "Learn how to use voice commands in Hindi and configure regional language settings.",
      content: "Full content here...",
      author: "Community Contributor",
      date: "2024-01-08",
      category: "tutorial",
      tags: ["tutorial", "hindi", "voice", "language"],
      image: "https://images.pexels.com/photos/3913025/pexels-photo-3913025.jpeg?auto=compress&cs=tinysrgb&w=800",
      featured: false
    },
    {
      id: 4,
      title: "Performance Benchmarks: HENU OS vs Other Distros",
      excerpt: "Detailed performance analysis comparing HENU OS with popular Linux distributions.",
      content: "Full content here...",
      author: "Tech Analysis Team",
      date: "2024-01-05",
      category: "analysis",
      tags: ["performance", "benchmarks", "comparison"],
      image: "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800",
      featured: false
    },
    {
      id: 5,
      title: "Community Spotlight: Amazing Projects Built on HENU",
      excerpt: "Showcasing incredible projects and applications built by our amazing community members.",
      content: "Full content here...",
      author: "Community Team",
      date: "2024-01-01",
      category: "community",
      tags: ["community", "projects", "showcase"],
      image: "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=800",
      featured: false
    },
    {
      id: 6,
      title: "Security Best Practices for HENU OS Users",
      excerpt: "Essential security tips and configurations to keep your HENU OS installation secure.",
      content: "Full content here...",
      author: "Security Team",
      date: "2023-12-28",
      category: "security",
      tags: ["security", "tips", "configuration"],
      image: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800",
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Posts', count: blogPosts.length },
    { id: 'release', name: 'Releases', count: blogPosts.filter(p => p.category === 'release').length },
    { id: 'tutorial', name: 'Tutorials', count: blogPosts.filter(p => p.category === 'tutorial').length },
    { id: 'analysis', name: 'Analysis', count: blogPosts.filter(p => p.category === 'analysis').length },
    { id: 'community', name: 'Community', count: blogPosts.filter(p => p.category === 'community').length },
    { id: 'security', name: 'Security', count: blogPosts.filter(p => p.category === 'security').length }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

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
            Blog
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-body leading-relaxed">
            Latest updates, tutorials, and insights from the HENU OS community and development team.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors duration-300"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-800/50 border border-gray-600 rounded-full px-4 py-2 text-white focus:outline-none focus:border-purple-400 transition-colors duration-300"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-16"
          >
            <div className="relative bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-3xl overflow-hidden border border-purple-400/30 shadow-2xl">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8 md:p-12">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-full">
                      Featured
                    </span>
                    <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full capitalize">
                      {featuredPost.category}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                    {featuredPost.title}
                  </h2>
                  
                  <p className="text-gray-300 font-body text-lg mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 text-gray-400 text-sm">
                      <div className="flex items-center space-x-1">
                        <User size={16} />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold flex items-center space-x-2 transition-all duration-300"
                  >
                    <span>Read More</span>
                    <ArrowRight size={16} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Posts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {regularPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-400/30 hover:border-purple-400/60 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20"
            >
              {/* Image */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category and Date */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full capitalize">
                    {post.category}
                  </span>
                  <div className="flex items-center space-x-1 text-gray-400 text-sm">
                    <Calendar size={14} />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-heading font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-300 font-body mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full flex items-center space-x-1"
                    >
                      <Tag size={10} />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>

                {/* Author and Read More */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-gray-400 text-sm">
                    <User size={14} />
                    <span>{post.author}</span>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="text-purple-400 hover:text-purple-300 font-semibold text-sm flex items-center space-x-1 transition-colors duration-300"
                  >
                    <span>Read More</span>
                    <ArrowRight size={14} />
                  </motion.button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-2xl text-gray-400 font-body">
              No posts found matching your criteria.
            </p>
          </motion.div>
        )}

        {/* Load More Button */}
        {regularPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full transition-all duration-300 shadow-2xl"
            >
              Load More Posts
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Blog;