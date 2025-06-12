import PropTypes from 'prop-types';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

// material-ui
import { Box, Tab, Tabs } from '@mui/material';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import GrainOutlinedIcon from '@mui/icons-material/GrainOutlined';
import PatternOutlinedIcon from '@mui/icons-material/PatternOutlined';
import FlareOutlinedIcon from '@mui/icons-material/FlareOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

// project import
import MainCard from 'components/MainCard';
import BDCFBogTab from 'features/bdcf/BogTab';
import BDCFDrillTab from 'features/bdcf/DrillTab';
import BDCFChargeTab from 'features/bdcf/ChargeTab';
import BDCFFireTab from 'features/bdcf/FireTab';
import BDCFGroupTab from 'features/bdcf/GroupTab1';
import BDCFReportsTab from 'features/bdcf/ReportsTab';
import HelpDialog from 'components/HelpDialog';

function TabPanel({ children, currentTab, index, ...other }) {
  return (
    <div role="tabpanel" hidden={currentTab !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {currentTab === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

export default function BDCFEntries() {
  const tabLabels = ['bog', 'drill', 'charge', 'fire', 'groups', 'reports'];
  const { tab } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const tabIndex = tabLabels.indexOf(tab?.toLowerCase());
  const currentIndex = tabIndex === -1 ? 0 : tabIndex;

  const helpMap = {
    bog: 1,
    drill: 2,
    charge: 3,
    fire: 4,
    reports: 5
  };

  const handleChange = (event, newValue) => {
    const base = location.pathname.split('/').slice(0, -1).join('/');
    navigate(`${base}/${tabLabels[newValue]}`);
  };

  return (
    <>
      <MainCard>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentIndex} onChange={handleChange} aria-label="bdcf tabs" sx={{ flexGrow: 1 }}>
              <Tab label="Bog" icon={<FactoryOutlinedIcon />} iconPosition="start" {...a11yProps(0)} />
              <Tab label="Drill" icon={<GrainOutlinedIcon />} iconPosition="start" {...a11yProps(1)} />
              <Tab label="Charge" icon={<PatternOutlinedIcon />} iconPosition="start" {...a11yProps(2)} />
              <Tab label="Fire" icon={<FlareOutlinedIcon />} iconPosition="start" {...a11yProps(3)} />
              <Tab label="Groups" icon={<AccountTreeOutlinedIcon />} iconPosition="start" {...a11yProps(4)} />
              <Tab label="Reports" icon={<NoteAddIcon />} iconPosition="start" {...a11yProps(5)} />
            </Tabs>
            {currentIndex !== 4 && <HelpDialog id={helpMap[tabLabels[currentIndex]]} />}
          </Box>

          <TabPanel currentTab={currentIndex} index={0}>
            <BDCFBogTab />
          </TabPanel>
          <TabPanel currentTab={currentIndex} index={1}>
            <BDCFDrillTab />
          </TabPanel>
          <TabPanel currentTab={currentIndex} index={2}>
            <BDCFChargeTab />
          </TabPanel>
          <TabPanel currentTab={currentIndex} index={3}>
            <BDCFFireTab />
          </TabPanel>
          <TabPanel currentTab={currentIndex} index={4}>
            <BDCFGroupTab />
          </TabPanel>
          <TabPanel currentTab={currentIndex} index={5}>
            <BDCFReportsTab />
          </TabPanel>
        </Box>
      </MainCard>
    </>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  currentTab: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};
