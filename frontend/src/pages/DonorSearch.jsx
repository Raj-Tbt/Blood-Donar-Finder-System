/**
 * Donor Search Page
 *
 * Provides a searchable interface for finding blood donors
 * by blood group and city. Supports grid and map view modes.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiMap, FiGrid, FiFilter } from 'react-icons/fi';
import DonorCard from '../components/DonorCard';
import MapView from '../components/MapView';
import { useDonors } from '../hooks/useDonors';
import { BLOOD_GROUPS } from '../utils/bloodGroups';

export default function DonorSearch() {
  const { donors, loading, searchDonors } = useDonors();
  const [bloodGroup, setBloodGroup] = useState('');
  const [city, setCity] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  /* Load all donors on initial mount */
  useEffect(() => {
    searchDonors();
  }, []);

  /** Handle search form submission */
  function handleSearch(e) {
    e.preventDefault();
    searchDonors({ blood_group: bloodGroup, city });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="section-heading">Find Blood Donors</h1>
          <p className="section-subheading">Search by blood group and city to find eligible donors near you</p>
        </motion.div>

        {/* Search filters */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg p-4 md:p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={e => setBloodGroup(e.target.value)}
                className="input-field"
              >
                <option value="">All Blood Groups</option>
                {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="e.g., Mumbai, Pune, Delhi"
                className="input-field"
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn-primary flex items-center space-x-2 w-full md:w-auto">
                <FiSearch className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </motion.form>

        {/* View mode toggle and results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {loading ? 'Searching...' : `${donors.length} donor${donors.length !== 1 ? 's' : ''} found`}
          </p>
          <div className="flex items-center bg-white dark:bg-dark-surface rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-blood-500 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Grid View"
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'map'
                  ? 'bg-blood-500 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Map View"
            >
              <FiMap className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blood-200 border-t-blood-500 rounded-full animate-spin" />
          </div>
        ) : donors.length === 0 ? (
          <div className="text-center py-20">
            <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No donors found</h3>
            <p className="text-gray-400">Try adjusting your search filters</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donors.map((donor, i) => (
              <DonorCard key={donor.donor_id || donor.id} donor={donor} index={i} />
            ))}
          </div>
        ) : (
          <MapView donors={donors} />
        )}
      </div>
    </div>
  );
}
