import { DashboardOutlined, ToolOutlined, FileSearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import commonMenuGroup from './common';
import ManageHistoryOutlinedIcon from '@mui/icons-material/ManageHistoryOutlined';
import ArchitectureOutlinedIcon from '@mui/icons-material/ArchitectureOutlined';
import SquareFootOutlinedIcon from '@mui/icons-material/SquareFootOutlined';

const menuItems = {
  items: [
    // 2. Role-specific tools
    {
      id: 'prod-eng-group',
      title: 'Engineering',
      type: 'group',
      children: [
        {
          id: 'dash',
          title: 'dashboard',
          type: 'item',
          url: '/prod-eng/dashboard',
          icon: DashboardOutlined
        },
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
            },
            {
              id: 'concept-rings',
              title: 'Concept Rings',
              type: 'item',
              url: '/prod-eng/prod-concept'
            },
            {
              id: 'prod-orphans',
              title: 'Orphaned Rings',
              type: 'item',
              url: '/prod-eng/prod-orphans'
            }
          ]
        }
      ]
    }
  ]
};

export default menuItems;
