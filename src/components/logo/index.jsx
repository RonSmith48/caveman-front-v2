import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material-ui
import ButtonBase from '@mui/material/ButtonBase';

// project imports
import Logo from './LogoMain';
import LogoIcon from './LogoIcon';
import { APP_DEFAULT_PATH } from 'config';
import useAuth from 'hooks/useAuth';
import getUserDashboardPath from 'utils/getUserDashboardPath';

// ==============================|| MAIN LOGO ||============================== //

export default function LogoSection({ reverse, isIcon, sx, to }) {
  const { user } = useAuth();
  const defaultLink = getUserDashboardPath(user); // 👈 get smart default

  return (
    <ButtonBase disableRipple component={Link} to={to || defaultLink} sx={sx}>
      {isIcon ? <LogoIcon /> : <Logo reverse={reverse} />}
    </ButtonBase>
  );
}

LogoSection.propTypes = {
  reverse: PropTypes.bool,
  isIcon: PropTypes.bool,
  sx: PropTypes.any,
  to: PropTypes.any
};
