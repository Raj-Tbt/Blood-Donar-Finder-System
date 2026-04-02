/**
 * File Upload Routes
 *
 * Handles avatar/profile picture uploads using Multer.
 * Files are stored on disk and the URL is saved to the user record.
 *
 * Supported formats: JPEG, PNG, WebP (max 5MB).
 *
 * @module routes/upload
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const pool = require('../config/db');

/** Multer disk storage configuration */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `avatar-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

/** File type filter — only allow image formats */
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } /* 5MB maximum */
});

/** POST /api/upload/avatar - Upload a profile picture (authenticated users only) */
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    await pool.query('UPDATE users SET avatar_url = ? WHERE id = ?', [avatarUrl, req.user.id]);

    res.json({
      message: 'Avatar uploaded successfully.',
      avatar_url: avatarUrl
    });
  } catch (err) {
    console.error('Upload avatar error:', err);
    res.status(500).json({ message: 'Server error during upload.' });
  }
});

module.exports = router;
