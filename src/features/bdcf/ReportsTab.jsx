import { Box, Card, CardContent, Grid, Button, Typography } from '@mui/material';
import GenerateLSRCard from 'features/bdcf/GenerateLSRCard';
import FiredRingGradesWidget from 'features/geology/FiredRingGradesWidget';
import DCFWidget from 'features/bdcf/DCFWidget';
import BogVerifyWidget from 'features/bdcf/BogVerifyWidget';

function BDCFReportsTab() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={8} md={6} lg={5}>
        <GenerateLSRCard />
      </Grid>
      <Grid item xs={12} sm={8} md={6} lg={5}>
        <DCFWidget />
      </Grid>
      <Grid item xs={12} sm={8} md={6} lg={5}>
        <FiredRingGradesWidget />
      </Grid>
      <Grid item xs={12} sm={8} md={6} lg={5}>
        <BogVerifyWidget />
      </Grid>
    </Grid>
  );
}
export default BDCFReportsTab;
