/**
 * Donors Hook
 *
 * Custom React hook for donor-related API operations.
 * Provides methods for searching donors and fetching individual profiles.
 *
 * @module hooks/useDonors
 */

import { useState, useCallback } from 'react';
import api from '../utils/api';

export function useDonors() {
  const [donors, setDonors] = useState([]);
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /** Search donors with optional blood_group and city filters */
  const searchDonors = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (params.blood_group) query.set('blood_group', params.blood_group);
      if (params.city) query.set('city', params.city);
      const res = await api.get(`/donors/search?${query.toString()}`);
      setDonors(res.data.donors);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search donors');
    } finally {
      setLoading(false);
    }
  }, []);

  /** Fetch a single donor's full profile by ID */
  const getDonorProfile = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/donors/${id}`);
      setDonor(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load donor profile');
    } finally {
      setLoading(false);
    }
  }, []);

  return { donors, donor, loading, error, searchDonors, getDonorProfile };
}
