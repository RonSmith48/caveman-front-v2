import { APP_DEFAULT_PATH } from 'config';

export default function getUserDashboardPath(user) {
  if (!user || !user.role) {
    return APP_DEFAULT_PATH;
  }

  /*   'Manager',
  'Mine Captain',
  'Production Shiftboss',
  'Development Shiftboss',
  'Operations Shiftboss',
  'Production Engineer',
  'Development Engineer',
  'Geotechnical Engineer',
  'Electrical Engineer',
  'Mechanical Engineer',
  'Geologist',
  'Surveyor',
  'Mobile Maint Planner',
  'Pitram Operator' */

  const roleRoutes = {
    'Production Engineer': '/prod-eng',
    'Production Shiftboss': '/prod-shiftboss',
    Geologist: '/geology',
    'Geotechnical Engineer': '/geotech'
  };

  const path = roleRoutes[user.role];

  if (!path) {
    console.warn('⚠️ Unrecognized department:', user.role);
  }

  return path || APP_DEFAULT_PATH;
}
