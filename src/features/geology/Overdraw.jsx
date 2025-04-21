import React from 'react';
import { Grid2 } from '@mui/material';
import OverdrawWidget from 'features/geology/OverdrawWidget';

const OverdrawPage = () => {
  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12, md: 9, lg: 8 }}>
        <OverdrawWidget />
      </Grid2>
    </Grid2>
  );
};

export default OverdrawPage;
