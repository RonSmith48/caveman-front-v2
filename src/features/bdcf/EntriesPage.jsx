import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

// material-ui
import { Box, IconButton, Tab, Tabs, Tooltip } from '@mui/material';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import GrainOutlinedIcon from '@mui/icons-material/GrainOutlined';
import PatternOutlinedIcon from '@mui/icons-material/PatternOutlined';
import FlareOutlinedIcon from '@mui/icons-material/FlareOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

// project import
import MainCard from 'components/MainCard';
import BDCFBogTab from 'features/bdcf/BogTab';
import BDCFDrillTab from 'features/bdcf/DrillTab';
import BDCFChargeTab from 'features/bdcf/ChargeTab';
import BDCFFireTab from 'features/bdcf/FireTab';
import BDCFGroupTab from 'features/bdcf/GroupTab1';
import BDCFReportsTab from 'features/bdcf/ReportsTab';

// help dialogs
import BogHelp from 'features/bdcf/BogHelp';
import ChargeHelp from 'features/bdcf/ChargeHelp';
import DrillHelp from 'features/bdcf/DrillHelp';
import FireHelp from 'features/bdcf/FireHelp';
import ReportsHelp from 'features/bdcf/ReportsHelp';

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
  const tabIndex = tabLabels.indexOf(tab?.toLowerCase()) ?? 0;

  const [openHelp, setOpenHelp] = useState(false);

  const handleChange = (event, newValue) => {
    // preserve existing base path (like /prod-eng/bdcf/)
    const base = location.pathname.split('/').slice(0, -1).join('/');
    navigate(`${base}/${tabLabels[newValue]}`);
  };

  const handleHelpOpen = () => setOpenHelp(true);
  const handleHelpClose = () => setOpenHelp(false);

  return (
    <>
      <MainCard>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabIndex} onChange={handleChange} aria-label="bdcf tabs" sx={{ flexGrow: 1 }}>
              <Tab label="Bog" icon={<FactoryOutlinedIcon />} iconPosition="start" {...a11yProps(0)} />
              <Tab label="Drill" icon={<GrainOutlinedIcon />} iconPosition="start" {...a11yProps(1)} />
              <Tab label="Charge" icon={<PatternOutlinedIcon />} iconPosition="start" {...a11yProps(2)} />
              <Tab label="Fire" icon={<FlareOutlinedIcon />} iconPosition="start" {...a11yProps(3)} />
              <Tab label="Groups" icon={<AccountTreeOutlinedIcon />} iconPosition="start" {...a11yProps(4)} />
              <Tab label="Reports" icon={<NoteAddIcon />} iconPosition="start" {...a11yProps(5)} />
            </Tabs>

            {tabIndex !== 4 && (
              <Tooltip title="Help">
                <IconButton onClick={handleHelpOpen} size="small">
                  <HelpOutlineOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <TabPanel currentTab={tabIndex} index={0}>
            <BDCFBogTab />
          </TabPanel>
          <TabPanel currentTab={tabIndex} index={1}>
            <BDCFDrillTab />
          </TabPanel>
          <TabPanel currentTab={tabIndex} index={2}>
            <BDCFChargeTab />
          </TabPanel>
          <TabPanel currentTab={tabIndex} index={3}>
            <BDCFFireTab />
          </TabPanel>
          <TabPanel currentTab={tabIndex} index={4}>
            <BDCFGroupTab />
          </TabPanel>
          <TabPanel currentTab={tabIndex} index={5}>
            <BDCFReportsTab />
          </TabPanel>
        </Box>
      </MainCard>

      {tabIndex === 0 && <BogHelp open={openHelp} onClose={handleHelpClose} />}
      {tabIndex === 1 && <DrillHelp open={openHelp} onClose={handleHelpClose} />}
      {tabIndex === 2 && <ChargeHelp open={openHelp} onClose={handleHelpClose} />}
      {tabIndex === 3 && <FireHelp open={openHelp} onClose={handleHelpClose} />}
      {tabIndex === 5 && <ReportsHelp open={openHelp} onClose={handleHelpClose} />}
    </>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number,
  index: PropTypes.number,
  other: PropTypes.any
};
