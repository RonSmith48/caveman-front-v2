import { Link } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import { APP_DEFAULT_PATH } from 'config';

// assets
import construction from 'assets/images/maintenance/under-construction.svg';

// ==============================|| UNDER CONSTRUCTION - MAIN ||============================== //

export default function UnderConstruction() {
  return (
    <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '75vh', py: 2 }}>
      <Grid size={12}>
        <Stack sx={{ gap: 2, alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ width: { xs: 300, sm: 480 }, my: 1 }}>
            <CardMedia component="img" src={construction} alt="caveman" sx={{ height: 'auto' }} />
          </Box>
          <Typography align="center" variant="h1">
            Under Construction
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
}
