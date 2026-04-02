/**
 * Post Request Page
 *
 * Form for hospitals to create new blood requests.
 * Supports blood group selection, unit count, urgency level,
 * and an optional description. Critical requests trigger email alerts.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSend, FiAlertTriangle } from 'react-icons/fi';
import { BLOOD_GROUPS } from '../utils/bloodGroups';
import { useRequests } from '../hooks/useRequests';
import toast from 'react-hot-toast';

export default function PostRequest() {
  const navigate = useNavigate();
  const { createRequest } = useRequests();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ blood_group: '', units_needed: 1, urgency: 'medium', description: '' });

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  /** Submit the blood request form */
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await createRequest({ ...form, units_needed: parseInt(form.units_needed) });
      toast.success('Blood request posted successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post request');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-heading text-center mb-2">Post Blood Request</h1>
          <p className="section-subheading text-center mb-8">Find matching donors for your patients</p>

          <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Blood Group Needed</label>
                <select name="blood_group" value={form.blood_group} onChange={handleChange} className="input-field" required>
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Units Needed</label>
                  <input name="units_needed" type="number" min="1" max="20" value={form.units_needed} onChange={handleChange} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Urgency</label>
                  <select name="urgency" value={form.urgency} onChange={handleChange} className="input-field">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field" placeholder="Additional details about the request..." />
              </div>

              {/* Critical urgency notice */}
              {form.urgency === 'critical' && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-sm text-red-600 dark:text-red-400 flex items-center space-x-2">
                  <FiAlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Critical requests will send email alerts to matching eligible donors.</span>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiSend className="w-5 h-5" /><span>Post Request</span></>}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
