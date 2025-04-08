import { QuestionCircleOutlined } from '@ant-design/icons';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';

const commonMenuGroup = {
  id: 'other',
  title: 'Other',
  type: 'group',
  children: [
    {
      id: 'maps',
      title: 'Level Maps',
      type: 'item',
      url: '/common/maps',
      icon: LocationOnOutlinedIcon
    },
    {
      id: 'docs',
      title: 'Documentation',
      type: 'item',
      url: '/common/docs',
      icon: MenuBookOutlinedIcon
    }
  ]
};

export default commonMenuGroup;
