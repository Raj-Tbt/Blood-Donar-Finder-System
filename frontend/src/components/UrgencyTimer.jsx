/**
 * UrgencyTimer Component
 *
 * Live countdown timer for critical blood requests.
 * Displays the time remaining until a configurable deadline
 * (default: 24 hours from creation). Updates every second.
 *
 * @param {Object} props
 * @param {string} props.createdAt - ISO timestamp of when the request was created.
 * @param {number} [props.hoursLimit=24] - Number of hours until the deadline.
 */

import { useState, useEffect } from 'react';
import { FiClock } from 'react-icons/fi';

export default function UrgencyTimer({ createdAt, hoursLimit = 24 }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    /** Calculate and update the remaining time */
    function updateTimer() {
      const created = new Date(createdAt);
      const deadline = new Date(created.getTime() + hoursLimit * 60 * 60 * 1000);
      const now = new Date();
      const diff = deadline - now;

      if (diff <= 0) {
        setExpired(true);
        setTimeLeft('EXPIRED');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [createdAt, hoursLimit]);

  return (
    <div
      className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-mono font-semibold ${
        expired
          ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
          : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 animate-pulse-slow'
      }`}
    >
      <FiClock className="w-4 h-4" />
      <span>
        {expired ? 'Time expired' : `Needed in ${timeLeft}`}
      </span>
    </div>
  );
}
