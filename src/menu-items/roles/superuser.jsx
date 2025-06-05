import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
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
      type: 'item',
      icon: EngineeringOutlinedIcon,
      url: '/sudo/site-admin'
    }
  ]
};

export default superuserMenuGroup;
