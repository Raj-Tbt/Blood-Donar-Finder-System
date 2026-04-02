/**
 * Authentication Controller
 *
 * Handles user registration, login, and profile retrieval.
 * Supports role-based registration for donors, hospitals, and admins.
 *
 * @module controllers/authController
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');

/** Validation rules for the registration endpoint */
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['donor', 'hospital', 'admin']).withMessage('Role must be donor, hospital, or admin'),
  body('phone').optional().trim(),
  body('city').optional().trim(),
  body('pincode').optional().trim(),
  body('latitude').optional().isDecimal(),
  body('longitude').optional().isDecimal(),
  body('blood_group').if(body('role').equals('donor'))
    .isIn(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
    .withMessage('Valid blood group is required for donors'),
  body('weight_kg').if(body('role').equals('donor'))
    .optional().isFloat({ min: 45 }).withMessage('Weight must be at least 45 kg')
];

/** Validation rules for the login endpoint */
const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

/**
 * Register a new user account.
 * Creates a user record and, for donors, an associated donor record
 * within a single database transaction.
 */
async function register(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, role, city, pincode, latitude, longitude, blood_group, weight_kg, admin_secret } = req.body;

    /* Admin registration requires a valid secret key */
    if (role === 'admin') {
      const validSecret = process.env.ADMIN_SECRET || 'blooddonor_admin_2026';
      if (!admin_secret || admin_secret !== validSecret) {
        return res.status(403).json({ message: 'Invalid admin secret key.' });
      }
    }

    /* Check for existing email */
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    /* Hash the password */
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    /* Begin transaction for atomic user + donor insert */
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
      const [userResult] = await conn.query(
        'INSERT INTO users (name, email, password_hash, phone, role, city, pincode, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [name, email, password_hash, phone || null, role, city || null, pincode || null, latitude || null, longitude || null]
      );

      const userId = userResult.insertId;

      /* Create associated donor record if the user is a donor */
      if (role === 'donor') {
        await conn.query(
          'INSERT INTO donors (user_id, blood_group, weight_kg) VALUES (?, ?, ?)',
          [userId, blood_group, weight_kg || null]
        );
      }

      await conn.commit();
      conn.release();

      res.status(201).json({ message: 'Registration successful.' });
    } catch (err) {
      await conn.rollback();
      conn.release();
      throw err;
    }
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
}

/**
 * Authenticate a user and return a JWT token.
 * Compares the provided password against the stored hash.
 */
async function login(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    /* Generate JWT with user ID and role */
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    /* Return user data without the password hash */
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
}

/**
 * Retrieve the authenticated user's profile.
 * Includes donor-specific data if the user is a donor.
 */
async function getMe(req, res) {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, phone, role, city, pincode, latitude, longitude, avatar_url, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = users[0];

    /* Attach donor-specific information if applicable */
    if (user.role === 'donor') {
      const [donors] = await pool.query('SELECT * FROM donors WHERE user_id = ?', [user.id]);
      if (donors.length > 0) {
        user.donor = donors[0];
      }
    }

    res.json({ user });
  } catch (err) {
    console.error('GetMe error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
}

module.exports = {
  register,
  login,
  getMe,
  registerValidation,
  loginValidation
};
