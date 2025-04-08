import React from 'react';
import { Box, Typography } from '@mui/material';
import MainCard from 'components/MainCard';

import RingDesignDrop from 'features/ring-design/RingDesignDrop';

export default function RingDesign() {
  return (
    <MainCard title="Ring Design">
      <Box sx={{ p: 3 }}>
        <RingDesignDrop />
      </Box>
    </MainCard>
  );
}
