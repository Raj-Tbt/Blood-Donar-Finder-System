/**
 * RequestCard Component
 *
 * Displays a blood request summary card with urgency indicators,
 * status badges, unit count, and an urgency countdown timer for critical requests.
 *
 * @param {Object} props
 * @param {Object} props.request - Blood request data object.
 * @param {number} [props.index=0] - Card index for staggered animation delay.
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiDroplet } from 'react-icons/fi';
import BloodGroupBadge from './BloodGroupBadge';
import UrgencyTimer from './UrgencyTimer';

export default function RequestCard({ request, index = 0 }) {
  const urgencyStyles = {
    low: 'urgency-low',
    medium: 'urgency-medium',
    critical: 'urgency-critical',
  };

  const statusStyles = {
    open: 'status-open',
    fulfilled: 'status-fulfilled',
    closed: 'status-closed',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`card-hover p-6 relative overflow-hidden ${
        request.urgency === 'critical' ? 'ring-2 ring-red-300 dark:ring-red-800' : ''
      }`}
    >
      {/* Pulsing indicator for critical requests */}
      {request.urgency === 'critical' && (
        <div className="absolute top-3 right-3">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <BloodGroupBadge group={request.blood_group} size="md" pulse={request.urgency === 'critical'} />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {request.blood_group} Blood Needed
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-0.5">
              <FiMapPin className="w-3.5 h-3.5 mr-1" />
              {request.hospital_name || 'Hospital'} {request.hospital_city ? `\u2022 ${request.hospital_city}` : ''}
            </p>
          </div>
        </div>
      </div>

      {request.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {request.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`badge-pill text-xs ${urgencyStyles[request.urgency]}`}>
          {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
        </span>
        <span className={`badge-pill text-xs ${statusStyles[request.status]}`}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
        <span className="badge-pill text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          <FiDroplet className="w-3 h-3 mr-1 inline" />
          {request.units_needed} unit{request.units_needed > 1 ? 's' : ''}
        </span>
      </div>

      {request.urgency === 'critical' && request.status === 'open' && (
        <UrgencyTimer createdAt={request.created_at} />
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <span className="text-xs text-gray-400">
          <FiClock className="w-3 h-3 inline mr-1" />
          {new Date(request.created_at).toLocaleDateString('en-IN', {
            month: 'short', day: 'numeric', year: 'numeric'
          })}
        </span>
        <Link
          to={`/requests/${request.id}`}
          className="text-sm font-medium text-blood-500 hover:text-blood-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}
