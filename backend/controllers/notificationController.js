/**
 * Notification Controller
 *
 * Manages user notifications including retrieval and bulk read status updates.
 *
 * @module controllers/notificationController
 */

const pool = require('../config/db');

/**
 * Retrieve notifications for the authenticated user.
 * Returns the 50 most recent notifications and the unread count.
 */
async function getNotifications(req, res) {
  try {
    const userId = req.user.id;
    const [notifications] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [userId]
    );

    const [unreadCount] = await pool.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );

    res.json({
      notifications,
      unread_count: unreadCount[0].count
    });
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * Mark all unread notifications as read for the authenticated user.
 */
async function markAllRead(req, res) {
  try {
    const userId = req.user.id;
    await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );
    res.json({ message: 'All notifications marked as read.' });
  } catch (err) {
    console.error('Mark all read error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
}

module.exports = {
  getNotifications,
  markAllRead
};
