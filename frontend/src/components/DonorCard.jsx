/**
 * DonorCard Component
 *
 * Displays a summary card for a single donor with avatar, blood group,
 * location, donation count, availability status, and a link to their profile.
 *
 * @param {Object} props
 * @param {Object} props.donor - Donor data object.
 * @param {number} [props.index=0] - Card index for staggered animation delay.
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiDroplet, FiCalendar } from 'react-icons/fi';
import BloodGroupBadge from './BloodGroupBadge';
import { getInitials, formatDate } from '../utils/bloodGroups';

export default function DonorCard({ donor, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="card-hover p-6 relative overflow-hidden group"
    >
      {/* Top accent bar — reveals on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blood-500 to-blood-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      <div className="flex items-start space-x-4">
        {/* Donor avatar */}
        <div className="flex-shrink-0">
          {donor.avatar_url ? (
            <img
              src={donor.avatar_url}
              alt={donor.name}
              className="w-14 h-14 rounded-2xl object-cover"
            />
          ) : (
            <div className="w-14 h-14 bg-gradient-to-br from-blood-400 to-blood-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blood-500/20">
              <span className="text-white font-bold text-lg">
                {getInitials(donor.name)}
              </span>
            </div>
          )}
        </div>

        {/* Donor details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {donor.name}
            </h3>
            <BloodGroupBadge group={donor.blood_group} size="sm" />
          </div>

          <div className="mt-2 space-y-1.5">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <FiMapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
              <span className="truncate">{donor.city || 'Unknown'}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <FiCalendar className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
              <span>Last donated: {formatDate(donor.last_donated_date)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <FiDroplet className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
              <span>{donor.total_donations} donations</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span
              className={`badge-pill text-xs ${
                donor.is_available
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-700/30 dark:text-gray-400'
              }`}
            >
              {donor.is_available ? 'Available' : 'Unavailable'}
            </span>
            <Link
              to={`/donors/${donor.donor_id || donor.id}`}
              className="text-sm font-medium text-blood-500 hover:text-blood-700 transition-colors"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
