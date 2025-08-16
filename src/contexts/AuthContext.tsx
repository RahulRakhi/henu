import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { 
  onAuthStateChange, 
  signInWithGoogle, 
  signInWithGitHub,
  signInWithEmail, 
  signUpWithEmail, 
  signOutUser,
  sendPasswordReset,
  getUserData,
  createOrUpdateUser,
  checkDownloadLimit,
  recordDownload
} from '../services/firebase';

interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'free' | 'premium';
  emailVerified: boolean;
  downloadCount: number;
  lastDownloadDate?: any;
  createdAt: any;
  updatedAt: any;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ user: User | null; error: string | null }>;
  signInWithGitHub: () => Promise<{ user: User | null; error: string | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  sendPasswordReset: (email: string) => Promise<{ error: string | null }>;
  checkDownloadLimit: () => Promise<{ canDownload: boolean; remainingDownloads: number; error?: string }>;
  recordDownload: () => Promise<{ success: boolean; error?: string }>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserData = async () => {
    if (user) {
      try {
        console.log('Refreshing user data for:', user.uid);
        // Ensure user data exists first
        await createOrUpdateUser(user);
        // Then fetch it
        const data = await getUserData(user.uid);
        console.log('Refreshed user data:', data);
        setUserData(data);
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      console.log('Auth state changed:', user?.uid);
      setUser(user);
      if (user) {
        try {
          // First ensure user data exists
          await createOrUpdateUser(user);
          // Then fetch the user data
          const data = await getUserData(user.uid);
          console.log('User data in auth context:', data);
          setUserData(data);
        } catch (error) {
          console.error('Error handling user auth state change:', error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signInWithGoogle,
    signInWithGitHub,
    signInWithEmail,
    signUpWithEmail,
    signOut: signOutUser,
    sendPasswordReset,
    checkDownloadLimit: () => user ? checkDownloadLimit(user.uid) : Promise.resolve({ canDownload: false, remainingDownloads: 0, error: 'Not authenticated' }),
    recordDownload: () => user ? recordDownload(user.uid) : Promise.resolve({ success: false, error: 'Not authenticated' }),
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 