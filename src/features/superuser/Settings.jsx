import React, { useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import MainCard from 'components/MainCard';

import PMDTab from 'features/superuser/PMDTab';
// import FMUpdateUpload from './TabFMConcept';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} role="tabpanel">
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function SudoSettings() {
  const [value, setValue] = useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <MainCard>
      <Box sx={{ width: '100%' }}>
        <Tabs value={value} onChange={handleChange} aria-label="settings tabs">
          <Tab label="PMD" />
          <Tab label="Item Two" />
          <Tab label="Item Three" />
        </Tabs>

        <TabPanel value={value} index={0}>
          <Typography variant="h5" gutterBottom>
            Production Management Database
          </Typography>
          <PMDTab />
        </TabPanel>

        <TabPanel value={value} index={1}>
          {/* <FMUpdateUpload /> */}
          Item Two
        </TabPanel>

        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
      </Box>
    </MainCard>
  );
}
