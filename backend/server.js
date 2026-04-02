/**
 * Blood Donor Finder System - Main Server Entry Point
 *
 * Initializes the Express application, configures middleware,
 * registers API routes, and starts the HTTP server.
 *
 * @module server
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

/* Ensure the uploads directory exists for file storage */
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/* --- Middleware Configuration --- */
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Serve uploaded files as static assets */
app.use('/uploads', express.static(uploadsDir));

/* --- API Route Registration --- */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/donors', require('./routes/donors'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/upload', require('./routes/upload'));

/* Health check endpoint for monitoring */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* --- Global Error Handling --- */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ message: 'Internal server error.' });
});

/* 404 handler for unregistered routes */
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

/* --- Start Server --- */
app.listen(PORT, () => {
  console.log(`Blood Donor API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
