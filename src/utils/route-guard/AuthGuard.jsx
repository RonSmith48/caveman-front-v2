import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// project imports
import useAuth from 'hooks/useAuth';

// ==============================|| AUTH GUARD ||============================== //

export default function AuthGuard({ children }) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      const intendedPath = location.pathname;
      sessionStorage.setItem('callbackUrl', intendedPath);
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate, location.pathname]);

  return isLoggedIn ? children : null;
}

AuthGuard.propTypes = { children: PropTypes.any };
