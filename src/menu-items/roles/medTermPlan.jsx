import { DashboardOutlined, ToolOutlined, FileSearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import commonMenuGroup from './common';

const menuItems = {
  items: [
    // 1. Top-level dashboard link
    {
      id: 'mtp-dashboard-group',
      title: 'Dashboard',
      type: 'group',
      children: [
        {
          id: 'mtp-dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: DashboardOutlined,
          url: '/mtp'
        }
      ]
    },

    // 2. Role-specific tools
    {
      id: 'mtp-tools',
      title: 'Planning',
      type: 'group',
      children: [
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
              url: '/mtp/tools/blast'
            },
            {
              id: 'charge-calculator',
              title: 'Charge Calculator',
              type: 'item',
              url: '/mtp/tools/charge'
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
              url: '/mtp/reports/monthly'
            }
          ]
        }
      ]
    }
  ]
};

export default menuItems;
