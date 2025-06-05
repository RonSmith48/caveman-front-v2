import { DashboardOutlined, ToolOutlined, FileSearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import commonMenuGroup from './common';

const menuItems = {
  items: [
    {
      id: 'common-group',
      title: 'dashboard',
      type: 'group',
      children: [
        {
          id: 'common-dashboard',
          title: 'dashboard',
          type: 'item',
          icon: DashboardOutlined,
          url: '/dashboard'
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
