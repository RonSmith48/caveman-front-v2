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
      title: 'engineering',
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
          id: 'ring-inspector',
          title: 'ring-inspector',
          type: 'item',
          url: '/prod-eng/ring-inspector',
          icon: PrecisionManufacturingIcon
        },
        {
          id: 'bdcf',
          title: 'bdcf-entries',
          type: 'item',
          url: '/prod-eng/bdcf',
          icon: FactoryOutlinedIcon
        },
        {
          id: 'production',
          title: 'cave-management',
          type: 'collapse',
          icon: ManageHistoryOutlinedIcon,
          children: [
            {
              id: 'level-status',
              title: 'level-status',
              type: 'item',
              url: '/prod-eng/level-status'
            },
            {
              id: 'daily-plan',
              title: 'daily-plan',
              type: 'item',
              url: '/prod-eng/daily-plan'
            }
          ]
        },
        {
          id: 'drill-blast',
          title: 'drill-blast',
          type: 'collapse',
          icon: SquareFootOutlinedIcon,
          children: [
            {
              id: 'ring-design',
              title: 'ring-design',
              type: 'item',
              url: '/prod-eng/ring-design'
            },
            {
              id: 'concept-rings',
              title: 'concept-rings',
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
