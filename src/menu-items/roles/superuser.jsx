import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import SyncAltOutlinedIcon from '@mui/icons-material/SyncAltOutlined';

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
    }
  ]
};

export default superuserMenuGroup;
