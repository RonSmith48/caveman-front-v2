import React from 'react';
import { Grid2 } from '@mui/material';
import FiredRingGradesWidget from 'features/geology/FiredRingGradesWidget';
import TaskCompletionWidget from 'features/geology/TaskCompletionWidget';
import MainCard from 'components/MainCard';

const FiredRingsPage = () => {
  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12, sm: 8, md: 6, lg: 5 }}>
        <FiredRingGradesWidget />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 8, md: 6, lg: 5 }}>
        <TaskCompletionWidget />
      </Grid2>
    </Grid2>
  );
};

export default FiredRingsPage;
