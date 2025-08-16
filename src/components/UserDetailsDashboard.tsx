import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Globe, 
  Clock, 
  Download, 
  Shield, 
  Monitor,
  Network,
  Smartphone,
  Calendar,
  Eye,
  Search,
  Filter,
  Download as DownloadIcon,
  Crown,
  CreditCard,
  Users,
  RefreshCw
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db, exportUserData } from '../services/firebase';
import { createTestData, clearTestData } from '../utils/testData';

interface UserDetail {
  uid: string;
  userEmail: string;
  userRole: string;
  emailVerified: boolean;
  downloadCount: number;
  subscriptionStatus: string;
  trialExpiry?: Date;
  lastDownloadDate?: Date;
  createdAt: Date;
  ipInfo: {
    ip: string;
    ipVersion: string;
    timestamp: string;
    source: string;
  };
  deviceInfo: {
    platform: string;
    vendor: string;
    hardwareConcurrency?: number;
    maxTouchPoints?: number;
    deviceMemory?: number;
  };
  networkInfo: {
    connectionType: string;
    downlink: string;
    rtt: string;
    saveData: boolean;
  };
  location: {
    timezone: string;
    language: string;
    screenResolution: string;
  };
}

interface DownloadRecord {
  id: string;
  timestamp: Timestamp;
  mirror: string;
  downloadSize: string;
  downloadTime: number;
  downloadHash: string;
  ipInfo: any;
  deviceInfo: any;
  networkInfo: any;
  userAgent: string;
}

const UserDetailsDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      console.log('🔍 Starting to fetch user details...');
      
      // Test basic collection access first
      try {
        const testRef = collection(db, 'test');
        const testSnapshot = await getDocs(testRef);
        console.log('✅ Basic Firestore access working');
      } catch (error) {
        console.error('❌ Firestore access error:', error);
      }
      
      // Fetch download attempts to get user details
      const attemptsRef = collection(db, 'download_attempts');
      console.log('📊 Fetching from collection: download_attempts');
      let attemptsSnapshot;
      try {
        const attemptsQuery = query(
          attemptsRef,
          orderBy('timestamp', 'desc'),
          limit(100)
        );
        attemptsSnapshot = await getDocs(attemptsQuery);
        console.log('📥 Download attempts found:', attemptsSnapshot.docs.length);
      } catch (error) {
        console.log('⚠️ OrderBy query failed, trying without ordering...');
        try {
          const simpleQuery = query(attemptsRef, limit(100));
          attemptsSnapshot = await getDocs(simpleQuery);
          console.log('📥 Download attempts found (simple query):', attemptsSnapshot.docs.length);
        } catch (simpleError) {
          console.error('❌ Simple query also failed:', simpleError);
          attemptsSnapshot = { docs: [] };
        }
      }
      
      // Fetch download successes
      const successesRef = collection(db, 'download_successes');
      console.log('📊 Fetching from collection: download_successes');
      let successesSnapshot;
      try {
        const successesQuery = query(
          successesRef,
          orderBy('timestamp', 'desc'),
          limit(100)
        );
        successesSnapshot = await getDocs(successesQuery);
        console.log('📥 Download successes found:', successesSnapshot.docs.length);
      } catch (error) {
        console.log('⚠️ OrderBy query failed, trying without ordering...');
        try {
          const simpleQuery = query(successesRef, limit(100));
          successesSnapshot = await getDocs(simpleQuery);
          console.log('📥 Download successes found (simple query):', successesSnapshot.docs.length);
        } catch (simpleError) {
          console.error('❌ Simple query also failed:', simpleError);
          successesSnapshot = { docs: [] };
        }
      }
      
      // Fetch page views to get additional user data
      const pageViewsRef = collection(db, 'page_views');
      console.log('📊 Fetching from collection: page_views');
      let pageViewsSnapshot;
      try {
        const pageViewsQuery = query(
          pageViewsRef,
          orderBy('timestamp', 'desc'),
          limit(100)
        );
        pageViewsSnapshot = await getDocs(pageViewsQuery);
        console.log('📥 Page views found:', pageViewsSnapshot.docs.length);
      } catch (error) {
        console.log('⚠️ OrderBy query failed, trying without ordering...');
        try {
          const simpleQuery = query(pageViewsRef, limit(100));
          pageViewsSnapshot = await getDocs(simpleQuery);
          console.log('📥 Page views found (simple query):', successesSnapshot.docs.length);
        } catch (simpleError) {
          console.error('❌ Simple query also failed:', simpleError);
          pageViewsSnapshot = { docs: [] };
        }
      }
      
      // Process user details - start with attempts
      const userMap = new Map<string, UserDetail>();
      console.log('🔄 Processing download attempts...');
      
      // First, process download attempts
      attemptsSnapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        console.log(`📝 Processing attempt ${index + 1}:`, { uid: data.uid, email: data.userEmail, role: data.userRole });
        
        if (data.uid && data.userEmail) {
          if (!userMap.has(data.uid)) {
            userMap.set(data.uid, {
              uid: data.uid,
              userEmail: data.userEmail,
              userRole: data.userRole || 'free',
              emailVerified: data.emailVerified || false,
              downloadCount: data.downloadCount || 0,
              subscriptionStatus: data.subscriptionStatus || 'free',
              trialExpiry: data.trialExpiry?.toDate(),
              lastDownloadDate: data.timestamp?.toDate(),
              createdAt: data.timestamp?.toDate() || new Date(),
              ipInfo: data.ipInfo || { ip: 'unknown', ipVersion: 'unknown', timestamp: '', source: '' },
              deviceInfo: data.deviceInfo || { platform: 'unknown', vendor: 'unknown' },
              networkInfo: data.networkInfo || { connectionType: 'unknown', downlink: 'unknown', rtt: 'unknown', saveData: false },
              location: {
                timezone: data.timezone || 'unknown',
                language: data.language || 'unknown',
                screenResolution: data.screenResolution || 'unknown'
              }
            });
            console.log(`✅ Created new user: ${data.userEmail}`);
          } else {
            // Update existing user with latest data
            const existing = userMap.get(data.uid)!;
            existing.downloadCount = Math.max(existing.downloadCount, data.downloadCount || 0);
            if (data.timestamp?.toDate() && (!existing.lastDownloadDate || data.timestamp.toDate() > existing.lastDownloadDate)) {
              existing.lastDownloadDate = data.timestamp.toDate();
            }
            // Update IP info if newer
            if (data.ipInfo?.timestamp && (!existing.ipInfo.timestamp || data.ipInfo.timestamp > existing.ipInfo.timestamp)) {
              existing.ipInfo = data.ipInfo;
            }
            console.log(`🔄 Updated existing user: ${data.userEmail}`);
          }
        } else {
          console.log(`⚠️ Skipping document - missing uid or email:`, { uid: data.uid, email: data.userEmail });
        }
      });
      
      // Process download successes to enhance user data
      successesSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.uid && data.userEmail) {
          if (!userMap.has(data.uid)) {
            // Create new user from success record
            userMap.set(data.uid, {
              uid: data.uid,
              userEmail: data.userEmail,
              userRole: data.userRole || 'free',
              emailVerified: data.emailVerified || false,
              downloadCount: 1,
              subscriptionStatus: data.subscriptionStatus || 'free',
              trialExpiry: data.trialExpiry?.toDate(),
              lastDownloadDate: data.timestamp?.toDate(),
              createdAt: data.timestamp?.toDate() || new Date(),
              ipInfo: data.ipInfo || { ip: 'unknown', ipVersion: 'unknown', timestamp: '', source: '' },
              deviceInfo: data.deviceInfo || { platform: 'unknown', vendor: 'unknown' },
              networkInfo: data.networkInfo || { connectionType: 'unknown', downlink: 'unknown', rtt: 'unknown', saveData: false },
              location: {
                timezone: data.timezone || 'unknown',
                language: data.language || 'unknown',
                screenResolution: data.screenResolution || 'unknown'
              }
            });
          } else {
            // Update existing user
            const existing = userMap.get(data.uid)!;
            existing.downloadCount += 1;
            if (data.timestamp?.toDate() && (!existing.lastDownloadDate || data.timestamp.toDate() > existing.lastDownloadDate)) {
              existing.lastDownloadDate = data.timestamp.toDate();
            }
            // Update IP info if newer
            if (data.ipInfo?.timestamp && (!existing.ipInfo.timestamp || data.ipInfo.timestamp > existing.ipInfo.timestamp)) {
              existing.ipInfo = data.ipInfo;
            }
          }
        }
      });
      
      // Process page views to get additional user data
      pageViewsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.uid && data.userEmail) {
          if (!userMap.has(data.uid)) {
            // Create new user from page view
            userMap.set(data.uid, {
              uid: data.uid,
              userEmail: data.userEmail,
              userRole: data.userRole || 'free',
              emailVerified: data.emailVerified || false,
              downloadCount: 0,
              subscriptionStatus: data.subscriptionStatus || 'free',
              trialExpiry: undefined,
              lastDownloadDate: undefined,
              createdAt: data.timestamp?.toDate() || new Date(),
              ipInfo: data.ipInfo || { ip: 'unknown', ipVersion: 'unknown', timestamp: '', source: '' },
              deviceInfo: data.deviceInfo || { platform: 'unknown', vendor: 'unknown' },
              networkInfo: data.networkInfo || { connectionType: 'unknown', downlink: 'unknown', rtt: 'unknown', saveData: false },
              location: {
                timezone: data.timezone || 'unknown',
                language: data.language || 'unknown',
                screenResolution: data.screenResolution || 'unknown'
              }
            });
          }
        }
      });
      
      // Process download records for detailed history
      const downloadRecords: DownloadRecord[] = [];
      successesSnapshot.docs.forEach(doc => {
        const data = doc.data();
        downloadRecords.push({
          id: doc.id,
          timestamp: data.timestamp,
          mirror: data.mirror,
          downloadSize: data.downloadSize,
          downloadTime: data.downloadTime,
          downloadHash: data.downloadHash,
          ipInfo: data.ipInfo,
          deviceInfo: data.deviceInfo,
          networkInfo: data.networkInfo,
          userAgent: data.userAgent
        });
      });
      
      console.log('Fetched users:', Array.from(userMap.values()));
      console.log('Fetched downloads:', downloadRecords);
      
      setUsers(Array.from(userMap.values()));
      setDownloads(downloadRecords);
      
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.uid.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.userRole === filterRole;
    const matchesStatus = filterStatus === 'all' || user.subscriptionStatus === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getUserDownloads = (uid: string) => {
    // For now, return all downloads since we don't have direct UID matching
    // In a real implementation, you'd want to store UID in download records
    return downloads;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">User Details Dashboard</h2>
        <p className="text-gray-400">Comprehensive user information and download analytics</p>
      </div>

      {/* Debug Info */}
      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-3">Debug Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Total Users Found:</span>
            <p className="text-white font-mono">{users.length}</p>
          </div>
          <div>
            <span className="text-gray-400">Total Downloads:</span>
            <p className="text-white font-mono">{downloads.length}</p>
          </div>
          <div>
            <span className="text-gray-400">Filtered Users:</span>
            <p className="text-white font-mono">{filteredUsers.length}</p>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-400">
          <p>Check browser console for detailed data logs</p>
        </div>
        <div className="mt-3 flex gap-2 flex-wrap">
          <button
            onClick={() => {
              console.log('🔍 Current State Debug Info:');
              console.log('Users:', users);
              console.log('Downloads:', downloads);
              console.log('Filtered Users:', filteredUsers);
              console.log('Selected User:', selectedUser);
            }}
            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition-colors"
          >
            Debug Console
          </button>
          <button
            onClick={() => {
              console.log('🧪 Simulating download flow...');
              // This will help test the data flow
              window.open('/download', '_blank');
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
          >
            Test Download Flow
          </button>
          <button
            onClick={async () => {
              console.log('📊 Creating test data...');
              try {
                await createTestData();
                console.log('✅ Test data created, refreshing...');
                setTimeout(() => fetchUserDetails(), 2000);
              } catch (error) {
                console.error('❌ Error creating test data:', error);
              }
            }}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
          >
            Create Test Data
          </button>
          <button
            onClick={async () => {
              console.log('🗑️ Clearing test data...');
              try {
                await clearTestData();
                console.log('✅ Test data cleared, refreshing...');
                setTimeout(() => fetchUserDetails(), 1000);
              } catch (error) {
                console.error('❌ Error clearing test data:', error);
              }
            }}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
          >
            Clear Test Data
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by email or UID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
          />
        </div>
        
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
        >
          <option value="all">All Roles</option>
          <option value="free">Free Users</option>
          <option value="premium">Premium Users</option>
        </select>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
          <option value="trial">Trial</option>
        </select>
      </div>

      {/* User List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>Users ({filteredUsers.length})</span>
          </h3>
          
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <Users className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p className="text-lg">No users found</p>
                <p className="text-sm">Users will appear here after they visit the download page</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg text-left text-sm">
                <p className="text-gray-300 mb-2">To see user data:</p>
                <ul className="text-gray-400 space-y-1">
                  <li>• Visit the download page while signed in</li>
                  <li>• Try to download the ISO</li>
                  <li>• Check browser console for data logs</li>
                  <li>• Verify Firebase collections exist</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user.uid}
                  onClick={() => setSelectedUser(user)}
                  className={`p-3 bg-gray-800/50 rounded-lg cursor-pointer transition-all hover:bg-gray-700/50 border ${
                    selectedUser?.uid === user.uid ? 'border-purple-500' : 'border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        user.subscriptionStatus === 'premium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <p className="text-white font-medium truncate max-w-[200px]">
                          {user.userEmail}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {user.userRole} • {user.subscriptionStatus}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-400 text-sm">{user.downloadCount} downloads</p>
                      <p className="text-gray-500 text-xs">
                        {user.lastDownloadDate?.toLocaleDateString() || 'Never'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* User Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <User className="w-5 h-5 text-green-400" />
            <span>User Details</span>
          </h3>
          
          {selectedUser ? (
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>Basic Information</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <p className="text-white">{selectedUser.userEmail}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Role:</span>
                    <p className="text-white flex items-center space-x-1">
                      {selectedUser.userRole === 'premium' ? (
                        <Crown className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <User className="w-4 h-4 text-green-400" />
                      )}
                      <span className="capitalize">{selectedUser.userRole}</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <p className="text-white capitalize">{selectedUser.subscriptionStatus}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Downloads:</span>
                    <p className="text-white">{selectedUser.downloadCount}</p>
                  </div>
                </div>
              </div>

              {/* IP & Network Info */}
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span>Network Information</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">IP Address:</span>
                    <p className="text-white font-mono">{selectedUser.ipInfo.ip}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">IP Version:</span>
                    <p className="text-white">{selectedUser.ipInfo.ipVersion}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Connection:</span>
                    <p className="text-white">{selectedUser.networkInfo.connectionType}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Timezone:</span>
                    <p className="text-white">{selectedUser.location.timezone}</p>
                  </div>
                </div>
              </div>

              {/* Device Info */}
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                  <Monitor className="w-4 h-4 text-orange-400" />
                  <span>Device Information</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Platform:</span>
                    <p className="text-white">{selectedUser.deviceInfo.platform}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Vendor:</span>
                    <p className="text-white">{selectedUser.deviceInfo.vendor}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Screen:</span>
                    <p className="text-white">{selectedUser.location.screenResolution}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Language:</span>
                    <p className="text-white">{selectedUser.location.language}</p>
                  </div>
                </div>
              </div>

              {/* Activity Info */}
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-red-400" />
                  <span>Activity Information</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Created:</span>
                    <p className="text-white">{selectedUser.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Last Download:</span>
                    <p className="text-white">
                      {selectedUser.lastDownloadDate?.toLocaleDateString() || 'Never'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Email Verified:</span>
                    <p className="text-white">
                      {selectedUser.emailVerified ? 'Yes' : 'No'}
                    </p>
                  </div>
                  {selectedUser.trialExpiry && (
                    <div>
                      <span className="text-gray-400">Trial Expires:</span>
                      <p className="text-white">{selectedUser.trialExpiry.toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              Select a user to view details
            </div>
          )}
        </motion.div>
      </div>

      {/* Download History */}
      {selectedUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <DownloadIcon className="w-5 h-5 text-green-400" />
            <span>Download History for {selectedUser.userEmail}</span>
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-gray-300 border-b border-gray-700">
                  <th className="p-2">Date</th>
                  <th className="p-2">Mirror</th>
                  <th className="p-2">Size</th>
                  <th className="p-2">Time</th>
                  <th className="p-2">IP Address</th>
                  <th className="p-2">Device</th>
                  <th className="p-2">Network</th>
                </tr>
              </thead>
              <tbody>
                {getUserDownloads(selectedUser.uid).map((download, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-800/50">
                    <td className="p-2 text-sm text-gray-300">
                      {download.timestamp.toDate().toLocaleString()}
                    </td>
                    <td className="p-2 text-sm text-blue-400">
                      {download.mirror}
                    </td>
                    <td className="p-2 text-sm text-gray-300">
                      {download.downloadSize}
                    </td>
                    <td className="p-2 text-sm text-gray-300">
                      {download.downloadTime}ms
                    </td>
                    <td className="p-2 text-sm text-purple-400 font-mono">
                      {download.ipInfo?.ip || 'N/A'}
                    </td>
                    <td className="p-2 text-sm text-gray-300">
                      {download.deviceInfo?.platform || 'N/A'}
                    </td>
                    <td className="p-2 text-sm text-gray-300">
                      {download.networkInfo?.connectionType || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={fetchUserDetails}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Refresh Data</span>
        </button>
        
        <button
          onClick={async () => {
            try {
              await exportUserData('csv');
            } catch (error) {
              console.error('Error exporting CSV:', error);
              alert('Failed to export CSV data');
            }
          }}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Export CSV</span>
        </button>
        
        <button
          onClick={async () => {
            try {
              await exportUserData('json');
            } catch (error) {
              console.error('Error exporting JSON:', error);
              alert('Failed to export JSON data');
            }
          }}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Export JSON</span>
        </button>
        
        <button
          onClick={() => {
            console.log('Current users:', users);
            console.log('Current downloads:', downloads);
            alert(`Debug info logged to console:\nUsers: ${users.length}\nDownloads: ${downloads.length}`);
          }}
          className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <Eye className="w-5 h-5" />
          <span>Debug Console</span>
        </button>
        
        <button
          onClick={createTestData}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <User className="w-5 h-5" />
          <span>Create Test Data</span>
        </button>
        
        <button
          onClick={clearTestData}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <Shield className="w-5 h-5" />
          <span>Clear Test Data</span>
        </button>
      </div>
    </div>
  );
};

export default UserDetailsDashboard;
