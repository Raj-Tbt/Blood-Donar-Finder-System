/**
 * Admin Controller
 *
 * Provides administrative endpoints for dashboard statistics
 * and user management. Restricted to admin-role users.
 *
 * @module controllers/adminController
 */

const pool = require('../config/db');

/**
 * Retrieve dashboard statistics including donor counts, request metrics,
 * blood group distribution, and donation trends (last 30 days).
 */
async function getStats(req, res) {
  try {
    const [totalDonors] = await pool.query('SELECT COUNT(*) as count FROM donors');
    const [totalRequests] = await pool.query('SELECT COUNT(*) as count FROM blood_requests');
    const [openRequests] = await pool.query("SELECT COUNT(*) as count FROM blood_requests WHERE status = 'open'");
    const [fulfilledRequests] = await pool.query("SELECT COUNT(*) as count FROM blood_requests WHERE status = 'fulfilled'");
    const [totalDonations] = await pool.query('SELECT COUNT(*) as count FROM donations');
    const [confirmedDonations] = await pool.query("SELECT COUNT(*) as count FROM donations WHERE status = 'confirmed'");
    const [totalUsers] = await pool.query('SELECT COUNT(*) as count FROM users');

    /* Blood group distribution across all registered donors */
    const [bloodGroupCounts] = await pool.query(`
      SELECT blood_group, COUNT(*) as count 
      FROM donors 
      GROUP BY blood_group 
      ORDER BY blood_group
    `);

    /* Daily donation counts for the last 30 days */
    const [donationsOverTime] = await pool.query(`
      SELECT DATE(donated_at) as date, COUNT(*) as count
      FROM donations
      WHERE donated_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(donated_at)
      ORDER BY date
    `);

    /* Calculate the overall fulfillment rate */
    const total = totalRequests[0].count;
    const fulfilled = fulfilledRequests[0].count;
    const fulfillmentRate = total > 0 ? Math.round((fulfilled / total) * 100) : 0;

    res.json({
      totalDonors: totalDonors[0].count,
      totalRequests: totalRequests[0].count,
      openRequests: openRequests[0].count,
      fulfilledRequests: fulfilledRequests[0].count,
      totalDonations: totalDonations[0].count,
      confirmedDonations: confirmedDonations[0].count,
      totalUsers: totalUsers[0].count,
      fulfillmentRate,
      bloodGroupCounts,
      donationsOverTime
    });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * Retrieve all registered users with optional donor information.
 * Results are ordered by registration date (newest first).
 */
async function getUsers(req, res) {
  try {
    const [users] = await pool.query(`
      SELECT u.id, u.name, u.email, u.phone, u.role, u.city, u.created_at,
             d.blood_group, d.total_donations, d.is_available
      FROM users u
      LEFT JOIN donors d ON u.id = d.user_id
      ORDER BY u.created_at DESC
    `);

    res.json({ users });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
}

module.exports = {
  getStats,
  getUsers
};
