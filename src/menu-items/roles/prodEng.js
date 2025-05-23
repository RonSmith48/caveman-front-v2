import { DashboardOutlined, ToolOutlined, FileSearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import commonMenuGroup from './common';
import ManageHistoryOutlinedIcon from '@mui/icons-material/ManageHistoryOutlined';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import SquareFootOutlinedIcon from '@mui/icons-material/SquareFootOutlined';

const menuItems = {
  items: [
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
          id: 'ring-editor',
          title: 'Ring editor',
          type: 'item',
          url: '/prod-eng/ring-editor',
          icon: PrecisionManufacturingIcon
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
            }
          ]
        }
      ]
    }
  ]
};

export default menuItems;
