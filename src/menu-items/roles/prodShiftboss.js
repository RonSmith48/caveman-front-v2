import { DashboardOutlined, ToolOutlined, FileSearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import commonMenuGroup from './common';

const menuItems = {
  items: [
    {
      id: 'prodsb-group',
      title: 'Production',
      type: 'group',
      children: [
        {
          id: 'prodsb-dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: DashboardOutlined,
          url: '/prod/dashboard'
        },
        {
          id: 'tools',
          title: 'Tools',
          type: 'collapse',
          icon: ToolOutlined,
          children: [
            {
              id: 'blast-designer',
              title: 'Blast Designer',
              type: 'item',
              url: '/prod-eng/tools/blast'
            },
            {
              id: 'charge-calculator',
              title: 'Charge Calculator',
              type: 'item',
              url: '/prod-eng/tools/charge'
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
