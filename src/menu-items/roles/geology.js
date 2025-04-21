import { DashboardOutlined, ToolOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import commonMenuGroup from './common';

const menuItems = {
  items: [
    {
      id: 'geology-group',
      title: 'Geology',
      type: 'group',
      children: [
        {
          id: 'geology-dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: DashboardOutlined,
          url: '/geology/dashboard'
        },
        {
          id: 'prod-geo',
          title: 'Production',
          type: 'collapse',
          icon: FactoryOutlinedIcon,
          children: [
            {
              id: 'fired-rings',
              title: 'Fired Rings',
              type: 'item',
              url: '/geology/fired-rings'
            },
            {
              id: 'overdraw',
              title: 'Overdraw',
              type: 'item',
              url: '/geology/overdraw'
            }
          ]
        },
        {
          id: 'reports',
          title: 'Reports',
          type: 'collapse',
          icon: ToolOutlined,
          children: [
            {
              id: 'monthly-report',
              title: 'Monthly Report',
              type: 'item',
              url: '/prod-eng/reports/monthly'
            }
          ]
        }
      ]
    }
  ]
};

export default menuItems;
