import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  increment,
  collection,
  query,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkRMzz_hSZ-bJD5O4Z0yJJfpU8bNNa9qI",
  authDomain: "henu-aebbd.firebaseapp.com",
  databaseURL: "https://henu-aebbd-default-rtdb.firebaseio.com",
  projectId: "henu-aebbd",
  // Must be the bucket ID, not a URL/host. Using incorrect value causes CORS/URL issues.
  storageBucket: "henu-aebbd.appspot.com",
  messagingSenderId: "224699699897",
  appId: "1:224699699897:web:494f0ac03721443705c168",
  measurementId: "G-58HRTCVSN7"
};

// OAuth configuration
const googleOAuthConfig = {
  clientId: "756347539673-tm61v3l1peq6uena8tcekpri57l7aktr.apps.googleusercontent.com",
  clientSecret: "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"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const storage = getStorage(app);

// User interface
interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'free' | 'premium';
  emailVerified: boolean;
  downloadCount: number;
  lastDownloadDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
    googleProvider.setCustomParameters({
      client_id: googleOAuthConfig.clientId
    });
    
    const result = await signInWithPopup(auth, googleProvider);
    
    // Create or update user data
    await createOrUpdateUser(result.user);
    
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signInWithGitHub = async () => {
  try {
    githubProvider.addScope('user:email');
    
    const result = await signInWithPopup(auth, githubProvider);
    
    // Create or update user data
    await createOrUpdateUser(result.user);
    
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Send email verification
    await sendEmailVerification(result.user);
    
    // Create user data
    await createOrUpdateUser(result.user);
    
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// User management functions
export const createOrUpdateUser = async (user: User) => {
  try {
    console.log('Creating/updating user:', user.uid);
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    const now = Timestamp.now();
    
    if (!userSnap.exists()) {
      // Build payload without undefined fields to avoid Firestore errors
      const userData: Record<string, any> = {
        uid: user.uid,
        email: user.email ?? '',
        role: 'free',
        emailVerified: user.emailVerified,
        downloadCount: 0,
        createdAt: now,
        updatedAt: now,
      };
      if (user.displayName != null) userData.displayName = user.displayName;
      if (user.photoURL != null) userData.photoURL = user.photoURL;
      await setDoc(userRef, userData);
      console.log('User data created successfully');
    } else {
      // Update existing user
      console.log('Updating existing user');
      const updatePayload: Record<string, any> = {
        email: user.email ?? '',
        emailVerified: user.emailVerified,
        updatedAt: now,
      };
      if (user.displayName != null) updatePayload.displayName = user.displayName;
      if (user.photoURL != null) updatePayload.photoURL = user.photoURL;
      await updateDoc(userRef, updatePayload);
      console.log('User data updated successfully');
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    console.log('Getting user data for:', uid);
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as UserData;
      console.log('User data found:', userData);
      return userData;
    } else {
      console.log('No user data found for UID:', uid);
      return null;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const checkDownloadLimit = async (uid: string): Promise<{ canDownload: boolean; remainingDownloads: number; error?: string }> => {
  try {
    const userData = await getUserData(uid);
    
    if (!userData) {
      return { canDownload: false, remainingDownloads: 0, error: 'User data not found' };
    }
    
    // Check if user is verified
    if (!userData.emailVerified) {
      return { canDownload: false, remainingDownloads: 0, error: 'Please verify your email address first' };
    }
    
    // Check daily download limit (3 downloads per day for free users)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const downloadsToday = await getDownloadsToday(uid, today);
    const maxDownloads = userData.role === 'premium' ? 10 : 3;
    const remainingDownloads = Math.max(0, maxDownloads - downloadsToday);
    
    return {
      canDownload: remainingDownloads > 0,
      remainingDownloads
    };
  } catch (error) {
    console.error('Error checking download limit:', error);
    return { canDownload: false, remainingDownloads: 0, error: 'Failed to check download limit' };
  }
};

export const recordDownload = async (uid: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const userRef = doc(db, 'users', uid);
    
    // Update user download count
    await updateDoc(userRef, {
      downloadCount: increment(1),
      lastDownloadDate: Timestamp.now()
    });
    
    // Record download in downloads collection
    const downloadRef = doc(collection(db, 'downloads'));
    await setDoc(downloadRef, {
      uid,
      timestamp: Timestamp.now(),
      userAgent: navigator.userAgent,
      ip: 'client-side' // In production, this would be set server-side
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error recording download:', error);
    return { success: false, error: 'Failed to record download' };
  }
};

const getDownloadsToday = async (uid: string, today: Date): Promise<number> => {
  try {
    const downloadsRef = collection(db, 'downloads');
    const q = query(
      downloadsRef,
      where('uid', '==', uid),
      where('timestamp', '>=', Timestamp.fromDate(today))
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting downloads today:', error);
    return 0;
  }
};

export const saveTeamApplication = async (data: {
  name: string;
  phone: string;
  email: string;
  address: string;
  skills: string[];
  photoBase64?: string;
  photoName?: string;
  resumeBase64?: string;
  resumeName?: string;
  submittedAt?: any;
}) => {
  try {
    const db = getFirestore();
    const applicationsRef = collection(db, 'team_applications');
    await setDoc(doc(applicationsRef), {
      ...data,
      submittedAt: data.submittedAt || Timestamp.now(),
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error saving team application:', error);
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Analytics tracking functions
export const trackPageView = async (pageName: string, pageData?: Record<string, any>) => {
  try {
    // Firebase Analytics event
    logEvent(analytics, 'page_view', {
      page_name: pageName,
      page_title: document.title,
      page_location: window.location.href,
      ...pageData
    });

    // Store in Firestore for detailed analytics
    const pageViewRef = doc(collection(db, 'page_views'));
    await setDoc(pageViewRef, {
      pageName,
      pageTitle: document.title,
      pageUrl: window.location.href,
      timestamp: Timestamp.now(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer: document.referrer,
      ...pageData
    });

    console.log(`Page view tracked: ${pageName}`);
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

export const trackDownloadAttempt = async (uid: string, downloadData: {
  mirror: string;
  userRole: string;
  emailVerified: boolean;
  downloadCount: number;
  userEmail?: string;
  subscriptionStatus?: string;
  trialExpiry?: Date;
}) => {
  try {
    // Firebase Analytics event
    logEvent(analytics, 'download_attempt', {
      mirror: downloadData.mirror,
      user_role: downloadData.userRole,
      email_verified: downloadData.emailVerified,
      download_count: downloadData.downloadCount,
      subscription_status: downloadData.subscriptionStatus
    });

    // Get IP address (client-side approximation)
    const ipInfo = await getClientIPInfo();

    // Store in Firestore for detailed analytics
    const downloadAttemptRef = doc(collection(db, 'download_attempts'));
    await setDoc(downloadAttemptRef, {
      uid,
      userEmail: downloadData.userEmail,
      mirror: downloadData.mirror,
      userRole: downloadData.userRole,
      emailVerified: downloadData.emailVerified,
      downloadCount: downloadData.downloadCount,
      subscriptionStatus: downloadData.subscriptionStatus,
      trialExpiry: downloadData.trialExpiry ? Timestamp.fromDate(downloadData.trialExpiry) : null,
      timestamp: Timestamp.now(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ipInfo: ipInfo,
      deviceInfo: getDeviceInfo(),
      networkInfo: getNetworkInfo()
    });

    console.log('Download attempt tracked with enhanced data');
  } catch (error) {
    console.error('Error tracking download attempt:', error);
  }
};

export const trackDownloadSuccess = async (uid: string, downloadData: {
  mirror: string;
  userRole: string;
  downloadSize: string;
  downloadTime: number;
  userEmail?: string;
  subscriptionStatus?: string;
  trialExpiry?: Date;
  downloadHash?: string;
}) => {
  try {
    // Firebase Analytics event
    logEvent(analytics, 'download_success', {
      mirror: downloadData.mirror,
      user_role: downloadData.userRole,
      download_size: downloadData.downloadSize,
      download_time: downloadData.downloadTime,
      subscription_status: downloadData.subscriptionStatus
    });

    // Get IP address and device info
    const ipInfo = await getClientIPInfo();

    // Store in Firestore for detailed analytics
    const downloadSuccessRef = doc(collection(db, 'download_successes'));
    await setDoc(downloadSuccessRef, {
      uid,
      userEmail: downloadData.userEmail,
      mirror: downloadData.mirror,
      userRole: downloadData.userRole,
      downloadSize: downloadData.downloadSize,
      downloadTime: downloadData.downloadTime,
      downloadHash: downloadData.downloadHash,
      subscriptionStatus: downloadData.subscriptionStatus,
      trialExpiry: downloadData.trialExpiry ? Timestamp.fromDate(downloadData.trialExpiry) : null,
      timestamp: Timestamp.now(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ipInfo: ipInfo,
      deviceInfo: getDeviceInfo(),
      networkInfo: getNetworkInfo(),
      downloadMetadata: {
        completedAt: new Date().toISOString(),
        sessionDuration: Date.now() - performance.timeOrigin,
        memoryUsage: (performance as any).memory ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
        } : null
      }
    });

    console.log('Download success tracked with enhanced data');
  } catch (error) {
    console.error('Error tracking download success:', error);
  }
};

export const trackUserEngagement = async (uid: string, action: string, actionData?: Record<string, any>) => {
  try {
    // Firebase Analytics event
    logEvent(analytics, 'user_engagement', {
      action,
      ...actionData
    });

    // Store in Firestore for detailed analytics
    const engagementRef = doc(collection(db, 'user_engagement'));
    await setDoc(engagementRef, {
      uid,
      action,
      actionData,
      timestamp: Timestamp.now(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    console.log(`User engagement tracked: ${action}`);
  } catch (error) {
    console.error('Error tracking user engagement:', error);
  }
};

// Helper function to get client IP information
const getClientIPInfo = async () => {
  try {
    // Try to get IP from multiple services for redundancy
    const ipServices = [
      'https://api.ipify.org?format=json',
      'https://api64.ipify.org?format=json',
      'https://api.myip.com'
    ];

    for (const service of ipServices) {
      try {
        const response = await fetch(service, { 
          method: 'GET',
          mode: 'cors',
          // timeout: 5000
        });
        
        if (response.ok) {
          const data = await response.json();
          const ip = data.ip || data.ipv4 || data.ipv6;
          
          if (ip) {
            return {
              ip: ip,
              ipVersion: ip.includes(':') ? 'IPv6' : 'IPv4',
              timestamp: new Date().toISOString(),
              source: service
            };
          }
        }
      } catch (error) {
        console.warn(`Failed to get IP from ${service}:`, error);
        continue;
      }
    }
    
    // Fallback to local IP detection
    return {
      ip: 'unknown',
      ipVersion: 'unknown',
      timestamp: new Date().toISOString(),
      source: 'fallback'
    };
  } catch (error) {
    console.error('Error getting IP info:', error);
    return {
      ip: 'error',
      ipVersion: 'error',
      timestamp: new Date().toISOString(),
      source: 'error'
    };
  }
};

// Helper function to get detailed device information
const getDeviceInfo = () => {
  try {
    return {
      platform: navigator.platform,
      vendor: navigator.vendor,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      hardwareConcurrency: navigator.hardwareConcurrency,
      maxTouchPoints: navigator.maxTouchPoints,
      deviceMemory: (navigator as any).deviceMemory,
      connection: (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink,
        rtt: (navigator as any).connection.rtt,
        saveData: (navigator as any).connection.saveData
      } : null,
      battery: null // Will be populated if available
    };
  } catch (error) {
    console.error('Error getting device info:', error);
    return { error: 'Failed to get device info' };
  }
};

// Helper function to get network information
const getNetworkInfo = () => {
  try {
    return {
      connectionType: (navigator as any).connection?.effectiveType || 'unknown',
      downlink: (navigator as any).connection?.downlink || 'unknown',
      rtt: (navigator as any).connection?.rtt || 'unknown',
      saveData: (navigator as any).connection?.saveData || false,
      onLine: navigator.onLine,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting network info:', error);
    return { error: 'Failed to get network info' };
  }
};

export const setAnalyticsUser = (uid: string, userProperties: Record<string, any>) => {
  try {
    // Set user ID for Firebase Analytics
    setUserId(analytics, uid);
    
    // Set user properties
    setUserProperties(analytics, userProperties);
    
    console.log('Analytics user set:', uid);
  } catch (error) {
    console.error('Error setting analytics user:', error);
  }
};

// Export comprehensive user data for administrators
export const exportUserData = async (format: 'csv' | 'json' = 'csv') => {
  try {
    // Fetch all user data from various collections
    const [attemptsSnapshot, successesSnapshot, pageViewsSnapshot, engagementSnapshot] = await Promise.all([
      getDocs(collection(db, 'download_attempts')),
      getDocs(collection(db, 'download_successes')),
      getDocs(collection(db, 'page_views')),
      getDocs(collection(db, 'user_engagement'))
    ]);

    // Process and combine data
    const userDataMap = new Map();
    
    // Process download attempts
    attemptsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.uid && data.userEmail) {
        if (!userDataMap.has(data.uid)) {
          userDataMap.set(data.uid, {
            uid: data.uid,
            userEmail: data.userEmail,
            userRole: data.userRole || 'free',
            emailVerified: data.emailVerified || false,
            downloadCount: data.downloadCount || 0,
            subscriptionStatus: data.subscriptionStatus || 'free',
            trialExpiry: data.trialExpiry?.toDate()?.toISOString(),
            createdAt: data.timestamp?.toDate()?.toISOString(),
            lastDownloadDate: data.timestamp?.toDate()?.toISOString(),
            ipAddress: data.ipInfo?.ip || 'unknown',
            ipVersion: data.ipInfo?.ipVersion || 'unknown',
            platform: data.deviceInfo?.platform || 'unknown',
            vendor: data.deviceInfo?.vendor || 'unknown',
            timezone: data.timezone || 'unknown',
            language: data.language || 'unknown',
            screenResolution: data.screenResolution || 'unknown',
            connectionType: data.networkInfo?.connectionType || 'unknown',
            downloadAttempts: 1,
            downloadSuccesses: 0,
            pageViews: 0,
            totalEngagement: 0
          });
        } else {
          const existing = userDataMap.get(data.uid);
          existing.downloadAttempts += 1;
          existing.lastDownloadDate = data.timestamp?.toDate()?.toISOString();
        }
      }
    });

    // Process download successes
    successesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.uid && userDataMap.has(data.uid)) {
        const user = userDataMap.get(data.uid);
        user.downloadSuccesses += 1;
        user.lastDownloadDate = data.timestamp?.toDate()?.toISOString();
        user.downloadHash = data.downloadHash;
        user.downloadSize = data.downloadSize;
        user.downloadTime = data.downloadTime;
      }
    });

    // Process page views
    pageViewsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.uid && userDataMap.has(data.uid)) {
        const user = userDataMap.get(data.uid);
        user.pageViews += 1;
      }
    });

    // Process user engagement
    engagementSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.uid && userDataMap.has(data.uid)) {
        const user = userDataMap.get(data.uid);
        user.totalEngagement += 1;
      }
    });

    const userData = Array.from(userDataMap.values());

    if (format === 'csv') {
      return exportToCSV(userData);
    } else {
      return exportToJSON(userData);
    }
  } catch (error) {
    console.error('Error exporting user data:', error);
    throw error;
  }
};

const exportToCSV = (data: any[]) => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value || '';
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `henu-os-user-data-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return 'CSV exported successfully';
};

const exportToJSON = (data: any[]) => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `henu-os-user-data-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return 'JSON exported successfully';
};

export { auth, db, analytics }; 

// Helper to upload a file and return its download URL
export const uploadFileAndGetURL = async (file: File, path: string): Promise<string> => {
  const fileRef = storageRef(storage, path);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}; 