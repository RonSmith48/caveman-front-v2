import { APP_DEFAULT_PATH } from 'config';

export default function getUserDashboardPath(user) {
  if (!user || !user.department) {
    return APP_DEFAULT_PATH;
  }

  const departmentRoutes = {
    'prod-eng': '/prod-eng',
    'prod-shiftboss': '/prod-shiftboss',
    geology: '/geology',
    geotech: '/geotech'
  };

  const path = departmentRoutes[user.department];

  if (!path) {
    console.warn('⚠️ Unrecognized department:', user.department);
  }

  return path || APP_DEFAULT_PATH;
}
