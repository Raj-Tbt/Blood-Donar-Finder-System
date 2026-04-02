/**
 * Hospital Dashboard Page
 *
 * Displays a hospital's blood requests with summary statistics
 * and a link to create new requests. Shows total, open, and fulfilled counts.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiList, FiClock, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import RequestCard from '../components/RequestCard';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function HospitalDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Fetch the hospital's blood requests on mount */
  useEffect(() => { fetchMyRequests(); }, []);

  /** Fetch all requests and filter to those belonging to the current hospital */
  async function fetchMyRequests() {
    try {
      const res = await api.get('/requests?status=');
      setRequests(res.data.requests.filter(r => r.hospital_id === user?.id));
    } catch { toast.error('Failed to load'); } finally { setLoading(false); }
  }

  const openCount = requests.filter(r => r.status === 'open').length;
  const fulfilledCount = requests.filter(r => r.status === 'fulfilled').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with post request action */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h1 className="section-heading">Hospital Dashboard</h1>
            <p className="section-subheading">Welcome, {user?.name}</p>
          </div>
          <Link to="/dashboard/post" className="btn-primary flex items-center space-x-2 mt-4 md:mt-0">
            <FiPlus className="w-5 h-5" /><span>Post Blood Request</span>
          </Link>
        </motion.div>

        {/* Summary statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: <FiList />, val: requests.length, label: 'Total Requests', bg: 'blue' },
            { icon: <FiClock />, val: openCount, label: 'Open', bg: 'yellow' },
            { icon: <FiCheckCircle />, val: fulfilledCount, label: 'Fulfilled', bg: 'green' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card-hover p-6 flex items-center space-x-4">
              <div className={`p-3 bg-${s.bg}-100 dark:bg-${s.bg}-900/30 rounded-xl text-${s.bg}-600 dark:text-${s.bg}-400`}>{s.icon}</div>
              <div>
                <div className="font-display text-2xl font-bold text-gray-900 dark:text-white">{s.val}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Request list */}
        <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4">My Requests</h2>
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blood-200 border-t-blood-500 rounded-full animate-spin" /></div>
        ) : requests.length === 0 ? (
          <div className="card-hover p-12 text-center">
            <FiList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No requests yet.</p>
            <Link to="/dashboard/post" className="btn-primary inline-flex items-center space-x-2"><FiPlus className="w-5 h-5" /><span>Post Request</span></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req, i) => <RequestCard key={req.id} request={req} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
