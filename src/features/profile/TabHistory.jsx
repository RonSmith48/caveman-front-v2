'use client';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

// project import
import MainCard from 'components/MainCard';
import Profile from 'features/wagtail-cms/Profile';

// ==============================|| ACCOUNT PROFILE - SETTINGS ||============================== //

export default function TabHistory() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard title="Placeholder One">
              <Stack spacing={2.5}></Stack>
            </MainCard>
          </Grid>
          <Grid item xs={12}>
            <MainCard title="Placeholder Two">
              <Stack spacing={2.5}></Stack>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6}>
        <MainCard title="Placeholder Three">
          <Stack spacing={2.5}></Stack>
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
          <Profile />
        </Stack>
      </Grid>
    </Grid>
  );
}
