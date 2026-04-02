/**
 * Notifications Hook
 *
 * Custom React hook for notification-related API operations.
 * Provides methods for fetching notifications and marking them as read.
 *
 * @module hooks/useNotifications
 */

import { useState, useCallback } from 'react';
import api from '../utils/api';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  /** Fetch all notifications and the unread count for the current user */
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unread_count);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /** Mark all notifications as read and update local state */
  const markAllRead = useCallback(async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark notifications as read:', err);
    }
  }, []);

  return { notifications, unreadCount, loading, fetchNotifications, markAllRead };
}
