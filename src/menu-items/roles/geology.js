import { DashboardOutlined, ToolOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import commonMenuGroup from './common';

const menuItems = {
  items: [
    {
      id: 'geology-group',
      title: 'geology',
      type: 'group',
      children: [
        {
          id: 'geology-dashboard',
          title: 'dashboard',
          type: 'item',
          icon: DashboardOutlined,
          url: '/geology/dashboard'
        },
        {
          id: 'prod-geo',
          title: 'production',
          type: 'collapse',
          icon: FactoryOutlinedIcon,
          children: [
            {
              id: 'fired-rings',
              title: 'fired-rings',
              type: 'item',
              url: '/geology/fired-rings'
            },
            {
              id: 'overdraw',
              title: 'overdraw',
              type: 'item',
              url: '/geology/overdraw'
            },
            {
              id: 'parent-checker',
              title: 'parent-checker',
              type: 'item',
              url: '/geology/parent-checker'
            }
          ]
        },
        {
          id: 'reports',
          title: 'reports',
          type: 'collapse',
          icon: ToolOutlined,
          children: [
            {
              id: 'monthly-report',
              title: 'monthly-report',
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
