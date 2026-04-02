/**
 * Admin Dashboard Page
 *
 * Displays system-wide statistics, blood group distribution chart,
 * donation trends, and a user management table. Restricted to admin users.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiDroplet, FiActivity, FiTrendingUp } from 'react-icons/fi';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import api from '../utils/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Fetch admin statistics and user list on mount */
  useEffect(() => {
    Promise.all([api.get('/admin/stats'), api.get('/admin/users')])
      .then(([s, u]) => { setStats(s.data); setUsers(u.data.users); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><div className="w-10 h-10 border-4 border-blood-200 border-t-blood-500 rounded-full animate-spin" /></div>;

  /** Bar chart data: blood group distribution */
  const barData = {
    labels: stats?.bloodGroupCounts?.map(b => b.blood_group) || [],
    datasets: [{
      label: 'Donors',
      data: stats?.bloodGroupCounts?.map(b => b.count) || [],
      backgroundColor: ['#E74C3C', '#C0392B', '#3498DB', '#2980B9', '#27AE60', '#229954', '#9B59B6', '#8E44AD'],
      borderRadius: 8,
    }]
  };

  /** Line chart data: donations over the last 30 days */
  const lineData = {
    labels: stats?.donationsOverTime?.map(d => new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })) || [],
    datasets: [{
      label: 'Donations',
      data: stats?.donationsOverTime?.map(d => d.count) || [],
      borderColor: '#C0392B',
      backgroundColor: 'rgba(192,57,43,0.1)',
      fill: true, tension: 0.4, pointRadius: 4,
    }]
  };

  const chartOpts = { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-heading mb-8">Admin Dashboard</h1>
        </motion.div>

        {/* Key metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: <FiUsers />, val: stats?.totalDonors, label: 'Total Donors', color: 'blood' },
            { icon: <FiDroplet />, val: stats?.totalRequests, label: 'Total Requests', color: 'blue' },
            { icon: <FiActivity />, val: `${stats?.fulfillmentRate}%`, label: 'Fulfillment Rate', color: 'green' },
            { icon: <FiTrendingUp />, val: stats?.confirmedDonations, label: 'Confirmed Donations', color: 'purple' },
          ].map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card-hover p-6">
              <div className="text-blood-500 text-2xl mb-2">{m.icon}</div>
              <div className="font-display text-3xl font-bold text-gray-900 dark:text-white">{m.val}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{m.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card-hover p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Blood Group Distribution</h3>
            <Bar data={barData} options={chartOpts} />
          </div>
          <div className="card-hover p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Donations (Last 30 Days)</h3>
            <Line data={lineData} options={chartOpts} />
          </div>
        </div>

        {/* User management table */}
        <div className="card-hover overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">User Management ({users.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-dark-card">
                <tr>
                  {['Name', 'Email', 'Role', 'City', 'Blood', 'Donations', 'Joined'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-dark-card transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{u.name}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3"><span className={`badge-pill text-xs ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : u.role === 'hospital' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>{u.role}</span></td>
                    <td className="px-4 py-3 text-gray-500">{u.city || '—'}</td>
                    <td className="px-4 py-3 font-semibold text-blood-500">{u.blood_group || '—'}</td>
                    <td className="px-4 py-3">{u.total_donations ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
