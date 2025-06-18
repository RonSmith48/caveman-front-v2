import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import SyncAltOutlinedIcon from '@mui/icons-material/SyncAltOutlined';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';

const superuserMenuGroup = {
  id: 'super',
  title: 'administration',
  type: 'group',
  children: [
    {
      id: 'settings',
      title: 'settings',
      type: 'collapse',
      icon: SettingsOutlinedIcon,
      children: [
        {
          id: 'pmd',
          title: 'pmd',
          type: 'item',
          url: '/sudo/settings'
        },
        {
          id: 'manage-users',
          title: 'manage-users',
          type: 'item',
          url: '/sudo/users'
        }
      ]
    },
    {
      id: 'import-export',
      title: 'import-export',
      type: 'item',
      icon: SyncAltOutlinedIcon,
      url: '/sudo/import-export'
    },
    {
      id: 'site-admin',
      title: 'site-admin',
      type: 'collapse',
      icon: EngineeringOutlinedIcon,
      children: [
        {
          id: 'manage-cms',
          title: 'manage-cms',
          type: 'item',
          url: '/sudo/manage-cms'
        }
      ]
    },
    {
      id: 'logs',
      title: 'logs',
      type: 'item',
      icon: TerminalOutlinedIcon,
      url: '/sudo/logs'
    }
  ]
};

export default superuserMenuGroup;
