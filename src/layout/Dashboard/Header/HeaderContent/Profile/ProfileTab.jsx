import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// icons
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import UnorderedListOutlined from '@ant-design/icons/UnorderedListOutlined';

// ==============================|| PROFILE TAB MENU ||============================== //

export default function ProfileTab({ handleLogout, handleClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const pathToIndex = {
      '/profile/profile': 0,
      '/profile/settings': 1,
      '/profile/history': 2
    };
    setSelectedIndex(pathToIndex[location.pathname] ?? 0);
  }, [location.pathname]);

  const handleListItemClick = (event, index, route = '') => {
    setSelectedIndex(index);
    if (handleClose) handleClose(event);

    if (route) {
      navigate(route);
    }
  };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0, '/profile/profile')}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Edit Profile" />
      </ListItemButton>

      <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1, '/profile/settings')}>
        <ListItemIcon>
          <SettingOutlined />
        </ListItemIcon>
        <ListItemText primary="Preference Settings" />
      </ListItemButton>

      <ListItemButton selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2, '/profile/history')}>
        <ListItemIcon>
          <UnorderedListOutlined />
        </ListItemIcon>
        <ListItemText primary="History" />
      </ListItemButton>

      <ListItemButton selected={selectedIndex === 3} onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
}

ProfileTab.propTypes = {
  handleLogout: PropTypes.func.isRequired,
  handleClose: PropTypes.func
};
