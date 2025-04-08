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
          id: 'dupe',
          title: 'PMD Dupe',
          type: 'item',
          url: '/settings/dupe'
        }
      ]
    }
  ]
};

export default superuserMenuGroup;
