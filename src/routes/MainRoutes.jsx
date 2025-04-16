import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import PagesLayout from 'layout/Pages';
import SimpleLayout from 'layout/Simple';

import { SimpleLayoutType } from 'config';

// profile
const Profile = Loadable(lazy(() => import('features/profile/Profile')));
// superuser
const SudoSettings = Loadable(lazy(() => import('features/superuser/Settings')));
// dashboards
const ProdEngDash = Loadable(lazy(() => import('pages/dashboard/ProdEngDash')));
const ProdShiftbossDash = Loadable(lazy(() => import('pages/dashboard/ProdShiftbossDash')));
const GeologyDash = Loadable(lazy(() => import('pages/dashboard/GeologyDash')));
const GeotechDash = Loadable(lazy(() => import('pages/dashboard/GeotechDash')));
const DefaultDash = Loadable(lazy(() => import('pages/extra-pages/default-dashboard')));
// BDCF
const BDCFEntries = Loadable(lazy(() => import('features/bdcf/EntriesPage')));
const ProdLevelStatus = Loadable(lazy(() => import('features/prod-reports/LevelStatusPage')));
// prod concept
const ProdConcept = Loadable(lazy(() => import('features/prod-concept/ConceptUpload')));
const ProdOrphans = Loadable(lazy(() => import('features/prod-concept/ProdOrphans')));
// prod rings
const RingDesign = Loadable(lazy(() => import('features/ring-design/RingDesign')));

const AppContactUS = Loadable(lazy(() => import('pages/contact-us')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { path: 'dashboard', element: <DefaultDash /> },
        { path: 'geology/dashboard', element: <GeologyDash /> },
        { path: 'geotech/dashboard', element: <GeotechDash /> },
        { path: 'prod-eng/dashboard', element: <ProdEngDash /> },
        { path: 'prod-eng/bdcf', element: <Navigate to="/prod-eng/bdcf/bog" /> },
        { path: 'prod-eng/bdcf/:tab', element: <BDCFEntries /> },
        { path: 'prod-eng/prod-concept', element: <ProdConcept /> },
        { path: 'prod-eng/level-status', element: <ProdLevelStatus /> },
        { path: 'prod-eng/prod-orphans', element: <ProdOrphans /> },
        { path: 'prod-eng/ring-design', element: <RingDesign /> },
        { path: 'prod-shiftboss', element: <ProdShiftbossDash /> },
        { path: 'profile', element: <Navigate to="/profile/profile" /> },
        { path: 'profile/:tab', element: <Profile /> },
        { path: 'sudo/settings', element: <SudoSettings /> }
      ]
    },
    {
      path: '/',
      element: <SimpleLayout layout={SimpleLayoutType.SIMPLE} />,
      children: [{ path: 'contact-us', element: <AppContactUS /> }]
    }
  ]
};

export default MainRoutes;
