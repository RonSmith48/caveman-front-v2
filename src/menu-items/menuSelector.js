import commonMenuGroup from 'menu-items/roles/common';
import superuserMenuGroup from 'menu-items/roles/superuser';

import prodEngMenu from 'menu-items/roles/prodEng';
import prodShiftbossMenu from 'menu-items/roles/prodShiftboss';
import geologyMenu from 'menu-items/roles/geology';
import geotechMenu from 'menu-items/roles/geotech';
import defaultMenu from 'menu-items/roles/default';

export default function getMenuForUser(user) {
  let menu;

  if (!user || !user.role) {
    menu = [...defaultMenu];
  } else {
    switch (user.role) {
      case 'Production Engineer':
        menu = [...prodEngMenu.items];
        break;
      case 'Production Shiftboss':
        menu = [...prodShiftbossMenu.items];
        break;
      case 'Geologist':
        menu = [...geologyMenu.items];
        break;
      case 'Geotechnical Engineer':
        menu = [...geotechMenu.items];
        break;
      default:
        menu = [...defaultMenu];
    }
  }

  // Add the common menu group for everyone
  menu.push(commonMenuGroup);

  // Add the superuser tools at the bottom
  if (user?.is_superuser) {
    menu.push(superuserMenuGroup);
  }

  return { items: menu };
}
