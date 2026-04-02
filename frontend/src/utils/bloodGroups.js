/**
 * Blood Group Utilities
 *
 * Constants and helper functions for blood group data including
 * display colors, compatibility charts, and date formatting.
 *
 * @module utils/bloodGroups
 */

/** All supported ABO/Rh blood group types */
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

/** Color codes assigned to each blood group for UI elements and map markers */
export const BLOOD_GROUP_COLORS = {
  'A+': '#E74C3C',
  'A-': '#C0392B',
  'B+': '#3498DB',
  'B-': '#2980B9',
  'O+': '#27AE60',
  'O-': '#229954',
  'AB+': '#9B59B6',
  'AB-': '#8E44AD',
};

/**
 * Blood compatibility chart.
 * Each entry defines which groups a blood type can donate to and receive from.
 *
 * @type {Object.<string, {canDonateTo: string[], canReceiveFrom: string[], label: string}>}
 */
export const BLOOD_COMPATIBILITY = {
  'O-': {
    canDonateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-'],
    label: 'Universal Donor'
  },
  'O+': {
    canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O-', 'O+'],
    label: 'Most Common'
  },
  'A-': {
    canDonateTo: ['A-', 'A+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-', 'A-'],
    label: ''
  },
  'A+': {
    canDonateTo: ['A+', 'AB+'],
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+'],
    label: ''
  },
  'B-': {
    canDonateTo: ['B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-', 'B-'],
    label: ''
  },
  'B+': {
    canDonateTo: ['B+', 'AB+'],
    canReceiveFrom: ['O-', 'O+', 'B-', 'B+'],
    label: ''
  },
  'AB-': {
    canDonateTo: ['AB-', 'AB+'],
    canReceiveFrom: ['O-', 'A-', 'B-', 'AB-'],
    label: ''
  },
  'AB+': {
    canDonateTo: ['AB+'],
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    label: 'Universal Recipient'
  },
};

/**
 * Extract initials from a name for avatar placeholders.
 * @param {string} name - Full name string.
 * @returns {string} Up to two uppercase initials.
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format a date string to a localized short date (e.g., "Apr 2, 2026").
 * @param {string|null} dateStr - ISO date string or null.
 * @returns {string} Formatted date or "Never" if null.
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Calculate the number of days since a given date.
 * @param {string|null} dateStr - ISO date string or null.
 * @returns {number|null} Days elapsed, or null if no date provided.
 */
export function daysSince(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - date) / (1000 * 60 * 60 * 24));
}
