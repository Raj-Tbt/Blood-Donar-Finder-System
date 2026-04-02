/**
 * Donor Routes
 *
 * Defines endpoints for donor search, profile retrieval,
 * availability management, and eligibility checks.
 *
 * @module routes/donors
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { searchDonors, getDonorProfile, toggleAvailability, checkEligibility } = require('../controllers/donorController');

/** GET /api/donors/search - Search donors by blood group and city (public) */
router.get('/search', searchDonors);

/** GET /api/donors/eligibility - Check donor eligibility (donor only, placed before /:id to avoid route conflict) */
router.get('/eligibility', auth, role('donor'), checkEligibility);

/** GET /api/donors/:id - Retrieve a donor's full profile (public) */
router.get('/:id', getDonorProfile);

/** PUT /api/donors/toggle-availability - Toggle donor availability status (donor only) */
router.put('/toggle-availability', auth, role('donor'), toggleAvailability);

module.exports = router;
