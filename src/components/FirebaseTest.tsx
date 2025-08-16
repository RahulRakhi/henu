import React, { useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const FirebaseTest: React.FC = () => {
  const [status, setStatus] = useState('Testing Firebase connection...');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setStatus(`✅ Firebase connected! User: ${user.email}`);
      } else {
        setStatus('✅ Firebase connected! No user signed in');
      }
    }, (error) => {
      setStatus(`❌ Firebase error: ${error.message}`);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
      {status}
    </div>
  );
};

export default FirebaseTest; 