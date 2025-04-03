import PropTypes from 'prop-types';
import React, { useContext, useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { preload } from 'swr';

// project imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import useAuth from 'hooks/useAuth';
import JWTContext from 'contexts/JWTContext';
import { fetcher } from 'utils/axios';
import getUserDashboardPath from 'utils/getUserDashboardPath';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin({ isDemo = false }) {
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const [searchParams] = useSearchParams();
  const auth = searchParams.get('auth');
  const navigate = useNavigate();

  const { login, isLoggedIn, user } = useAuth();
  const { devLogin } = useContext(JWTContext);

  useEffect(() => {
    if (isLoggedIn && user) {
      const path = getUserDashboardPath(user);
      navigate(path);
    }
  }, [isLoggedIn, user, navigate]);

  return (
    <>
      <Formik
        initialValues={{
          email: 'info@codedthemes.com',
          password: '123456',
          submit: null,
          devDept: ''
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string()
            .required('Password is required')
            .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value.trim())
            .max(10, 'Password must be less than 10 characters')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const trimmedEmail = values.email.trim();
            await login(trimmedEmail, values.password);
            setStatus({ success: true });
            setSubmitting(false);
            preload('api/menu/dashboard', fetcher);
          } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <>
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid xs={12}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="email-login">Email Address</InputLabel>
                    <OutlinedInput
                      id="email-login"
                      type="email"
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      fullWidth
                      error={Boolean(touched.email && errors.email)}
                    />
                  </Stack>
                  {touched.email && errors.email && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid xs={12}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="password-login">Password</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.password && errors.password)}
                      id="password-login"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            color="secondary"
                          >
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          </IconButton>
                        </InputAdornment>
                      }
                      placeholder="Enter password"
                    />
                  </Stack>
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid xs={12} sx={{ mt: -1 }}>
                  <Stack direction="row" sx={{ gap: 2, alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked}
                          onChange={(event) => setChecked(event.target.checked)}
                          name="checked"
                          color="primary"
                          size="small"
                        />
                      }
                      label={<Typography variant="h6">Keep me sign in</Typography>}
                    />
                    <Link
                      variant="h6"
                      component={RouterLink}
                      to={isDemo ? '/auth/forgot-password' : auth ? `/${auth}/forgot-password?auth=jwt` : '/forgot-password'}
                      color="text.primary"
                    >
                      Forgot Password?
                    </Link>
                  </Stack>
                </Grid>

                {errors.submit && (
                  <Grid xs={12}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Grid>
                )}

                <Grid xs={12}>
                  <AnimateButton>
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Login
                    </Button>
                  </AnimateButton>
                </Grid>
              </Grid>
            </form>

            {/* ✅ DEV ONLY: Quick Login for Testing */}
            <Grid container spacing={2} sx={{ mt: 4 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Quick Login (Dev Only)</Typography>
              </Grid>
              <Grid item xs={12}>
                <InputLabel id="dev-dept-label">Select Department</InputLabel>
                <select
                  id="dev-dept-select"
                  name="devDept"
                  style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                  value={values.devDept || ''}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    -- Choose a department --
                  </option>
                  <option value="prod-eng">Production Engineer</option>
                  <option value="prod-shiftboss">Production Shiftboss</option>
                  <option value="geology">Geology</option>
                  <option value="geotech">Geotechnical</option>
                </select>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => {
                    if (values.devDept) {
                      devLogin(values.devDept);
                    }
                  }}
                >
                  Dev Login
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </Formik>
    </>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
