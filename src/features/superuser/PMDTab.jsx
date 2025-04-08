// material-ui
import Grid from '@mui/material/Grid';

// project imports
import ExplosiveTypes from 'features/superuser/ExplosiveTypeSetting';
import RingConditionList from 'features/superuser/ConditionsSetting';
import DupeUpload from 'features/superuser/DupeDropzone';
import DupeFileDateAlert from 'features/superuser/DupeFileDateAlert';

function TabPMD() {
  const headers = {};
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={6}>
        <DupeUpload />
      </Grid>
      <Grid item xs={12} md={8} lg={6}>
        <DupeFileDateAlert />
      </Grid>
      <Grid item xs={12} md={8} lg={6}>
        <ExplosiveTypes />
      </Grid>
      <Grid item xs={12} md={8} lg={6}>
        <RingConditionList />
      </Grid>
    </Grid>
  );
}

export default TabPMD;
