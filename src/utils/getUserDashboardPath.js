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
    'Electrical Engineer': '/electrical/dashboard',
    Geologist: '/geology/dashboard',
    'Geotechnical Engineer': '/geotech/dashboard',
    'Mine Captain': '/capt/dashboard',
    'Mobile Maint Planner': '/mob-maint/dashboard',
    'Operations Shiftboss': '/ops/dashboard',
    'Pitram Operator': '/pitram/dashboard',
    'Production Engineer': '/prod-eng/dashboard',
    'Production Shiftboss': '/prod/dashboard',
    Surveyor: '/survey/dashboard'
  };

  const path = roleRoutes[user.role];

  if (!path) {
    console.warn('⚠️ Unrecognized department:', user.role);
  }

  return path || APP_DEFAULT_PATH;
}
