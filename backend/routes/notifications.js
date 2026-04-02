/**
 * Notification Routes
 *
 * Defines endpoints for retrieving user notifications
 * and marking them as read. All routes require authentication.
 *
 * @module routes/notifications
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getNotifications, markAllRead } = require('../controllers/notificationController');

/** GET /api/notifications - Retrieve notifications for the authenticated user */
router.get('/', auth, getNotifications);

/** PUT /api/notifications/read-all - Mark all notifications as read */
router.put('/read-all', auth, markAllRead);

module.exports = router;
