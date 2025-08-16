import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import UserDetailsDashboard from '../components/UserDetailsDashboard';

const ADMIN_EMAIL = 'rsurendrasen90@gmail.com'; // Change to your admin email

const Admin = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Fetch all team applications from Realtime Database
  useEffect(() => {
    if (user && user.email === ADMIN_EMAIL) {
      setLoading(true);
      const db = getDatabase();
      
      // Team applications from Realtime Database
      const applicationsRef = ref(db, 'team_applications');
      const applicationsUnsubscribe = onValue(applicationsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const appsArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          })).sort((a, b) => {
            // Sort by timestamp descending (newest first)
            const timeA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
            const timeB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
            return timeB - timeA;
          });
          setApplications(appsArray);
        } else {
          setApplications([]);
        }
      });
      
      // Community feedback from Realtime Database
      const feedbackRef = ref(db, 'community_feedback');
      const feedbackUnsubscribe = onValue(feedbackRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const feedbackArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          })).sort((a, b) => {
            const timeA = a.timestamp || 0;
            const timeB = b.timestamp || 0;
            return timeB - timeA;
          });
          setDownloads(feedbackArray); // Reusing downloads state for feedback
        } else {
          setDownloads([]);
        }
      });
      
      // Visitor counter from Realtime Database
      const counterRef = ref(db, 'meta/visitorCounter');
      const counterUnsubscribe = onValue(counterRef, (snapshot) => {
        if (snapshot.exists()) {
          setVisitorCount(snapshot.val().count || 0);
        } else {
          setVisitorCount(0);
        }
        setLoading(false);
      });
      
      // Cleanup listeners
      return () => {
        applicationsUnsubscribe();
        feedbackUnsubscribe();
        counterUnsubscribe();
      };
    }
  }, [user]);

  // Show login or unauthorized message
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-2xl text-gray-700">Please sign in as admin to view this page.</div>;
  }
  if (user.email !== ADMIN_EMAIL) {
    return <div className="min-h-screen flex items-center justify-center text-2xl text-red-600">Unauthorized: Admin access only.</div>;
  }

        return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-purple-300">Admin Dashboard</h1>
        {loading ? (
          <div className="text-center text-lg text-gray-400">Loading...</div>
        ) : (
          <>
            <div className="mb-10 p-6 bg-gray-800/60 rounded-xl shadow-lg text-white flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="text-2xl font-semibold">Visitor Count: <span className="text-pink-400">{visitorCount}</span></div>
              <button
                className="mt-4 md:mt-0 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                onClick={async () => {
                  const db = getDatabase();
                  const counterRef = ref(db, 'meta/visitorCounter');
                  const currentCount = visitorCount || 0;
                  await set(counterRef, { count: currentCount + 1 });
                  setVisitorCount(currentCount + 1);
                }}
              >Increment Counter (Test)</button>
            </div>
            
            {/* Analytics Dashboard */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-purple-200">Download Analytics</h2>
              <div className="bg-gray-900/80 rounded-xl p-6">
                <AnalyticsDashboard />
              </div>
            </div>
            
            {/* User Details Dashboard */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-purple-200">User Details & Download History</h2>
              <div className="bg-gray-900/80 rounded-xl p-6">
                <UserDetailsDashboard />
              </div>
            </div>
            
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-purple-200">Team Applications</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-900/80 rounded-xl">
                  <thead>
                    <tr className="text-purple-300 text-left">
                      <th className="p-2">Name</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Phone</th>
                      <th className="p-2">Address</th>
                      <th className="p-2">Skills</th>
                      <th className="p-2">Photo</th>
                      <th className="p-2">Resume</th>
                      <th className="p-2">Submitted At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id} className="border-b border-gray-700 hover:bg-gray-800/60">
                        <td className="p-2">{app.name}</td>
                        <td className="p-2">{app.email}</td>
                        <td className="p-2">{app.phone}</td>
                        <td className="p-2">{app.address}</td>
                        <td className="p-2">{Array.isArray(app.skills) ? app.skills.join(', ') : app.skills}</td>
                        <td className="p-2">
                          {app.photoURL ? <a href={app.photoURL} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">View</a> : '—'}
                        </td>
                        <td className="p-2">
                          {app.resumeURL ? <a href={app.resumeURL} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">View</a> : '—'}
                        </td>
                        <td className="p-2">{app.submittedAt ? new Date(app.submittedAt).toLocaleString() : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-purple-200">Community Feedback</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-900/80 rounded-xl">
                  <thead>
                    <tr className="text-pink-300 text-left">
                      <th className="p-2">Type</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Subject</th>
                      <th className="p-2">Message</th>
                      <th className="p-2">File</th>
                      <th className="p-2">Submitted At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {downloads.map(feedback => (
                      <tr key={feedback.id} className="border-b border-gray-700 hover:bg-gray-800/60">
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            feedback.type === 'bug' ? 'bg-red-900/50 text-red-300' :
                            feedback.type === 'suggestion' ? 'bg-blue-900/50 text-blue-300' :
                            feedback.type === 'query' ? 'bg-yellow-900/50 text-yellow-300' :
                            'bg-green-900/50 text-green-300'
                          }`}>
                            {feedback.type}
                          </span>
                        </td>
                        <td className="p-2">{feedback.email}</td>
                        <td className="p-2 max-w-xs truncate">{feedback.subject}</td>
                        <td className="p-2 max-w-xs truncate">{feedback.message}</td>
                        <td className="p-2">
                          {feedback.fileName ? (
                            <span className="text-blue-400 text-sm">
                              {feedback.fileName}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="p-2">
                          {feedback.submittedAt ? new Date(feedback.submittedAt).toLocaleString() : 
                           feedback.timestamp ? new Date(feedback.timestamp).toLocaleString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
