import { QuestionCircleOutlined } from '@ant-design/icons';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';

const commonMenuGroup = {
  id: 'other',
  title: 'other',
  type: 'group',
  children: [
    {
      id: 'maps',
      title: 'level-maps',
      type: 'item',
      url: '/common/maps',
      icon: LocationOnOutlinedIcon
    },
    {
      id: 'docs',
      title: 'documentation',
      type: 'item',
      url: '/common/docs',
      icon: MenuBookOutlinedIcon
    }
  ]
};

export default commonMenuGroup;
