/**
 * Register Page
 *
 * Multi-role registration form supporting donor, hospital, and admin accounts.
 * Donor registration includes blood group and weight fields.
 * Admin registration requires a secret key for authorization.
 */

import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiDroplet, FiActivity, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { BLOOD_GROUPS } from '../utils/bloodGroups';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAdminMode = searchParams.get('admin') === 'true';
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: isAdminMode ? 'admin' : 'donor',
    city: '',
    pincode: '',
    blood_group: '',
    weight_kg: '',
    admin_secret: '',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  /** Handle form submission and register the user */
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...form };
      if (data.weight_kg) data.weight_kg = parseFloat(data.weight_kg);
      await register(data);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blood-500 to-blood-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">BD</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
              Create Account
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Join the Blood Donor community
            </p>
          </div>

          {/* Role selector tabs */}
          <div className="flex rounded-xl bg-gray-100 dark:bg-dark-card p-1 mb-6">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'donor' })}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-1 ${
                form.role === 'donor'
                  ? 'bg-blood-500 text-white shadow-lg'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
            >
              <FiDroplet className="w-4 h-4" />
              <span>Donor</span>
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'hospital' })}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-1 ${
                form.role === 'hospital'
                  ? 'bg-blood-500 text-white shadow-lg'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
            >
              <FiActivity className="w-4 h-4" />
              <span>Hospital</span>
            </button>
            {isAdminMode && (
              <button
                type="button"
                onClick={() => setForm({ ...form, role: 'admin' })}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-1 ${
                  form.role === 'admin'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                <FiShield className="w-4 h-4" />
                <span>Admin</span>
              </button>
            )}
          </div>

          {/* Admin secret key field (visible only for admin role) */}
          {form.role === 'admin' && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl mb-4 border border-purple-200 dark:border-purple-800">
              <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-1.5">
                <FiShield className="inline w-4 h-4 mr-1" />
                Admin Secret Key
              </label>
              <input
                name="admin_secret"
                type="password"
                value={form.admin_secret}
                onChange={handleChange}
                className="input-field !py-2.5 text-sm"
                placeholder="Enter admin secret key"
                required
              />
              <p className="text-xs text-purple-500 dark:text-purple-400 mt-1.5">
                Contact the system administrator for the secret key.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {form.role === 'hospital' ? 'Hospital Name' : form.role === 'admin' ? 'Admin Name' : 'Full Name'}
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input name="name" value={form.name} onChange={handleChange} className="input-field !pl-10 !py-2.5 text-sm" placeholder="John Doe" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field !pl-10 !py-2.5 text-sm" placeholder="you@example.com" required />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input name="password" type="password" value={form.password} onChange={handleChange} className="input-field !pl-10 !py-2.5 text-sm" placeholder="Min 6 chars" required minLength={6} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input name="phone" value={form.phone} onChange={handleChange} className="input-field !pl-10 !py-2.5 text-sm" placeholder="9876543210" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input name="city" value={form.city} onChange={handleChange} className="input-field !pl-10 !py-2.5 text-sm" placeholder="Mumbai" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pincode</label>
                <input name="pincode" value={form.pincode} onChange={handleChange} className="input-field !py-2.5 text-sm" placeholder="400001" />
              </div>
            </div>

            {/* Donor-specific fields */}
            {form.role === 'donor' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-blood-50/50 dark:bg-blood-900/10 rounded-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <FiDroplet className="inline w-4 h-4 mr-1 text-blood-500" />
                    Blood Group
                  </label>
                  <select name="blood_group" value={form.blood_group} onChange={handleChange} className="input-field !py-2.5 text-sm" required>
                    <option value="">Select</option>
                    {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <FiActivity className="inline w-4 h-4 mr-1 text-blood-500" />
                    Weight (kg)
                  </label>
                  <input name="weight_kg" type="number" value={form.weight_kg} onChange={handleChange} className="input-field !py-2.5 text-sm" placeholder="60" min="0" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blood-500 hover:text-blood-700 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
