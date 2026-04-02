-- Blood Donor Finder System — Seed Data
-- Run AFTER schema.sql
-- Creates only the admin user for initial setup

USE blood_donor_db;

-- Password hash for admin: "password123"
-- Generated with bcryptjs (10 rounds)

INSERT INTO users (name, email, password_hash, phone, role, city, pincode, latitude, longitude)
VALUES (
  'Admin User',
  'admin@blooddonor.com',
  '$2a$10$N1x4u5J05X.3OYOJKs8aT.q/ixZ5P5BZftNpmlj.23rV89YSEimua',
  '9000000000',
  'admin',
  'Mumbai',
  '400001',
  19.0760,
  72.8777
);

-- NOTE: Donors and hospitals should register through the app.
-- Admin signup: /register?admin=true (requires ADMIN_SECRET)
