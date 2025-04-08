import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

const superuserMenuGroup = {
  id: 'super',
  title: 'Administration',
  type: 'group',
  children: [
    {
      id: 'settings',
      title: 'Settings',
      type: 'collapse',
      icon: SettingsOutlinedIcon,
      children: [
        {
          id: 'pmd',
          title: 'PMD',
          type: 'item',
          url: '/sudo/settings/pmd'
        },
        {
          id: 'manage-users',
          title: 'Manage Users',
          type: 'item',
          url: '/sudo/users'
        }
      ]
    }
  ]
};

export default superuserMenuGroup;
