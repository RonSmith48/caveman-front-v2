import prodEngMenu from './roles/prod-eng';
import prodShiftbossMenu from './roles/prod-shiftboss';
import geologyMenu from './roles/geology';
import geotechMenu from './roles/geotech';
import defaultMenu from './roles/default';

export default function getMenuForUser(user) {
  if (!user || !user.role) return defaultMenu;

  switch (user.role) {
    case 'Production Engineer':
      return prodEngMenu;
    case 'Production Shiftboss':
      return prodShiftbossMenu;
    case 'Geologist':
      return geologyMenu;
    case 'Geotechnical Engineer':
      return geotechMenu;
    default:
      return defaultMenu;
  }
}
