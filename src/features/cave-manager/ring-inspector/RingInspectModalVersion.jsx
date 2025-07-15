import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress, Alert } from '@mui/material';
import RingInspectForm from './RingInspectForm';
import { fetcher } from 'utils/axiosBack';

export default function RingInspectModal({ location_id }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetcher(`/api/prod-actual/prod-rings/${location_id}/`)
      .then((res) => setData(res.data))
      .catch(() => setError('Error loading ring data'))
      .finally(() => setLoading(false));
  }, [location_id]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return <RingInspectForm initialValues={data} />;
}
