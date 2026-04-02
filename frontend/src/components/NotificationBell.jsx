/**
 * NotificationBell Component
 *
 * Displays a bell icon with unread notification count badge.
 * Opens a dropdown panel listing recent notifications with
 * read/unread state and a "mark all read" action.
 */

import { useState, useEffect, useRef } from 'react';
import { FiBell, FiCheck, FiAlertCircle, FiAward, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../context/AuthContext';

export default function NotificationBell() {
  const { user } = useAuth();
  const { notifications, unreadCount, fetchNotifications, markAllRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  /* Fetch notifications when the user is available */
  useEffect(() => {
    if (user) fetchNotifications();
  }, [user, fetchNotifications]);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /** Returns the appropriate icon component for a notification type */
  const getTypeIcon = (type) => {
    switch (type) {
      case 'alert': return <FiAlertCircle className="w-4 h-4 text-red-500" />;
      case 'badge': return <FiAward className="w-4 h-4 text-yellow-500" />;
      default: return <FiCheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface transition-all"
      >
        <FiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blood-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-surface rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
          >
            {/* Dropdown header */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-blood-500 hover:text-blood-700 flex items-center space-x-1"
                >
                  <FiCheck className="w-3 h-3" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-400">
                  <FiBell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.slice(0, 10).map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-dark-card transition-colors ${
                      !notif.is_read ? 'bg-blood-50/50 dark:bg-blood-900/10' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="mt-0.5">{getTypeIcon(notif.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notif.created_at).toLocaleDateString('en-IN', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {!notif.is_read && (
                        <div className="w-2 h-2 bg-blood-500 rounded-full mt-2 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
