import { DashboardOutlined, ToolOutlined, FileSearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const menuItems = {
  items: [
    // 1. Top-level dashboard link
    {
      id: 'prod-eng-dashboard-group',
      title: 'Dashboard',
      type: 'group',
      children: [
        {
          id: 'prod-eng-dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: DashboardOutlined,
          url: '/prod-eng'
        }
      ]
    },

    // 2. Role-specific tools
    {
      id: 'prod-eng',
      title: 'Engineering',
      type: 'group',
      children: [
        {
          id: 'bdcf',
          title: 'BDCF entries',
          type: 'item',
          url: '/prod-eng/bdcf',
          icon: QuestionCircleOutlined
        },
        {
          id: 'production',
          title: 'Cave Management',
          type: 'collapse',
          icon: ToolOutlined,
          children: [
            {
              id: 'level-status',
              title: 'Level Status',
              type: 'item',
              url: '/prod-eng/level-status'
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
          id: 'drill-blast',
          title: 'Drill & Blast',
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
      title: 'Common',
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
