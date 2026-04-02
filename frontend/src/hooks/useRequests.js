/**
 * Blood Requests Hook
 *
 * Custom React hook for blood request API operations.
 * Provides methods for listing, fetching, and creating blood requests.
 *
 * @module hooks/useRequests
 */

import { useState, useCallback } from 'react';
import api from '../utils/api';

export function useRequests() {
  const [requests, setRequests] = useState([]);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /** Fetch blood requests with optional blood_group, urgency, and status filters */
  const fetchRequests = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (params.blood_group) query.set('blood_group', params.blood_group);
      if (params.urgency) query.set('urgency', params.urgency);
      if (params.status) query.set('status', params.status);
      const res = await api.get(`/requests?${query.toString()}`);
      setRequests(res.data.requests);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, []);

  /** Fetch a single blood request by ID */
  const getRequest = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/requests/${id}`);
      setRequest(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load request');
    } finally {
      setLoading(false);
    }
  }, []);

  /** Create a new blood request */
  const createRequest = useCallback(async (data) => {
    const res = await api.post('/requests', data);
    return res.data;
  }, []);

  return { requests, request, loading, error, fetchRequests, getRequest, createRequest };
}
