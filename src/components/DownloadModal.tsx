import React, { useState, useEffect } from 'react';
import {ref as dbRef, set} from 'firebase/database';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  User,  
  Lock, 
  Crown, 
  CreditCard, 
  Globe, 
  Monitor,
  X,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  trackUserEngagement, 
  trackDownloadAttempt, 
  trackDownloadSuccess 
} from '../services/firebase';

interface UserDetails {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  useCase: string;
  subscriptionType: 'free' | 'premium' | 'enterprise';
  company?: string;
  jobTitle?: string;
  newsletter: boolean;
  termsAccepted: boolean;
}

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloadUrl?: string;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose, downloadUrl }) => {
  const { user, signInWithGoogle, signInWithGitHub } = useAuth();
  const [step, setStep] = useState<'login' | 'details' | 'download' | 'download_success'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userDetails, setUserDetails] = useState<UserDetails>({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    useCase: '',
    subscriptionType: 'free',
    company: '',
    jobTitle: '',
    newsletter: false,
    termsAccepted: false
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (user) {
        setStep('details');
        setUserDetails(prev => ({
          ...prev,
          email: user.email || '',
          fullName: user.displayName || ''
        }));
      } else {
        setStep('login');
      }
      setError(''); // Clear any previous errors
    }
  }, [isOpen, user]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      await signInWithGoogle();
      setStep('details');
    } catch (error) {
      setError('Failed to sign in with Google');
      console.error('Google sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      await signInWithGitHub();
      setStep('details');
    } catch (error) {
      setError('Failed to sign in with GitHub');
      console.error('GitHub sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userDetails.termsAccepted) {
      setError('Please accept the terms and conditions');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // Track user engagement for form submission
      if (user) {
        await trackUserEngagement(user.uid, 'download_form_submitted', {
          subscriptionType: userDetails.subscriptionType,
          useCase: userDetails.useCase,
          country: userDetails.country,
          newsletter: userDetails.newsletter
        });
      }
      
      setStep('download');
    } catch (error) {
      setError('Failed to submit form');
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!user) return;
    
    console.log('Starting download process...', { downloadUrl, user: user.email });
    // console.log('userD',user);
    try {
      setIsLoading(true);
      setError('');
      
      const startTime = Date.now();
      
      // Track download attempt
      
      await trackDownloadAttempt(user.uid, {
        mirror: downloadUrl ? 'custom_mirror' : 'default_mirror',
        userRole: userDetails.subscriptionType,
        emailVerified: user.emailVerified || false,
        downloadCount: 1,
        userEmail: user.email || '',
        subscriptionStatus: userDetails.subscriptionType,
        trialExpiry: userDetails.subscriptionType === 'premium' ? 
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined
      });
      console.log('Download attempt tracked',userDetails);  
      // Track successful download
      const downloadTime = Date.now() - startTime;
      
      await trackDownloadSuccess(user.uid, {
        mirror: downloadUrl ? 'custom_mirror' : 'default_mirror',
        userRole: userDetails.subscriptionType,
        downloadSize: '2.8 GB',
        downloadTime,
        userEmail: user.email || '',
        subscriptionStatus: userDetails.subscriptionType,
        trialExpiry: userDetails.subscriptionType === 'premium' ? 
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined,
        downloadHash: `henu-os-2.0-${Date.now()}-${user.uid}`
        
      });

      // Track user engagement for download completion
      await trackUserEngagement(user.uid, 'download_completed', {
        subscriptionType: userDetails.subscriptionType,
        downloadTime,
        downloadSize: '2.8 GB'
      });

      // ACTUALLY DOWNLOAD THE ISO FILE
      const defaultDownloadUrl = 'https://drive.google.com/uc?export=download&id=1_qA5yiDP0l0nYQRA6qlPxBuAMD7rl0rL';
      const finalDownloadUrl = downloadUrl || defaultDownloadUrl;
      
      console.log('Download URL:', finalDownloadUrl);
      
      // Handle different types of URLs
      if (finalDownloadUrl.includes('drive.google.com')) {
        console.log('Opening Google Drive link in new tab');
        // Google Drive - open in new tab for user to download
        window.open(finalDownloadUrl, '_blank');
      } else if (finalDownloadUrl.includes('github.com')) {
        console.log('Opening GitHub releases page in new tab');
        // GitHub - open releases page
        window.open(finalDownloadUrl, '_blank');
      } else {
        console.log('Attempting direct download');
        // Direct download link - try to download directly
        try {
          const link = document.createElement('a');
          link.href = finalDownloadUrl;
          link.download = 'henu-os-2.0.iso';
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          console.log('Direct download link created and clicked');
        } catch (error) {
          console.error('Direct download failed, opening in new tab:', error);
          window.open(finalDownloadUrl, '_blank');
        }
      }

      // Show success step
      setStep('download_success');
      
      console.log('Download success',userDetails);
      

      const { getDatabase } = await import('firebase/database');
      const db = getDatabase();
      const newApplicationRef = dbRef(db, 'Downloads/' + Date.now());
      await set(newApplicationRef, userDetails);
      
    } catch (error) {
      setError('Download failed. Please try again.');
      console.error('Download error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserDetails = (field: keyof UserDetails, value: any) => {
    console.log('Updating user details:', field, value);
    setUserDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    onClose();
    // Reset modal state
    setStep('login');
    setError('');
    setUserDetails({
      fullName: '',
      email: '',
      phone: '',
      country: '',
      useCase: '',
      subscriptionType: 'free',
      company: '',
      jobTitle: '',
      newsletter: false,
      termsAccepted: false
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <Download className="w-8 h-8 text-purple-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Download HENU OS</h2>
                <p className="text-gray-400">Complete your profile to download</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center p-4 border-b border-gray-700">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${step === 'login' ? 'text-purple-400' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  step === 'login' ? 'border-purple-400 bg-purple-400' : 'border-gray-500'
                }`}>
                  {step === 'login' ? <User className="w-4 h-4 text-white" /> : '1'}
                </div>
                <span className="text-sm font-medium">Login</span>
              </div>
              
              <div className={`w-16 h-1 rounded ${step === 'details' || step === 'download' || step === 'download_success' ? 'bg-purple-400' : 'bg-gray-500'}`} />
              
              <div className={`flex items-center space-x-2 ${step === 'details' ? 'text-purple-400' : step === 'download' || step === 'download_success' ? 'text-green-400' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  step === 'details' ? 'border-purple-400 bg-purple-400' : 
                  step === 'download' || step === 'download_success' ? 'border-green-400 bg-green-400' : 'border-gray-500'
                }`}>
                  {step === 'details' ? <Info className="w-4 h-4 text-white" /> : 
                   step === 'download' || step === 'download_success' ? <CheckCircle className="w-4 h-4 text-white" /> : '2'}
                </div>
                <span className="text-sm font-medium">Details</span>
              </div>
              
              <div className={`w-16 h-1 rounded ${step === 'download' || step === 'download_success' ? 'bg-green-400' : 'bg-gray-500'}`} />
              
              <div className={`flex items-center space-x-2 ${step === 'download' ? 'text-green-400' : step === 'download_success' ? 'text-green-400' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  step === 'download' ? 'border-green-400 bg-green-400' : 
                  step === 'download_success' ? 'border-green-400 bg-green-400' : 'border-gray-500'
                }`}>
                                     {step === 'download' ? <Download className="w-4 h-4 text-white" /> : 
                    step === 'download_success' ? <CheckCircle className="w-4 h-4 text-white" /> : '3'}
                </div>
                <span className="text-sm font-medium">Download</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-red-900/50 border border-red-500/30 rounded-lg flex items-center space-x-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-300">{error}</span>
              </motion.div>
            )}

            {/* Step 1: Login */}
            {step === 'login' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-center"
              >
                <div className="mb-6">
                  <Lock className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Sign in to Download</h3>
                  <p className="text-gray-400">Please sign in to access HENU OS downloads</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">G</span>
                    </div>
                    <span>Continue with Google</span>
                  </button>

                  <button
                    onClick={handleGitHubSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-3 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <span className="text-gray-900 text-xs font-bold">G</span>
                    </div>
                    <span>Continue with GitHub</span>
                  </button>
                </div>

                <div className="mt-6 text-sm text-gray-400">
                  <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
                </div>
              </motion.div>
            )}

            {/* Step 2: User Details Form */}
            {step === 'details' && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleDetailsSubmit}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <User className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Complete Your Profile</h3>
                  <p className="text-gray-400">Help us understand your needs better</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={userDetails.fullName}
                      onChange={(e) => updateUserDetails('fullName', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={userDetails.email}
                      onChange={(e) => updateUserDetails('email', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={userDetails.phone}
                      onChange={(e) => updateUserDetails('phone', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Country *
                    </label>
                    <select
                      required
                      value={userDetails.country}
                      onChange={(e) => updateUserDetails('country', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="">Select your country</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="JP">Japan</option>
                      <option value="IN">India</option>
                      <option value="BR">Brazil</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      How will you use HENU OS? *
                    </label>
                    <select
                      required
                      value={userDetails.useCase}
                      onChange={(e) => updateUserDetails('useCase', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="">Select your use case</option>
                      <option value="personal">Personal Use</option>
                      <option value="development">Software Development</option>
                      <option value="business">Business/Enterprise</option>
                      <option value="education">Education</option>
                      <option value="gaming">Gaming</option>
                      <option value="testing">Testing/Evaluation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subscription Type *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <label className="flex items-center p-3 border border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                        <input
                          type="radio"
                          name="subscriptionType"
                          value="free"
                          checked={userDetails.subscriptionType === 'free'}
                          onChange={(e) => updateUserDetails('subscriptionType', e.target.value)}
                          className="mr-3 text-purple-500"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-green-400" />
                            <span className="font-medium text-white">Free</span>
                          </div>
                          <p className="text-xs text-gray-400">Basic access</p>
                        </div>
                      </label>

                      <label className="flex items-center p-3 border border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                        <input
                          type="radio"
                          name="subscriptionType"
                          value="premium"
                          checked={userDetails.subscriptionType === 'premium'}
                          onChange={(e) => updateUserDetails('subscriptionType', e.target.value)}
                          className="mr-3 text-purple-500"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <Crown className="w-4 h-4 text-yellow-400" />
                            <span className="font-medium text-white">Premium</span>
                          </div>
                          <p className="text-xs text-gray-400">Advanced features</p>
                        </div>
                      </label>

                      <label className="flex items-center p-3 border border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                        <input
                          type="radio"
                          name="subscriptionType"
                          value="enterprise"
                          checked={userDetails.subscriptionType === 'enterprise'}
                          onChange={(e) => updateUserDetails('subscriptionType', e.target.value)}
                          className="mr-3 text-purple-500"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-4 h-4 text-blue-400" />
                            <span className="font-medium text-white">Enterprise</span>
                          </div>
                          <p className="text-xs text-gray-400">Business solutions</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {(userDetails.subscriptionType === 'premium' || userDetails.subscriptionType === 'enterprise') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={userDetails.company}
                          onChange={(e) => updateUserDetails('company', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                          placeholder="Enter company name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Job Title
                        </label>
                        <input
                          type="text"
                          value={userDetails.jobTitle}
                          onChange={(e) => updateUserDetails('jobTitle', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                          placeholder="Enter your job title"
                        />
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userDetails.newsletter}
                        onChange={(e) => updateUserDetails('newsletter', e.target.checked)}
                        className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-300">
                        Subscribe to our newsletter for updates and tips
                      </span>
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={userDetails.termsAccepted}
                        onChange={(e) => updateUserDetails('termsAccepted', e.target.checked)}
                        className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-300">
                        I agree to the <a href="#" className="text-purple-400 hover:underline">Terms of Service</a> and{' '}
                        <a href="#" className="text-purple-400 hover:underline">Privacy Policy</a> *
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep('login')}
                    className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <Download className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}

            {/* Step 3: Download */}
            {step === 'download' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="mb-6">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Ready to Download!</h3>
                  <p className="text-gray-400">Your profile is complete. Click below to start downloading HENU OS.</p>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg mb-6 text-left">
                  <h4 className="font-medium text-white mb-2">Download Summary</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>Subscription:</span>
                      <span className="text-purple-400 capitalize">{userDetails.subscriptionType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Use Case:</span>
                      <span className="text-blue-400 capitalize">{userDetails.useCase}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Country:</span>
                      <span className="text-green-400">{userDetails.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>File Size:</span>
                      <span className="text-yellow-400">2.8 GB</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-3 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6" />
                      <span>Download HENU OS 2.0</span>
                    </>
                  )}
                </button>

                <div className="mt-4 text-sm text-gray-400">
                  <p>Download will start automatically. You can also use the mirror links below.</p>
                </div>
              </motion.div>
            )}

            {/* Step 4: Download Success */}
            {step === 'download_success' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="mb-6">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Download Started!</h3>
                  <p className="text-gray-400">Your HENU OS ISO download has been initiated.</p>
                </div>

                <div className="bg-green-900/50 p-4 rounded-lg mb-6 text-left border border-green-500/30">
                  <h4 className="font-medium text-white mb-2">Download Status</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="text-green-400">✅ Started</span>
                    </div>
                    <div className="flex justify-between">
                      <span>File:</span>
                      <span className="text-blue-400">henu-os-2.0.iso</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span className="text-yellow-400">2.8 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Source:</span>
                      <span className="text-purple-400">
                        {downloadUrl ? 'Selected Mirror' : 'Google Drive (Default)'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-400 mb-6">
                  <p>✅ Download link opened in new tab</p>
                  <p>✅ Analytics data recorded</p>
                  <p>✅ User profile completed</p>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Close & Continue
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DownloadModal;
