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
    if (isLoggedIn) {
      const defaultRoute = getUserDashboardPath(user);
      navigate(location?.state?.from || defaultRoute);
    }
  }, [isLoggedIn, user, navigate, location]);

  return children;
}

GuestGuard.propTypes = { children: PropTypes.any };
