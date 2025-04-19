import React, { useState } from 'react';
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Tooltip } from '@mui/material';
import MainCard from 'components/MainCard';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

import RingDesignDrop from 'features/ring-design/RingDesignDrop';
import ProdOrphansWidget from './ProdOrphansWidget';
import WidgetTonnesGrade from 'features/ring-design/StopeSummaryWidget';

export default function RingDesign() {
  const [openHelp, setOpenHelp] = useState(false);

  return (
    <Grid container justifyContent="left" spacing={2}>
      <Grid item xs={12} lg={7}>
        <MainCard
          title="Ring Design"
          secondary={
            <Tooltip title="Help">
              <IconButton onClick={() => setOpenHelp(true)} size="small">
                <HelpOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          }
        >
          <Box sx={{ p: 3 }}>
            <RingDesignDrop />
          </Box>

          {/* Help Dialog */}
          <Dialog open={openHelp} onClose={() => setOpenHelp(false)} fullWidth>
            <DialogTitle>How it Works</DialogTitle>
            <DialogContent>
              <p>How it works goes here</p>
            </DialogContent>
          </Dialog>
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
