// material-ui
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthCodeVerification from 'sections/auth/session/AuthCodeVerification';

// ================================|| JWT - CODE VERIFICATION ||================================ //

export default function CodeVerification() {
  const storedUser = sessionStorage.getItem('pendingVerificationUser');
  let displayName = '';
  let email = '';
  let user = null;

  if (storedUser) {
    user = JSON.parse(storedUser);
    displayName = user.first_name;
    email = user.email || '';
  }

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Stack sx={{ gap: 1 }}>
            <Typography variant="h3">Enter Verification Code</Typography>
            <Typography color="secondary">
              {user?.first_name && `Hi ${user.first_name}, `}
              please enter the code we emailed to <strong>{user?.email}</strong>
            </Typography>
          </Stack>
        </Grid>
        <Grid size={12}>
          <AuthCodeVerification user={user} />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
