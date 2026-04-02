/**
 * Database Cleanup Utility
 *
 * Removes all non-admin data from the database while respecting
 * foreign key constraints. Used for resetting demo/test data.
 *
 * Usage: node fix_passwords.js
 *
 * @module fix_passwords
 */

require('dotenv').config();
const pool = require('./config/db');

async function cleanDB() {
  /* Delete records in order to respect foreign key constraints */
  await pool.query("DELETE FROM notifications WHERE user_id != 1");
  await pool.query("DELETE FROM badges");
  await pool.query("DELETE FROM donations");
  await pool.query("DELETE FROM blood_requests");
  await pool.query("DELETE FROM donors");
  await pool.query("DELETE FROM users WHERE role != 'admin'");

  const [users] = await pool.query('SELECT id, name, email, role FROM users');
  console.log('Database cleaned. Remaining users:');
  console.table(users);

  /* Remove any remaining notifications */
  await pool.query("DELETE FROM notifications");

  process.exit(0);
}

cleanDB();
