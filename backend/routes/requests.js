/**
 * Blood Request Routes
 *
 * Defines endpoints for creating, listing, updating, and donating
 * to blood requests. Access is role-restricted where appropriate.
 *
 * @module routes/requests
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const {
  createRequest, listRequests, getRequest, updateRequestStatus, donateToRequest,
  createRequestValidation
} = require('../controllers/requestController');

/** POST /api/requests - Create a blood request (hospital only) */
router.post('/', auth, role('hospital'), createRequestValidation, createRequest);

/** GET /api/requests - List open blood requests with optional filters (public) */
router.get('/', listRequests);

/** GET /api/requests/:id - Retrieve details for a single request (public) */
router.get('/:id', getRequest);

/** PUT /api/requests/:id/status - Update request status (hospital or admin) */
router.put('/:id/status', auth, role('hospital', 'admin'), updateRequestStatus);

/** POST /api/requests/:id/donate - Volunteer to donate for a request (donor only) */
router.post('/:id/donate', auth, role('donor'), donateToRequest);

module.exports = router;
