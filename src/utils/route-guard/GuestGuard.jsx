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
    // Only redirect if logged in and on a guest route
    if (isLoggedIn) {
      const callbackUrl = sessionStorage.getItem('callbackUrl') || getUserDashboardPath(user);
      sessionStorage.setItem('callbackUrl', getUserDashboardPath(user));
      navigate(callbackUrl, { replace: true });
    }
  }, [isLoggedIn, user, navigate, location.pathname]);

  return children;
}

GuestGuard.propTypes = { children: PropTypes.any };
