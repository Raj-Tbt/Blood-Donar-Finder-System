/**
 * Donor Controller
 *
 * Handles donor search, profile retrieval, availability toggling,
 * and donation eligibility checks. Donor search uses a MySQL stored procedure.
 *
 * @module controllers/donorController
 */

const pool = require('../config/db');

/**
 * Search for eligible donors using the find_donors stored procedure.
 * Accepts optional blood_group and city query parameters.
 */
async function searchDonors(req, res) {
  try {
    const { blood_group, city } = req.query;
    const [rows] = await pool.query('CALL find_donors(?, ?)', [blood_group || null, city || null]);
    res.json({ donors: rows[0] });
  } catch (err) {
    console.error('Search donors error:', err);
    res.status(500).json({ message: 'Server error during donor search.' });
  }
}

/**
 * Retrieve a donor's full profile including user details,
 * donation history, and earned badges.
 */
async function getDonorProfile(req, res) {
  try {
    const { id } = req.params;

    /* Fetch combined donor and user information */
    const [donors] = await pool.query(`
      SELECT d.*, u.name, u.email, u.phone, u.city, u.pincode, u.latitude, u.longitude, u.avatar_url, u.created_at
      FROM donors d 
      JOIN users u ON d.user_id = u.id 
      WHERE d.id = ?
    `, [id]);

    if (donors.length === 0) {
      return res.status(404).json({ message: 'Donor not found.' });
    }

    const donor = donors[0];

    /* Fetch donation history with associated request and hospital details */
    const [donations] = await pool.query(`
      SELECT dn.*, br.blood_group, br.urgency, br.description,
             u.name AS hospital_name
      FROM donations dn
      JOIN blood_requests br ON dn.request_id = br.id
      JOIN users u ON br.hospital_id = u.id
      WHERE dn.donor_id = ?
      ORDER BY dn.donated_at DESC
    `, [id]);

    /* Fetch earned badges */
    const [badges] = await pool.query(
      'SELECT * FROM badges WHERE donor_id = ? ORDER BY awarded_at DESC',
      [id]
    );

    res.json({
      donor,
      donations,
      badges
    });
  } catch (err) {
    console.error('Get donor profile error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * Toggle the authenticated donor's availability status.
 * Switches between available and unavailable states.
 */
async function toggleAvailability(req, res) {
  try {
    const userId = req.user.id;

    const [donors] = await pool.query('SELECT id, is_available FROM donors WHERE user_id = ?', [userId]);
    if (donors.length === 0) {
      return res.status(404).json({ message: 'Donor record not found.' });
    }

    const newAvailability = !donors[0].is_available;

    await pool.query('UPDATE donors SET is_available = ? WHERE user_id = ?', [newAvailability, userId]);

    res.json({
      message: `Availability set to ${newAvailability ? 'available' : 'unavailable'}.`,
      is_available: newAvailability
    });
  } catch (err) {
    console.error('Toggle availability error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * Check the authenticated donor's eligibility to donate.
 * Eligibility is based on the 56-day cooldown period and minimum weight (45 kg).
 */
async function checkEligibility(req, res) {
  try {
    const userId = req.user.id;

    const [donors] = await pool.query(
      'SELECT last_donated_date, weight_kg, is_available FROM donors WHERE user_id = ?',
      [userId]
    );

    if (donors.length === 0) {
      return res.status(404).json({ message: 'Donor record not found.' });
    }

    const donor = donors[0];
    let eligible = true;
    let daysLeft = 0;
    let reasons = [];

    /* Enforce the 56-day minimum gap between donations */
    if (donor.last_donated_date) {
      const lastDonated = new Date(donor.last_donated_date);
      const now = new Date();
      const daysSince = Math.floor((now - lastDonated) / (1000 * 60 * 60 * 24));

      if (daysSince < 56) {
        eligible = false;
        daysLeft = 56 - daysSince;
        reasons.push(`Must wait ${daysLeft} more days since last donation.`);
      }
    }

    /* Enforce the minimum weight requirement */
    if (donor.weight_kg && donor.weight_kg < 45) {
      eligible = false;
      reasons.push('Minimum weight requirement is 45 kg.');
    }

    res.json({
      eligible,
      daysLeft,
      reasons,
      last_donated_date: donor.last_donated_date,
      weight_kg: donor.weight_kg,
      is_available: donor.is_available
    });
  } catch (err) {
    console.error('Check eligibility error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
}

module.exports = {
  searchDonors,
  getDonorProfile,
  toggleAvailability,
  checkEligibility
};
