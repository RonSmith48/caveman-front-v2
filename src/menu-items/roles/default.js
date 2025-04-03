import { DashboardOutlined, ToolOutlined, FileSearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const menuItems = {
  items: [
    // 1. Top-level dashboard link
    {
      id: 'default-dashboard-group',
      title: 'Dashboard',
      type: 'group',
      children: [
        {
          id: 'default-dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: DashboardOutlined,
          url: '/dashboard'
        }
      ]
    },

    // 2. Role-specific tools
    {
      id: 'Default-tools',
      title: 'Viewers',
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
    },

    // 3. Common shared items
    {
      id: 'common',
      title: 'Other',
      type: 'group',
      children: [
        {
          id: 'help',
          title: 'Help & Support',
          type: 'item',
          url: '/common/help',
          icon: QuestionCircleOutlined
        },
        {
          id: 'contact',
          title: 'Contact Admin',
          type: 'item',
          url: '/common/contact',
          icon: QuestionCircleOutlined
        }
      ]
    }
  ]
};

export default menuItems;
