// src/pages/ManageCMS.jsx
import { useEffect } from 'react';
import axios from 'axios';

export default function ManageCMS() {
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const cmsUrl = import.meta.env.VITE_APP_CMS_URL || 'http://localhost:8002';
    const bridgeUrl = `${cmsUrl}bridge-login/`;

    axios
      .post(
        bridgeUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Important to set the session cookie
        }
      )
      .then(() => {
        window.open(`${cmsUrl}admin/`, '_blank');
        window.location.href = '/';
      })
      .catch((err) => {
        console.error('Bridge login to Wagtail failed', err);
        window.location.href = '/login';
      });
  }, []);

  return <p className="p-4">Logging you into CMS…</p>;
}
