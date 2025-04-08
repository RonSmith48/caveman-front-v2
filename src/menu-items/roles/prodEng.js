import { DashboardOutlined, ToolOutlined, FileSearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import commonMenuGroup from './common';
import ManageHistoryOutlinedIcon from '@mui/icons-material/ManageHistoryOutlined';
import ArchitectureOutlinedIcon from '@mui/icons-material/ArchitectureOutlined';
import SquareFootOutlinedIcon from '@mui/icons-material/SquareFootOutlined';

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
          icon: FactoryOutlinedIcon
        },
        {
          id: 'production',
          title: 'Cave Management',
          type: 'collapse',
          icon: ManageHistoryOutlinedIcon,
          children: [
            {
              id: 'level-status',
              title: 'Level Status',
              type: 'item',
              url: '/prod-eng/level-status'
            },
            {
              id: 'daily-plan',
              title: 'Daily Plan',
              type: 'item',
              url: '/prod-eng/daily-plan'
            }
          ]
        },
        {
          id: 'drill-blast',
          title: 'Drill & Blast',
          type: 'collapse',
          icon: SquareFootOutlinedIcon,
          children: [
            {
              id: 'ring-design',
              title: 'Ring Design',
              type: 'item',
              url: '/prod-eng/ring-design'
            }
          ]
        }
      ]
    }
  ]
};

export default menuItems;
