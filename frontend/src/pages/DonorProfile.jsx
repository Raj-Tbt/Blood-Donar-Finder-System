/**
 * Donor Profile Page
 *
 * Displays a detailed donor profile including personal information,
 * blood group, donation statistics, earned badges, and donation history.
 * Profile owners can toggle their availability status.
 */

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiCalendar, FiDroplet, FiClock, FiToggleLeft, FiToggleRight, FiAward } from 'react-icons/fi';
import { useDonors } from '../hooks/useDonors';
import { useAuth } from '../context/AuthContext';
import BloodGroupBadge from '../components/BloodGroupBadge';
import BadgeDisplay from '../components/BadgeDisplay';
import { formatDate, daysSince, getInitials } from '../utils/bloodGroups';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function DonorProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const { donor, loading, error, getDonorProfile } = useDonors();
  const [toggling, setToggling] = useState(false);

  /* Fetch donor profile on mount or when ID changes */
  useEffect(() => {
    getDonorProfile(id);
  }, [id]);

  /** Toggle the donor's availability status via API */
  async function handleToggle() {
    setToggling(true);
    try {
      const res = await api.put('/donors/toggle-availability');
      toast.success(res.data.message);
      getDonorProfile(id);
    } catch (err) {
      toast.error('Failed to toggle availability');
    } finally {
      setToggling(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg pt-16">
        <div className="w-10 h-10 border-4 border-blood-200 border-t-blood-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !donor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300">Donor Not Found</h2>
          <Link to="/donors" className="text-blood-500 hover:underline mt-4 inline-block">Back to Search</Link>
        </div>
      </div>
    );
  }

  const d = donor.donor;
  const days = daysSince(d.last_donated_date);
  const daysUntilEligible = days !== null ? Math.max(0, 56 - days) : 0;
  const isOwner = user?.id === d.user_id;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-surface rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Gradient banner */}
          <div className="h-32 bg-gradient-to-r from-blood-500 to-blood-800 relative">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2" />
            </div>
          </div>

          <div className="px-6 md:px-10 pb-8 -mt-16 relative">
            <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {d.avatar_url ? (
                  <img src={d.avatar_url} alt={d.name} className="w-28 h-28 rounded-3xl border-4 border-white dark:border-dark-surface shadow-xl object-cover" />
                ) : (
                  <div className="w-28 h-28 bg-gradient-to-br from-blood-400 to-blood-600 rounded-3xl border-4 border-white dark:border-dark-surface shadow-xl flex items-center justify-center">
                    <span className="text-white font-bold text-3xl">{getInitials(d.name)}</span>
                  </div>
                )}
              </div>

              {/* Name and contact details */}
              <div className="mt-4 md:mt-0 flex-1">
                <div className="flex items-center space-x-3">
                  <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">{d.name}</h1>
                  <BloodGroupBadge group={d.blood_group} size="sm" />
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {d.city && (
                    <span className="flex items-center"><FiMapPin className="w-4 h-4 mr-1" />{d.city}</span>
                  )}
                  {d.phone && (
                    <span className="flex items-center"><FiPhone className="w-4 h-4 mr-1" />{d.phone}</span>
                  )}
                  {d.email && (
                    <span className="flex items-center"><FiMail className="w-4 h-4 mr-1" />{d.email}</span>
                  )}
                </div>
              </div>

              {/* Availability toggle (visible only for profile owner) */}
              {isOwner && (
                <button
                  onClick={handleToggle}
                  disabled={toggling}
                  className={`mt-4 md:mt-0 flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    d.is_available
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {d.is_available ? <FiToggleRight className="w-5 h-5" /> : <FiToggleLeft className="w-5 h-5" />}
                  <span>{d.is_available ? 'Available' : 'Unavailable'}</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-hover p-6 text-center">
            <FiDroplet className="w-8 h-8 text-blood-500 mx-auto mb-2" />
            <div className="font-display text-3xl font-bold text-gray-900 dark:text-white">{d.total_donations}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Donations</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-hover p-6 text-center">
            <FiCalendar className="w-8 h-8 text-blood-500 mx-auto mb-2" />
            <div className="font-display text-3xl font-bold text-gray-900 dark:text-white">{days ?? '—'}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Days Since Last Donation</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-hover p-6 text-center">
            <FiClock className="w-8 h-8 mx-auto mb-2" style={{ color: daysUntilEligible > 0 ? '#E74C3C' : '#27AE60' }} />
            <div className="font-display text-3xl font-bold text-gray-900 dark:text-white">
              {daysUntilEligible > 0 ? `${daysUntilEligible}d` : 'Eligible'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {daysUntilEligible > 0 ? 'Days Until Eligible' : 'Eligible Now'}
            </div>
          </motion.div>
        </div>

        {/* Badges section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8">
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <FiAward className="w-5 h-5 text-blood-500" />
            <span>Badges</span>
          </h2>
          <BadgeDisplay badges={donor.badges} animate />
        </motion.div>

        {/* Donation history */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8">
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <FiDroplet className="w-5 h-5 text-blood-500" />
            <span>Donation History</span>
          </h2>
          {donor.donations && donor.donations.length > 0 ? (
            <div className="space-y-4">
              {donor.donations.map((dn, i) => (
                <div key={dn.id} className="card-hover p-4 flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${dn.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {dn.blood_group} — {dn.units} unit{dn.units > 1 ? 's' : ''} to{' '}
                      <span className="text-blood-500">{dn.hospital_name}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(dn.donated_at)} — {dn.urgency} urgency
                    </p>
                  </div>
                  <span className={`badge-pill text-xs ${dn.status === 'confirmed' ? 'status-fulfilled' : 'urgency-medium'}`}>
                    {dn.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-hover p-8 text-center text-gray-400">
              <p>No donations recorded yet.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
