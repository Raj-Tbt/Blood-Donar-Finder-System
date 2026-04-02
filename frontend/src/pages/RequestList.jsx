/**
 * Request List Page
 *
 * Displays all open blood requests with filtering options
 * for blood group and urgency level.
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiCheckCircle } from 'react-icons/fi';
import RequestCard from '../components/RequestCard';
import { useRequests } from '../hooks/useRequests';
import { BLOOD_GROUPS } from '../utils/bloodGroups';

export default function RequestList() {
  const { requests, loading, fetchRequests } = useRequests();
  const [bloodGroup, setBloodGroup] = useState('');
  const [urgency, setUrgency] = useState('');

  /* Load all open requests on initial mount */
  useEffect(() => {
    fetchRequests();
  }, []);

  /** Apply filters and refresh the request list */
  function handleFilter(e) {
    e.preventDefault();
    fetchRequests({ blood_group: bloodGroup, urgency });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="section-heading">Blood Requests</h1>
          <p className="section-subheading">Active requests from hospitals. Help save a life today.</p>
        </motion.div>

        {/* Filter controls */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleFilter}
          className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg p-4 md:p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className="input-field">
                <option value="">All Blood Groups</option>
                {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <select value={urgency} onChange={e => setUrgency(e.target.value)} className="input-field">
                <option value="">All Urgency Levels</option>
                <option value="critical">Critical</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <button type="submit" className="btn-primary flex items-center space-x-2">
              <FiFilter className="w-5 h-5" />
              <span>Filter</span>
            </button>
          </div>
        </motion.form>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blood-200 border-t-blood-500 rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20">
            <FiCheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No open requests</h3>
            <p className="text-gray-400">All blood requests have been fulfilled!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req, i) => (
              <RequestCard key={req.id} request={req} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
