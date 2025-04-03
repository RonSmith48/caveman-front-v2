import { APP_DEFAULT_PATH } from 'config';

export default function getUserDashboardPath(user) {
  if (!user || !user.department) return APP_DEFAULT_PATH;

  const departmentRoutes = {
    'prod-eng': '/prod-eng',
    'prod-shiftboss': '/prod-shiftboss',
    geology: '/geology',
    geotech: '/geotech'
    // fallback or unassigned roles can be handled too
  };

  return departmentRoutes[user.department] || APP_DEFAULT_PATH;
}
