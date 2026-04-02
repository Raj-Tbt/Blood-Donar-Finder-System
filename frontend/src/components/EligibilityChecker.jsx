/**
 * EligibilityChecker Component
 *
 * Client-side form that checks blood donation eligibility based on
 * the 56-day cooldown period, minimum weight (45 kg), and blood group selection.
 * Provides instant feedback without requiring API calls.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiActivity, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { BLOOD_GROUPS } from '../utils/bloodGroups';

export default function EligibilityChecker() {
  const [lastDonation, setLastDonation] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [result, setResult] = useState(null);

  /** Validates eligibility based on form inputs */
  function checkEligibility(e) {
    e.preventDefault();
    let eligible = true;
    let reasons = [];
    let daysLeft = 0;

    /* Validate minimum weight requirement */
    if (weight && parseFloat(weight) < 45) {
      eligible = false;
      reasons.push('Minimum weight requirement is 45 kg.');
    }

    /* Validate 56-day cooldown since last donation */
    if (lastDonation) {
      const lastDate = new Date(lastDonation);
      const now = new Date();
      const daysSince = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

      if (daysSince < 56) {
        eligible = false;
        daysLeft = 56 - daysSince;
        reasons.push(`Must wait ${daysLeft} more days since last donation.`);
      }
    }

    /* Validate blood group selection */
    if (!bloodGroup) {
      reasons.push('Please select your blood group.');
      eligible = false;
    }

    setResult({ eligible, reasons, daysLeft });
  }

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 md:p-8 shadow-lg">
      <h3 className="section-heading text-2xl mb-2 text-center">Eligibility Checker</h3>
      <p className="section-subheading text-center mb-6">
        Check if you're eligible to donate blood today
      </p>

      <form onSubmit={checkEligibility} className="space-y-4 max-w-md mx-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Blood Group
          </label>
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="input-field"
          >
            <option value="">Select blood group</option>
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            <FiCalendar className="inline w-4 h-4 mr-1" />
            Last Donation Date
          </label>
          <input
            type="date"
            value={lastDonation}
            onChange={(e) => setLastDonation(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            <FiActivity className="inline w-4 h-4 mr-1" />
            Weight (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g., 60"
            min="0"
            max="300"
            className="input-field"
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          Check Eligibility
        </button>
      </form>

      {/* Results panel */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 p-4 rounded-xl text-center ${
            result.eligible
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}
        >
          <div className="text-3xl mb-2">
            {result.eligible ? (
              <FiCheckCircle className="w-10 h-10 text-green-500 mx-auto" />
            ) : (
              <FiXCircle className="w-10 h-10 text-red-500 mx-auto" />
            )}
          </div>
          <h4 className={`font-semibold text-lg ${
            result.eligible ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
          }`}>
            {result.eligible ? 'You are eligible to donate!' : 'Not eligible yet'}
          </h4>
          {result.reasons.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {result.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          )}
          {result.daysLeft > 0 && (
            <div className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">
              {result.daysLeft} days remaining
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
