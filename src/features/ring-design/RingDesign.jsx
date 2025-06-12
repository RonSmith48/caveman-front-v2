import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import MainCard from 'components/MainCard';
import HelpDialog from 'components/HelpDialog';

import RingDesignDrop from 'features/ring-design/RingDesignDrop';
import ProdOrphansWidget from './ProdOrphansWidget';
import WidgetTonnesGrade from 'features/ring-design/StopeSummaryWidget';

export default function RingDesign() {
  return (
    <Grid container justifyContent="left" spacing={2}>
      <Grid item xs={12} lg={7}>
        <MainCard title="Ring Design" secondary={<HelpDialog id={11} />}>
          <Box sx={{ p: 3 }}>
            <RingDesignDrop />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} lg={4}>
        <ProdOrphansWidget />
      </Grid>
      <Grid item xs={12} lg={5}>
        <WidgetTonnesGrade />
      </Grid>
    </Grid>
  );
}
