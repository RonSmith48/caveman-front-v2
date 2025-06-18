// src/pages/Profile.jsx
import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { fetcher } from 'utils/axiosCms';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState();

  useEffect(() => {
    // fetcher assumes baseURL ends in /api/, so here we pass the rest of the path
    fetcher('users/me/')
      .then((res) => setUser(res.data))
      .catch((err) => {
        // if your response interceptor already showed a snackbar for network errors
        if (!err._apiHandled) {
          enqueueSnackbar(err.response?.data?.detail || 'Unable to fetch profile', { variant: 'error' });
        }
        setError(true);
      });
  }, []);

  if (error) return <p className="text-red-600">Error loading profile.</p>;
  if (!user) return <p>Loading…</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">
        Hello, {user.first_name} {user.last_name}
      </h1>
      <dl className="mt-4">
        <dt className="font-semibold">Email:</dt>
        <dd>{user.email}</dd>
        <dt className="font-semibold">Initials:</dt>
        <dd>{user.initials || '—'}</dd>
        <dt className="font-semibold">Is staff:</dt>
        <dd>{user.is_staff ? 'Yes' : 'No'}</dd>
      </dl>
    </div>
  );
}
