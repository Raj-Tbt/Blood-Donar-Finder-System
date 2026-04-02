/**
 * BloodGroupBadge Component
 *
 * Renders a circular badge displaying a blood group label
 * with a color-coded gradient background. Supports multiple sizes
 * and an optional pulsing animation for urgency indication.
 *
 * @param {Object} props
 * @param {string} props.group - Blood group label (e.g., 'A+', 'O-').
 * @param {string} [props.size='md'] - Badge size: 'sm', 'md', 'lg', or 'xl'.
 * @param {boolean} [props.pulse=false] - Enable pulsing animation.
 */

import { BLOOD_GROUP_COLORS } from '../utils/bloodGroups';

export default function BloodGroupBadge({ group, size = 'md', pulse = false }) {
  const color = BLOOD_GROUP_COLORS[group] || '#C0392B';

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl',
  };

  return (
    <div
      className={`blood-badge ${sizeClasses[size]} ${pulse ? 'animate-pulse-slow' : ''} shadow-lg`}
      style={{
        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
        boxShadow: `0 4px 14px ${color}40`,
      }}
    >
      {group}
    </div>
  );
}
