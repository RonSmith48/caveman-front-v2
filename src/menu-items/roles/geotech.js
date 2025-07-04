import { DashboardOutlined, ToolOutlined, FileSearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import commonMenuGroup from './common';

const menuItems = {
  items: [
    {
      id: 'geotech-group',
      title: 'Geotechnical',
      type: 'group',
      children: [
        {
          id: 'geotech-dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: DashboardOutlined,
          url: '/geotech/dashboard'
        },
        {
          id: 'prod-geotech',
          title: 'production',
          type: 'collapse',
          icon: FactoryOutlinedIcon,
          children: [
            {
              id: 'ring-inspector',
              title: 'ring-inspector',
              type: 'item',
              url: '/prod-eng/ring-inspector'
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
