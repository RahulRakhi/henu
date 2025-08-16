import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Users, 
  Eye, 
  TrendingUp, 
  Globe, 
  Monitor,
  Calendar,
  BarChart3
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
import { db } from '../services/firebase';

interface AnalyticsData {
  totalDownloads: number;
  totalPageViews: number;
  uniqueUsers: number;
  downloadsToday: number;
  pageViewsToday: number;
  topMirrors: Array<{ mirror: string; count: number }>;
  userEngagement: Array<{ action: string; count: number }>;
  recentActivity: Array<{
    type: string;
    timestamp: Timestamp;
    details: any;
  }>;
}

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get downloads data
      const downloadsRef = collection(db, 'downloads');
      const downloadsQuery = query(
        downloadsRef,
        where('timestamp', '>=', Timestamp.fromDate(today)),
        orderBy('timestamp', 'desc')
      );
      const downloadsSnapshot = await getDocs(downloadsQuery);
      
      // Get page views data
      const pageViewsRef = collection(db, 'page_views');
      const pageViewsQuery = query(
        pageViewsRef,
        where('timestamp', '>=', Timestamp.fromDate(today)),
        orderBy('timestamp', 'desc')
      );
      const pageViewsSnapshot = await getDocs(pageViewsQuery);
      
      // Get download attempts data
      const attemptsRef = collection(db, 'download_attempts');
      const attemptsQuery = query(
        attemptsRef,
        where('timestamp', '>=', Timestamp.fromDate(today)),
        orderBy('timestamp', 'desc')
      );
      const attemptsSnapshot = await getDocs(attemptsQuery);
      
      // Get user engagement data
      const engagementRef = collection(db, 'user_engagement');
      const engagementQuery = query(
        engagementRef,
        where('timestamp', '>=', Timestamp.fromDate(today)),
        orderBy('timestamp', 'desc')
      );
      const engagementSnapshot = await getDocs(engagementQuery);
      
      // Process data
      const downloads = downloadsSnapshot.docs.map(doc => doc.data());
      const pageViews = pageViewsSnapshot.docs.map(doc => doc.data());
      const attempts = attemptsSnapshot.docs.map(doc => doc.data());
      const engagement = engagementSnapshot.docs.map(doc => doc.data());
      
      // Calculate unique users
      const uniqueUserIds = new Set([
        ...downloads.map(d => d.uid),
        ...pageViews.map(p => p.uid),
        ...attempts.map(a => a.uid),
        ...engagement.map(e => e.uid)
      ].filter(Boolean));
      
      // Calculate top mirrors
      const mirrorCounts: Record<string, number> = {};
      attempts.forEach(attempt => {
        const mirror = attempt.mirror || 'unknown';
        mirrorCounts[mirror] = (mirrorCounts[mirror] || 0) + 1;
      });
      
      const topMirrors = Object.entries(mirrorCounts)
        .map(([mirror, count]) => ({ mirror, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      // Calculate user engagement actions
      const actionCounts: Record<string, number> = {};
      engagement.forEach(eng => {
        const action = eng.action || 'unknown';
        actionCounts[action] = (actionCounts[action] || 0) + 1;
      });
      
      const userEngagement = Object.entries(actionCounts)
        .map(([action, count]) => ({ action, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      // Get recent activity
      const allActivity = [
        ...downloads.map(d => ({ type: 'download', timestamp: d.timestamp, details: d })),
        ...pageViews.map(p => ({ type: 'page_view', timestamp: p.timestamp, details: p })),
        ...attempts.map(a => ({ type: 'download_attempt', timestamp: a.timestamp, details: a })),
        ...engagement.map(e => ({ type: 'engagement', timestamp: e.timestamp, details: e }))
      ].sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis())
       .slice(0, 10);
      
      setAnalyticsData({
        totalDownloads: downloads.length,
        totalPageViews: pageViews.length,
        uniqueUsers: uniqueUserIds.size,
        downloadsToday: downloads.length,
        pageViewsToday: pageViews.length,
        topMirrors,
        userEngagement,
        recentActivity: allActivity
      });
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center text-gray-400 py-8">
        No analytics data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h2>
        <p className="text-gray-400">Track downloads, page views, and user engagement</p>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-center space-x-2">
        {(['today', 'week', 'month'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeRange === range
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 p-6 rounded-xl border border-blue-500/30"
        >
          <div className="flex items-center space-x-3">
            <Download className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-blue-300 text-sm">Downloads Today</p>
              <p className="text-2xl font-bold text-white">{analyticsData.downloadsToday}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-900/50 to-green-800/50 p-6 rounded-xl border border-green-500/30"
        >
          <div className="flex items-center space-x-3">
            <Eye className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-green-300 text-sm">Page Views Today</p>
              <p className="text-2xl font-bold text-white">{analyticsData.pageViewsToday}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 p-6 rounded-xl border border-purple-500/30"
        >
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-purple-300 text-sm">Unique Users</p>
              <p className="text-2xl font-bold text-white">{analyticsData.uniqueUsers}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 p-6 rounded-xl border border-orange-500/30"
        >
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-orange-400" />
            <div>
              <p className="text-orange-300 text-sm">Total Downloads</p>
              <p className="text-2xl font-bold text-white">{analyticsData.totalDownloads}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Download Mirrors */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-400" />
            <span>Top Download Mirrors</span>
          </h3>
          <div className="space-y-3">
            {analyticsData.topMirrors.map((mirror, index) => (
              <div key={mirror.mirror} className="flex items-center justify-between">
                <span className="text-gray-300 capitalize">{mirror.mirror.replace('_', ' ')}</span>
                <span className="text-blue-400 font-semibold">{mirror.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* User Engagement */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-green-400" />
            <span>User Engagement</span>
          </h3>
          <div className="space-y-3">
            {analyticsData.userEngagement.map((eng, index) => (
              <div key={eng.action} className="flex items-center justify-between">
                <span className="text-gray-300 capitalize">{eng.action.replace(/_/g, ' ')}</span>
                <span className="text-green-400 font-semibold">{eng.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50"
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          <span>Recent Activity</span>
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {analyticsData.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'download' ? 'bg-green-500' :
                  activity.type === 'page_view' ? 'bg-blue-500' :
                  activity.type === 'download_attempt' ? 'bg-yellow-500' :
                  'bg-purple-500'
                }`} />
                <span className="text-gray-300 capitalize">{activity.type.replace(/_/g, ' ')}</span>
              </div>
              <span className="text-gray-400 text-sm">
                {activity.timestamp.toDate().toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchAnalyticsData}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
        >
          <BarChart3 className="w-5 h-5" />
          <span>Refresh Analytics</span>
        </button>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

