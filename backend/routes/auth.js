/**
 * Authentication Routes
 *
 * Defines endpoints for user registration, login, and profile retrieval.
 *
 * @module routes/auth
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { register, login, getMe, registerValidation, loginValidation } = require('../controllers/authController');

/** POST /api/auth/register - Create a new user account */
router.post('/register', registerValidation, register);

/** POST /api/auth/login - Authenticate and receive a JWT token */
router.post('/login', loginValidation, login);

/** GET /api/auth/me - Retrieve the authenticated user's profile */
router.get('/me', auth, getMe);

module.exports = router;
