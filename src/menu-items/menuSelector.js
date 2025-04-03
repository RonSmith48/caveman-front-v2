import prodEngMenu from './roles/prod-eng';
import prodShiftbossMenu from './roles/prod-shiftboss';
import geologyMenu from './roles/geology';
import geotechMenu from './roles/geotech';
import defaultMenu from './roles/default';

export default function getMenuForUser(user) {
  if (!user) return defaultMenu;

  switch (user.department) {
    case 'prod-eng':
      return prodEngMenu;
    case 'prod-shiftboss':
      return prodShiftbossMenu;
    case 'geology':
      return geologyMenu;
    case 'geotech':
      return geotechMenu;
    default:
      return defaultMenu;
  }
}
