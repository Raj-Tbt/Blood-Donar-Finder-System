/**
 * Blood Request Controller
 *
 * Manages blood request lifecycle including creation, listing,
 * detail retrieval, status updates, and donor-to-request matching.
 * Critical requests trigger email notifications to eligible donors.
 *
 * @module controllers/requestController
 */

const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { sendCriticalAlert } = require('../utils/mailer');

/** Validation rules for creating a blood request */
const createRequestValidation = [
  body('blood_group').isIn(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']).withMessage('Valid blood group required'),
  body('units_needed').isInt({ min: 1 }).withMessage('Units needed must be at least 1'),
  body('urgency').isIn(['low', 'medium', 'critical']).withMessage('Urgency must be low, medium, or critical'),
  body('description').optional().trim()
];

/**
 * Create a new blood request. Hospital-only endpoint.
 * If the urgency is critical, matching donors are notified via
 * in-app notifications and email alerts.
 */
async function createRequest(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { blood_group, units_needed, urgency, description } = req.body;
    const hospital_id = req.user.id;

    const [result] = await pool.query(
      'INSERT INTO blood_requests (hospital_id, blood_group, units_needed, urgency, description) VALUES (?, ?, ?, ?, ?)',
      [hospital_id, blood_group, units_needed, urgency, description || null]
    );

    const requestId = result.insertId;

    /* For critical requests, notify all matching eligible donors */
    if (urgency === 'critical') {
      const [donors] = await pool.query(`
        SELECT u.id AS user_id, u.name, u.email
        FROM eligible_donors ed
        JOIN users u ON ed.user_id = u.id
        WHERE ed.blood_group = ?
      `, [blood_group]);

      /* Create in-app notifications for each matching donor */
      for (const donor of donors) {
        await pool.query(
          'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
          [donor.user_id, `CRITICAL: ${blood_group} blood needed urgently! ${description || ''}`, 'alert']
        );
      }

      /* Send email alerts asynchronously (does not block the response) */
      sendCriticalAlert(donors, { blood_group, units_needed, description }).catch(console.error);
    }

    res.status(201).json({
      message: 'Blood request created successfully.',
      request_id: requestId
    });
  } catch (err) {
    console.error('Create request error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * List blood requests with optional filters.
 * Supports filtering by blood_group, urgency, and status.
 * Defaults to showing only open requests, ordered by urgency.
 */
async function listRequests(req, res) {
  try {
    const { blood_group, urgency, status } = req.query;

    let query = `
      SELECT br.*, u.name AS hospital_name, u.city AS hospital_city
      FROM blood_requests br
      JOIN users u ON br.hospital_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (blood_group) {
      query += ' AND br.blood_group = ?';
      params.push(blood_group);
    }
    if (urgency) {
      query += ' AND br.urgency = ?';
      params.push(urgency);
    }
    if (status) {
      query += ' AND br.status = ?';
      params.push(status);
    } else {
      query += " AND br.status = 'open'";
    }

    query += ' ORDER BY FIELD(br.urgency, "critical", "medium", "low"), br.created_at DESC';

    const [requests] = await pool.query(query, params);
    res.json({ requests });
  } catch (err) {
    console.error('List requests error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * Retrieve detailed information for a single blood request,
 * including the list of donors who have volunteered.
 */
async function getRequest(req, res) {
  try {
    const { id } = req.params;

    const [requests] = await pool.query(`
      SELECT br.*, u.name AS hospital_name, u.city AS hospital_city, u.phone AS hospital_phone
      FROM blood_requests br
      JOIN users u ON br.hospital_id = u.id
      WHERE br.id = ?
    `, [id]);

    if (requests.length === 0) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    /* Fetch donations associated with this request */
    const [donations] = await pool.query(`
      SELECT dn.*, d.blood_group, u.name AS donor_name, u.phone AS donor_phone, u.city AS donor_city
      FROM donations dn
      JOIN donors d ON dn.donor_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE dn.request_id = ?
      ORDER BY dn.donated_at DESC
    `, [id]);

    res.json({
      request: requests[0],
      donations
    });
  } catch (err) {
    console.error('Get request error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * Update the status of a blood request.
 * Valid statuses: open, fulfilled, closed.
 */
async function updateRequestStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['open', 'fulfilled', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const [result] = await pool.query(
      'UPDATE blood_requests SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    res.json({ message: `Request status updated to ${status}.` });
  } catch (err) {
    console.error('Update request status error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
}

/**
 * Record a donor's volunteer donation for a blood request.
 * Validates that the request is open and the user has a donor record.
 * Triggers a notification to the requesting hospital.
 */
async function donateToRequest(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { units } = req.body;

    /* Verify the user has a donor record */
    const [donors] = await pool.query('SELECT id FROM donors WHERE user_id = ?', [userId]);
    if (donors.length === 0) {
      return res.status(400).json({ message: 'You must be registered as a donor.' });
    }

    const donorId = donors[0].id;

    /* Verify the request is still open */
    const [requests] = await pool.query('SELECT * FROM blood_requests WHERE id = ? AND status = "open"', [id]);
    if (requests.length === 0) {
      return res.status(404).json({ message: 'Request not found or already closed.' });
    }

    /* Record the donation (database trigger updates donor stats) */
    await pool.query(
      'INSERT INTO donations (donor_id, request_id, units) VALUES (?, ?, ?)',
      [donorId, id, units || 1]
    );

    /* Notify the requesting hospital */
    await pool.query(
      'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
      [requests[0].hospital_id, `A donor has volunteered for your ${requests[0].blood_group} blood request!`, 'update']
    );

    res.status(201).json({ message: 'Donation recorded successfully.' });
  } catch (err) {
    console.error('Donate error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
}

module.exports = {
  createRequest,
  listRequests,
  getRequest,
  updateRequestStatus,
  donateToRequest,
  createRequestValidation
};
