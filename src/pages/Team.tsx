
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {ref as dbRef, set} from 'firebase/database';
// import emailjs from '@emailjs/browser';
import { CheckCircle } from 'lucide-react';

// TypeScript types for form state
interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  skills: string[];
  photo: File | null;
  resume: File | null;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  skills?: string;
  photo?: string;
  resume?: string;
}

const Team = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    skills: [],
    photo: null,
    resume: null
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const availableSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'Go',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Linux', 'DevOps', 'AI/ML', 'Data Science',
    'Cybersecurity', 'Flutter', 'React Native', 'Vue.js', 'Angular', 'MongoDB', 'PostgreSQL',
    'Redis', 'GraphQL', 'REST APIs', 'Microservices', 'Blockchain', 'UI/UX Design'
  ];

  const teamMembers = [
    {
      name: 'Siddharth Singh',
      title: 'Founder & CEO of Henu',
      photo: '/sidd.jpeg',
      bio: [
        "👋 Hey, I'm Siddharth Singh",
        "Founder & CEO of Henu | OS Architect | Former Tech Lead | Linux Kernel Contributor | NLP & AI Innovator",
        "",
        "I'm passionate about designing operating systems, building intelligent architectures, and redefining the way technology scales. My journey blends deep technical mastery with creativity and exploration — both in tech and life. 🌍",
        "",
        "✈️ When I'm not architecting systems, I love uncovering hidden gems while traveling across India, fueled by curiosity and a relentless drive to discover the extraordinary.",
        "",
        "**My Journey in Numbers**",
        "🏆 100+ projects built across diverse technologies.",
        "🛠 Expertise in Linux, Machine Learning, Databases, OOP, Full Stack Development, Cloud Computing, DevOps, and Networking.",
        "🌐 A multidisciplinary skillset bridging software engineering, system administration, and AI-driven automation.",
        "",
        "**What I Do**",
        "- Fortify digital ecosystems with advanced security practices",
        "- Craft foundations of next-gen computing",
        "- Build intelligent, scalable AI-driven solutions",
        "- Engineer modern high-performance applications",
        "",
        "💬 Motto: \"Root Access to Innovation.\""
      ],
      links: [
        { icon: () => <span>🌐</span>, label: 'Website', url: 'https://siddsingh.mystrikingly.com/' },
        { icon: () => <span>🐱</span>, label: 'GitHub', url: 'https://github.com/sidd2005singh' },
        { icon: () => <span>💼</span>, label: 'LinkedIn', url: 'https://www.linkedin.com/in/siddharth-singh-7a2b7a240/' },
        { icon: () => <span>📸</span>, label: 'Instagram', url: 'https://www.instagram.com/sidd___009_/' },
        { icon: () => <span>🐦</span>, label: 'Twitter', url: 'https://x.com/Sidd935' },
        { icon: () => <span>📘</span>, label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=100089825111015' }
      ]
    },
    {
      name: 'Rahul',
      title: 'Co-Founder of Henu',
      photo: '/rahul.jpeg',
      bio: [
        "👋 Hi, I'm Rahul",
        "Co-Founder of Henu | AI & Voice Recognition | Source Development | Developer | UI/UX Enthusiast",
        "",
        "I'm passionate about turning bold ideas into powerful digital experiences. 🚀",
        "",
        "From crafting beautiful, interactive UIs to building scalable full-stack solutions, I thrive at the crossroads of design, development, and innovation — turning complex problems into elegant solutions.",
        "",
        "🔐 With strong expertise in Flutter app development, cybersecurity practices, DevOps, and cloud infrastructure, I bridge the gap between seamless user experiences and rock-solid backend systems that deliver performance, security, and reliability.",
        "",
        "With expertise in Flutter, DevOps, cybersecurity, and scalable backend systems, I bridge seamless UX with solid architecture.",
        "",
        "**Achievements**:",
        "- 50+ real-world apps built",
        "- Contributor to multiple open-source projects",
        "- Special interest in AI, automation, and full-stack systems",
        "",
        "💬 \"I don't just build software — I craft solutions that inspire, scale, and create impact.\""
      ],
      links: [
        { icon: () => <span>💼</span>, label: 'LinkedIn', url: 'https://www.linkedin.com/in/rahul-sain-88a963288/' },
        { icon: () => <span>🐱</span>, label: 'GitHub', url: 'https://github.com/RahulRakhi' },
        { icon: () => <span>🌐</span>, label: 'Portfolio', url: 'https://myportpholiyo.netlify.app/' }
      ]
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'resume') => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [type]: 'File size must be less than 5MB'
        }));
        return;
      }
      // Check file type
      const allowedTypes = type === 'photo'
        ? ['image/jpeg', 'image/png']
        : ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [type]: type === 'photo' ? 'Only JPG and PNG files are allowed' : 'Only PDF and DOCX files are allowed'
        }));
        return;
      }
      setFormData(prev => ({
        ...prev,
        [type]: file
      }));
      if (errors[type]) {
        setErrors(prev => ({
          ...prev,
          [type]: ''
        }));
      }
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => {
      const currentSkills = prev.skills;
      const isSelected = currentSkills.includes(skill);
      if (isSelected) {
        return {
          ...prev,
          skills: currentSkills.filter(s => s !== skill)
        };
      } else {
        if (currentSkills.length >= 14) {
          setErrors(prev => ({
            ...prev,
            skills: 'Maximum 14 skills allowed'
          }));
          return prev;
        }
        return {
          ...prev,
          skills: [...currentSkills, skill]
        };
      }
    });
    if (errors.skills) {
      setErrors(prev => ({
        ...prev,
        skills: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (formData.skills.length < 7) newErrors.skills = 'Minimum 7 skills required';
    if (formData.skills.length > 14) newErrors.skills = 'Maximum 14 skills allowed';
    // if (!formData.photo) newErrors.photo = 'Photo is required';
    // if (!formData.resume) newErrors.resume = 'Resume is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setLoadingMessage('Saving application...');
    try {
      // File uploads removed - just save file names
      const photoURL = formData.photo ? formData.photo.name : '';
      const resumeURL = formData.resume ? formData.resume.name : '';
      const applicationData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        skills: formData.skills,
        photoURL,
        resumeURL,
        submittedAt: new Date().toISOString(),
      };
      console.log("this is the application data", applicationData);
      
      // Save to Firebase Realtime Database
      const { getDatabase } = await import('firebase/database');
      const db = getDatabase();
      const newApplicationRef = dbRef(db, 'team_applications/' + Date.now());
      await set(newApplicationRef, applicationData);
      console.log("✅ Application saved to Firebase Realtime Database");
      
      setShowSuccess(true);
      setLoadingMessage(null);
      // setLoadingMessage('Sending confirmation email...');
      // EmailJS logic
      
    //   emailjs.init('T_jMpvjRH7KcQH5Mj');
    //   const templateParams = {
    //     to_email: 'henuosr@gmail.com',
    //     from_name: formData.name,
    //     from_email: formData.email,
    //     phone: formData.phone,
    //     address: formData.address,
    //     skills: formData.skills.join(', '),
    //     photo_name: formData.photo ? formData.photo.name : 'No photo uploaded',
    //     resume_name: formData.resume ? formData.resume.name : 'No resume uploaded',
    //     message: `\nNew Job Application for HENU OS Team\n\nApplicant Details:\n- Name: ${formData.name}\n- Email: ${formData.email}\n- Phone: ${formData.phone}\n- Address: ${formData.address}\n\nSkills: ${formData.skills.join(', ')}\n\nFiles:\n- Photo: ${formData.photo ? formData.photo.name : 'Not provided'}\n- Resume: ${formData.resume ? formData.resume.name : 'Not provided'}\n\nApplication submitted on: ${new Date().toLocaleString()}\n        `,
    //     reply_to: formData.email
    //   };

    //   await emailjs.send('service_zmgef0r', 'template_ac7q9qj', templateParams);
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        skills: [],
        photo: null,
        resume: null
      });
      // Reset file inputs
      const photoInput = document.getElementById('photo') as HTMLInputElement | null;
      const resumeInput = document.getElementById('resume') as HTMLInputElement | null;
      if (photoInput) photoInput.value = '';
      if (resumeInput) resumeInput.value = '';
    } catch (error) {
      setLoadingMessage(null);
      console.error('Error sending email:', error);
      alert('❌ There was an error submitting your application. Please try again or contact us directly at henuosr@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-gradient-to-br from-black via-gray-900 to-purple-900">
      {/* Loading Spinner/Message */}
      {loadingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-lg font-semibold text-gray-800 mb-2">{loadingMessage}</div>
          </div>
        </div>
      )}
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Details sent successfully!</h2>
            <p className="text-gray-600 mb-6">Your application has been submitted. We'll review your details and get back to you soon.</p>
            <button
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              onClick={() => setShowSuccess(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Meet the Minds Behind HENU OS
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The visionary team crafting the future of voice-powered Linux computing
          </p>
          
          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a
              href="https://henuos.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              <span>🌐</span>
              <span>Main Website</span>
              <span>🔗</span>
            </a>
            <a
              href="https://siddsingh.mystrikingly.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black rounded-full font-semibold transition-all duration-300"
            >
              <span>🔗</span>
              <span>Support</span>
            </a>
          </div>
        </motion.div>

        {/* Team Members */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-3xl border border-purple-400/30 p-8 shadow-2xl"
            >
              {/* Profile Section */}
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6 mb-8">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center overflow-hidden">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name + ' profile'}
                        className="w-full h-full object-cover rounded-full border-4 border-purple-400 shadow-lg"
                      />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900"></div>
                </div>
                
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold text-white mb-2">{member.name}</h2>
                  <p className="text-purple-400 text-lg font-semibold mb-4">{member.title}</p>
                  
                  {/* Social Links */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    {member.links.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-800/50 hover:bg-purple-600/50 rounded-lg transition-all duration-300 text-gray-300 hover:text-white"
                      >
                        {link.icon()}
                        <span className="text-sm">{link.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-3">
                {member.bio.map((paragraph, pIndex) => {
                  if (paragraph === '') return <div key={pIndex} className="h-2"></div>;
                  
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <h3 key={pIndex} className="text-xl font-bold text-purple-400 mt-6 mb-3">
                        {paragraph.slice(2, -2)}
                      </h3>
                    );
                  }
                  
                  if (paragraph.startsWith('- ')) {
                    return (
                      <div key={pIndex} className="flex items-start space-x-2 text-gray-300">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>{paragraph.slice(2)}</span>
                      </div>
                    );
                  }
                  
                  return (
                    <p key={pIndex} className="text-gray-300 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Join Team Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-3xl border border-purple-400/30 p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Join the HENU Team Now
            </h2>
            <p className="text-gray-300 text-lg">
              Ready to revolutionize the future of computing? We're looking for passionate innovators.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8" method="POST">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-purple-400 font-semibold mb-2">
                  <span className="inline mr-2">👤</span>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-purple-400 font-semibold mb-2">
                  <span className="inline mr-2">📞</span>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="+91 98765 43210"
                />
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-purple-400 font-semibold mb-2">
                <span className="inline mr-2">✉️</span>
                Email ID *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-purple-400 font-semibold mb-2">
                <span className="inline mr-2">📍</span>
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                placeholder="Enter your complete address"
              />
              {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* Skills Section */}
            <div>
              <label className="block text-purple-400 font-semibold mb-2">
                <span className="inline mr-2">⚙️</span>
                Skills * (Select 7-14 skills)
              </label>
              <div className="mb-2 text-sm text-gray-400">
                Selected: {formData.skills.length}/14 (minimum 7 required)
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {availableSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      formData.skills.includes(skill)
                        ? 'bg-purple-600 text-white border border-purple-500'
                        : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-gray-700/50'
                    }`}
                  >
                    {formData.skills.includes(skill) && <CheckCircle size={14} className="inline mr-1" />}
                    {skill}
                  </button>
                ))}
              </div>
              {errors.skills && <p className="text-red-400 text-sm mt-1">{errors.skills}</p>}
            </div>

            {/* File Uploads */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-purple-400 font-semibold mb-2">
                  <span className="inline mr-2">📸</span>
                  Upload Photo (Passport Size) *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="photo"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'photo')}
                    className="hidden"
                  />
                  <label
                    htmlFor="photo"
                    className="flex items-center justify-center w-full px-4 py-6 bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-all duration-300"
                  >
                    <div className="text-center">
                      <span className="mx-auto text-purple-400 mb-2">📸</span>
                      <p className="text-gray-300">
                        {formData.photo ? formData.photo.name : 'Click to upload JPG/PNG'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Max 5MB</p>
                    </div>
                  </label>
                </div>
                {errors.photo && <p className="text-red-400 text-sm mt-1">{errors.photo}</p>}
              </div>

              <div>
                <label className="block text-purple-400 font-semibold mb-2">
                  <span className="inline mr-2">📄</span>
                  Upload Resume *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf,.docx"
                    onChange={(e) => handleFileChange(e, 'resume')}
                    className="hidden"
                  />
                  <label
                    htmlFor="resume"
                    className="flex items-center justify-center w-full px-4 py-6 bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-all duration-300"
                  >
                    <div className="text-center">
                      <span className="mx-auto text-purple-400 mb-2">📄</span>
                      <p className="text-gray-300">
                        {formData.resume ? formData.resume.name : 'Click to upload PDF/DOCX'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Max 5MB</p>
                    </div>
                  </label>
                </div>
                {errors.resume && <p className="text-red-400 text-sm mt-1">{errors.resume}</p>}
              </div>
            </div>

                         {/* Submit Button */}
             <div className="text-center">
               <motion.button
                 type="submit"
                 disabled={isSubmitting}
                 whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                 whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                 className={`px-12 py-4 font-bold text-lg rounded-full transition-all duration-300 shadow-lg ${
                   isSubmitting 
                     ? 'bg-gray-600 cursor-not-allowed text-gray-300' 
                     : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/30'
                 }`}
               >
                 {isSubmitting ? (
                   <div className="flex items-center space-x-2">
                     <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                     <span>Submitting...</span>
                   </div>
                 ) : (
                   'Apply Now'
                 )}
               </motion.button>
             </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Team;
