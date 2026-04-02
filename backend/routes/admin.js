/**
 * Admin Routes
 *
 * Defines administrative endpoints for dashboard statistics
 * and user management. All routes require admin role authentication.
 *
 * @module routes/admin
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { getStats, getUsers } = require('../controllers/adminController');

/** GET /api/admin/stats - Retrieve dashboard statistics (admin only) */
router.get('/stats', auth, role('admin'), getStats);

/** GET /api/admin/users - Retrieve all registered users (admin only) */
router.get('/users', auth, role('admin'), getUsers);

module.exports = router;
