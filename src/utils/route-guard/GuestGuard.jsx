import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// project imports
import { APP_DEFAULT_PATH } from 'config';
import useAuth from 'hooks/useAuth';
import getUserDashboardPath from 'utils/getUserDashboardPath';

// ==============================|| GUEST GUARD ||============================== //

export default function GuestGuard({ children }) {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('logs', isLoggedIn, location.pathname, sessionStorage.getItem('callbackUrl'));
    // Only redirect if logged in and on a guest route
    if (isLoggedIn && (location.pathname === '/login' || location.pathname === '/register')) {
      const callbackUrl = sessionStorage.getItem('callbackUrl') || getUserDashboardPath(user);
      console.log('callback', callbackUrl);
      sessionStorage.setItem('callbackUrl', getUserDashboardPath(user));
      navigate(callbackUrl, { replace: true });
    }
  }, [isLoggedIn, user, navigate, location.pathname]);

  return children;
}

GuestGuard.propTypes = { children: PropTypes.any };
