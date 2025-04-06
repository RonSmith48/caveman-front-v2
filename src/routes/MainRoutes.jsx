import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import PagesLayout from 'layout/Pages';
import SimpleLayout from 'layout/Simple';

import { SimpleLayoutType } from 'config';

// pages routing
// pages - profile
const Profile = Loadable(lazy(() => import('features/profile/Profile')));
const ProdEngDash = Loadable(lazy(() => import('pages/dashboard/ProdEngDash')));
const ProdShiftbossDash = Loadable(lazy(() => import('pages/dashboard/ProdShiftbossDash')));
const GeologyDash = Loadable(lazy(() => import('pages/dashboard/GeologyDash')));
const GeotechDash = Loadable(lazy(() => import('pages/dashboard/GeotechDash')));

const AppContactUS = Loadable(lazy(() => import('pages/contact-us')));

// render - sample page
const DefaultDash = Loadable(lazy(() => import('pages/extra-pages/default-dashboard')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'prod-eng',
          element: <ProdEngDash />
        },
        {
          path: 'prod-shiftboss',
          element: <ProdShiftbossDash />
        },
        {
          path: 'geology',
          element: <GeologyDash />
        },
        {
          path: 'geotech',
          element: <GeotechDash />
        },
        {
          path: 'dashboard',
          element: <DefaultDash />
        },
        {
          path: 'profile',
          element: <Navigate to="/profile/profile" />
        },
        {
          path: 'profile/:tab',
          element: <Profile />
        }
      ]
    },
    {
      path: '/',
      element: <SimpleLayout layout={SimpleLayoutType.SIMPLE} />,
      children: [
        {
          path: 'contact-us',
          element: <AppContactUS />
        }
      ]
    }
  ]
};

export default MainRoutes;
