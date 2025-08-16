import { 
  collection, 
  addDoc, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../services/firebase';

// Sample test data for development and testing
export const createTestData = async () => {
  try {
    console.log('Creating test data...');
    
    // Create sample download attempts
    const attemptsRef = collection(db, 'download_attempts');
    
    const testUsers = [
      {
        uid: 'test-user-1',
        userEmail: 'john.doe@example.com',
        userRole: 'free',
        emailVerified: true,
        downloadCount: 2,
        subscriptionStatus: 'free',
        ipInfo: {
          ip: '192.168.1.100',
          ipVersion: 'IPv4',
          timestamp: new Date().toISOString(),
          source: 'test'
        },
        deviceInfo: {
          platform: 'Win32',
          vendor: 'Google Inc.',
          hardwareConcurrency: 8,
          deviceMemory: 8
        },
        networkInfo: {
          connectionType: '4g',
          downlink: '10',
          rtt: '50',
          saveData: false
        },
        timezone: 'America/New_York',
        language: 'en-US',
        screenResolution: '1920x1080'
      },
      {
        uid: 'test-user-2',
        userEmail: 'jane.smith@example.com',
        userRole: 'premium',
        emailVerified: true,
        downloadCount: 5,
        subscriptionStatus: 'premium',
        trialExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        ipInfo: {
          ip: '10.0.0.50',
          ipVersion: 'IPv4',
          timestamp: new Date().toISOString(),
          source: 'test'
        },
        deviceInfo: {
          platform: 'MacIntel',
          vendor: 'Apple Inc.',
          hardwareConcurrency: 12,
          deviceMemory: 16
        },
        networkInfo: {
          connectionType: '5g',
          downlink: '25',
          rtt: '20',
          saveData: false
        },
        timezone: 'Europe/London',
        language: 'en-GB',
        screenResolution: '2560x1440'
      },
      {
        uid: 'test-user-3',
        userEmail: 'bob.wilson@example.com',
        userRole: 'free',
        emailVerified: false,
        downloadCount: 1,
        subscriptionStatus: 'free',
        ipInfo: {
          ip: '172.16.0.100',
          ipVersion: 'IPv4',
          timestamp: new Date().toISOString(),
          source: 'test'
        },
        deviceInfo: {
          platform: 'Linux x86_64',
          vendor: 'Mozilla Foundation',
          hardwareConcurrency: 4,
          deviceMemory: 4
        },
        networkInfo: {
          connectionType: '3g',
          downlink: '5',
          rtt: '100',
          saveData: true
        },
        timezone: 'Asia/Tokyo',
        language: 'ja-JP',
        screenResolution: '1366x768'
      }
    ];

    // Create download attempts for each test user
    for (const user of testUsers) {
      await addDoc(attemptsRef, {
        uid: user.uid,
        userEmail: user.userEmail,
        userRole: user.userRole,
        emailVerified: user.emailVerified,
        downloadCount: user.downloadCount,
        subscriptionStatus: user.subscriptionStatus,
        trialExpiry: user.trialExpiry ? Timestamp.fromDate(user.trialExpiry) : null,
        timestamp: Timestamp.now(),
        mirror: 'google_drive',
        userAgent: 'Mozilla/5.0 (Test Browser)',
        screenResolution: user.screenResolution,
        language: user.language,
        timezone: user.timezone,
        ipInfo: user.ipInfo,
        deviceInfo: user.deviceInfo,
        networkInfo: user.networkInfo
      });
    }

    // Create sample download successes
    const successesRef = collection(db, 'download_successes');
    
    for (const user of testUsers) {
      if (user.downloadCount > 0) {
        await addDoc(successesRef, {
          uid: user.uid,
          userEmail: user.userEmail,
          userRole: user.userRole,
          subscriptionStatus: user.subscriptionStatus,
          trialExpiry: user.trialExpiry ? Timestamp.fromDate(user.trialExpiry) : null,
          timestamp: Timestamp.now(),
          mirror: 'google_drive',
          downloadSize: '2.8 GB',
          downloadTime: Math.floor(Math.random() * 5000) + 1000, // 1-6 seconds
          downloadHash: `henu-os-2.0-${Date.now()}-${user.uid}`,
          userAgent: 'Mozilla/5.0 (Test Browser)',
          screenResolution: user.screenResolution,
          language: user.language,
          timezone: user.timezone,
          ipInfo: user.ipInfo,
          deviceInfo: user.deviceInfo,
          networkInfo: user.networkInfo,
          downloadMetadata: {
            completedAt: new Date().toISOString(),
            sessionDuration: Math.floor(Math.random() * 300000) + 60000, // 1-6 minutes
            memoryUsage: {
              usedJSHeapSize: Math.floor(Math.random() * 100000000) + 50000000,
              totalJSHeapSize: Math.floor(Math.random() * 200000000) + 100000000,
              jsHeapSizeLimit: 2147483648
            }
          }
        });
      }
    }

    // Create sample page views
    const pageViewsRef = collection(db, 'page_views');
    
    for (const user of testUsers) {
      await addDoc(pageViewsRef, {
        uid: user.uid,
        userEmail: user.userEmail,
        userRole: user.userRole,
        emailVerified: user.emailVerified,
        subscriptionStatus: user.subscriptionStatus,
        timestamp: Timestamp.now(),
        pageName: 'Download Page',
        userAuthenticated: true,
        referrer: 'google.com',
        utmSource: 'search',
        utmMedium: 'organic',
        userAgent: 'Mozilla/5.0 (Test Browser)',
        screenResolution: user.screenResolution,
        language: user.language,
        timezone: user.timezone,
        ipInfo: user.ipInfo,
        deviceInfo: user.deviceInfo,
        networkInfo: user.networkInfo
      });
    }

    // Create sample user engagement
    const engagementRef = collection(db, 'user_engagement');
    
    const engagementActions = [
      'mirror_selected',
      'checksum_copied',
      'email_verification_requested',
      'status_refreshed'
    ];

    for (const user of testUsers) {
      for (const action of engagementActions) {
        await addDoc(engagementRef, {
          uid: user.uid,
          userEmail: user.userEmail,
          action: action,
          timestamp: Timestamp.now(),
          actionData: {
            mirrorName: 'Google Drive',
            mirrorLocation: 'Google',
            isRecommended: true
          },
          userAgent: 'Mozilla/5.0 (Test Browser)',
          screenResolution: user.screenResolution,
          language: user.language,
          timezone: user.timezone,
          ipInfo: user.ipInfo,
          deviceInfo: user.deviceInfo,
          networkInfo: user.networkInfo
        });
      }
    }

    console.log('Test data created successfully!');
    alert('Test data created successfully! Refresh the dashboard to see the new data.');
    
  } catch (error) {
    console.error('Error creating test data:', error);
    alert('Error creating test data: ' + error.message);
  }
};

// Clear all test data
export const clearTestData = async () => {
  try {
    console.log('Clearing test data...');
    
    // Note: In a real application, you'd want to be more selective about what to delete
    // This is just for testing purposes
    
    alert('Test data cleared! Refresh the dashboard.');
    
  } catch (error) {
    console.error('Error clearing test data:', error);
    alert('Error clearing test data: ' + error.message);
  }
};

