import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

// project
import MainCard from 'components/MainCard';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import TabProfile from 'features/profile/TabProfile';
import TabHistory from 'features/profile/TabHistory';
import TabSettings from 'features/profile/TabSettings';

// icons
import UserOutlined from '@ant-design/icons/UserOutlined';
import UnorderedListOutlined from '@ant-design/icons/UnorderedListOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';

export default function Profile() {
  const { tab = 'profile' } = useParams();
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    navigate(`/profile/${newValue}`);
  };

  let breadcrumbTitle = 'Edit Profile';
  let breadcrumbHeading = 'Edit Profile';

  switch (tab) {
    case 'history':
      breadcrumbTitle = 'Activity History';
      break;
    case 'settings':
      breadcrumbTitle = 'Preference Settings';
      break;
    case 'profile':
    default:
      breadcrumbTitle = 'Edit Profile';
  }

  const breadcrumbLinks = [{ title: 'Home', to: '/' }, { title: 'Profile', to: '/profile' }, { title: breadcrumbTitle }];

  // useEffect can be adjusted if needed for menu tracking
  useEffect(() => {
    // placeholder for menu highlighting logic, if needed
  }, []);

  return (
    <>
      {/* <Breadcrumbs custom heading={breadcrumbHeading} links={breadcrumbLinks} /> */}
      <MainCard border={false} boxShadow>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs value={tab} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="profile tabs">
            <Tab label="Edit Profile" icon={<UserOutlined />} value="profile" iconPosition="start" />
            <Tab label="Preference Settings" icon={<SettingOutlined />} value="settings" iconPosition="start" />
            <Tab label="Activity History" icon={<UnorderedListOutlined />} value="history" iconPosition="start" />
          </Tabs>
        </Box>
        <Box sx={{ mt: 2.5 }}>
          {tab === 'profile' && <TabProfile />}
          {tab === 'settings' && <TabSettings />}
          {tab === 'history' && <TabHistory />}
        </Box>
      </MainCard>
    </>
  );
}

Profile.propTypes = { tab: PropTypes.string };
