import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetcherPost } from 'utils/axiosAuth';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';
import OtpInput from 'react-otp-input';

// project imports
import AnimateButton from 'components/@extended/AnimateButton';
import { enqueueSnackbar } from 'notistack';

// ============================|| SESSION - CODE VERIFICATION ||============================ //

export default function AuthCodeVerification({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.email) {
      navigate('/register', { replace: true });
    }
  }, [navigate, user]);

  return (
    <Formik
      initialValues={{ otp: '' }}
      validationSchema={Yup.object().shape({
        otp: Yup.string().length(4, 'Code must be exactly 4 digits').required('Code is required')
      })}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          // call session-based activation endpoint
          const response = await fetcherPost('activate/', {
            email: user.email,
            otp: values.otp
          });

          const msg = response.data?.msg;
          if (msg?.type === 'success') {
            enqueueSnackbar(msg.body, { variant: 'success' });
            navigate('/login', { replace: true });
          } else {
            setErrors({ otp: msg?.body || 'Invalid code' });
          }
        } catch (err) {
          console.error(err);
          setErrors({ otp: 'Something went wrong. Please try again.' });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleSubmit, touched, values, setFieldValue, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid xs={12}>
              <Box
                sx={{
                  '& input': {
                    border: '1px solid',
                    borderColor: touched.otp && errors.otp ? 'error.main' : 'divider',
                    '&:focus-visible': {
                      outline: 'none !important',
                      borderColor: 'primary.main',
                      boxShadow: (theme) => theme.customShadows.primary
                    }
                  }
                }}
              >
                <OtpInput
                  value={values.otp}
                  onChange={(otp) => setFieldValue('otp', otp)}
                  numInputs={4}
                  inputType="tel"
                  shouldAutoFocus
                  renderInput={(props, index) => <input {...props} />}
                  containerStyle={{ justifyContent: 'space-between', margin: -8 }}
                  inputStyle={{ width: '100%', margin: '8px', padding: '10px', outline: 'none', borderRadius: 4 }}
                />
                {touched.otp && errors.otp && <FormHelperText error>{errors.otp}</FormHelperText>}
              </Box>
            </Grid>
            <Grid xs={12}>
              <AnimateButton>
                <Button disableElevation fullWidth size="large" type="submit" variant="contained" disabled={isSubmitting}>
                  Continue
                </Button>
              </AnimateButton>
            </Grid>
            <Grid xs={12}>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Did not receive the code? Check your spam folder.</Typography>
                <Typography
                  variant="body1"
                  sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                  color="primary"
                  onClick={() => navigate('/forgot-password', { replace: true })}
                >
                  Resend code
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
