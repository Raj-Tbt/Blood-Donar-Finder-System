/**
 * BadgeDisplay Component
 *
 * Renders a grid of donor achievement badges with optional
 * spring animations. Displays a placeholder if no badges exist.
 *
 * @param {Object} props
 * @param {Array} [props.badges=[]] - Array of badge objects from the API.
 * @param {boolean} [props.animate=false] - Whether to animate badge entry.
 */

import { motion } from 'framer-motion';
import { FiAward } from 'react-icons/fi';

/** Badge metadata mapping: display name to visual properties */
const BADGE_INFO = {
  'First Drop': {
    icon: <FiAward className="w-8 h-8 text-blue-500" />,
    color: 'from-blue-400 to-blue-600',
    description: 'Completed your first donation',
  },
  'Life Saver': {
    icon: <FiAward className="w-8 h-8 text-yellow-500" />,
    color: 'from-gold-400 to-gold-600',
    description: '5 confirmed donations',
  },
  'Hero': {
    icon: <FiAward className="w-8 h-8 text-purple-500" />,
    color: 'from-purple-400 to-purple-600',
    description: '10 confirmed donations — legendary!',
  },
};

export default function BadgeDisplay({ badges = [], animate = false }) {
  if (badges.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <FiAward className="w-12 h-12 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No badges earned yet. Start donating!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {badges.map((badge, i) => {
        const info = BADGE_INFO[badge.badge_name] || {
          icon: <FiAward className="w-8 h-8 text-gray-500" />,
          color: 'from-gray-400 to-gray-600',
          description: badge.badge_name,
        };

        return (
          <motion.div
            key={badge.id}
            initial={animate ? { scale: 0, rotate: -180 } : false}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: i * 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="relative group"
          >
            <div className="card-hover p-5 text-center">
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />

              <div className="mb-3 flex justify-center">{info.icon}</div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                {badge.badge_name}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {info.description}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(badge.awarded_at).toLocaleDateString('en-IN', {
                  month: 'short', day: 'numeric', year: 'numeric'
                })}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
