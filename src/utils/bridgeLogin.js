// utils/bridgeLogin.js

export const bridgeLoginToConnectedAPIs = async (token) => {
  const apiUrl = import.meta.env.VITE_APP_API_URL?.replace(/\/$/, '');
  const cmsUrl = import.meta.env.VITE_APP_CMS_URL?.replace(/\/$/, '');

  const bridgeEndpoints = [`${apiUrl}/bridge-login/`, `${cmsUrl}/bridge-login/`];

  const requests = bridgeEndpoints.map((url) =>
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}), // Required: DRF expects JSON
      credentials: 'include'
    }).catch((err) => {
      console.error(`Bridge login to ${url} failed`, err);
    })
  );

  await Promise.all(requests);
};
