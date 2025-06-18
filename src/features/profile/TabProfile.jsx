import { useState, useContext } from 'react';
import useAuth from 'hooks/useAuth';

// material-ui
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import MainCard from 'components/MainCard';
import AvatarSelectionModal from 'features/profile/AvatarSelectionModal';
import ProfileAvatar from 'components/ProfileAvatar';
import { enqueueSnackbar } from 'notistack';

const roles = [
  'Manager',
  'Mine Captain',
  'Production Shiftboss',
  'Development Shiftboss',
  'Operations Shiftboss',
  'Production Engineer',
  'Development Engineer',
  'Geotechnical Engineer',
  'Electrical Engineer',
  'Mechanical Engineer',
  'Geologist',
  'Surveyor',
  'Mobile Maint Planner',
  'Pitram Operator'
];

export default function TabProfile() {
  const { user, updateProfile } = useAuth();
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'default.svg');
  const AVATAR_SIZE = 150;

  const updateUserProfile = async (values) => {
    try {
      const response = await updateProfile(values);
    } catch (error) {
      console.error('Error updating profile:', error);
      enqueueSnackbar('Failed to update profile', { variant: 'error' });
    }
  };

  if (!user) return <CircularProgress />;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={4} xl={3}>
        <MainCard>
          <Stack spacing={3} alignItems="center">
            <div
              style={{
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
              }}
            >
              <Tooltip title="Choose avatar" arrow>
                {/* <IconButton
                  onClick={() => setAvatarModalOpen(true)}
                  sx={{
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE,
                    padding: 0
                  }}
                > */}
                <ProfileAvatar user={{ ...user, avatar: selectedAvatar }} size={AVATAR_SIZE} />
                {/* </IconButton> */}
              </Tooltip>
            </div>
            <Stack spacing={0.5} alignItems="center">
              <Typography variant="h5">{user.full_name}</Typography>
              <Typography color="secondary">{user.role}</Typography>
            </Stack>
            <Divider flexItem sx={{ my: 1 }} />
            <List sx={{ width: '100%', py: 0 }}>
              <ListItem disableGutters>
                <Stack spacing={0.5}>
                  <Typography variant="subtitle1">Email</Typography>
                  <Typography>{user.email}</Typography>
                </Stack>
              </ListItem>

              <ListItem disableGutters>
                <Stack spacing={0.5}>
                  <Typography variant="subtitle1">Signup Date</Typography>
                  <Typography>{new Date(user.start_date).toLocaleDateString('en-GB')}</Typography>
                </Stack>
              </ListItem>
            </List>
          </Stack>
        </MainCard>
      </Grid>

      <Grid item xs={12} sm={7} md={8} xl={9}>
        <MainCard content={false} title="Personal Information">
          <Formik
            initialValues={{
              first_name: user.first_name || '',
              last_name: user.last_name || '',
              initials: user.initials || '',
              email: user.email || '',
              role: user.role || '',
              avatar: selectedAvatar
            }}
            validationSchema={Yup.object().shape({
              first_name: Yup.string().max(255).required('First Name is required.'),
              last_name: Yup.string().max(255).required('Last Name is required.'),
              initials: Yup.string().max(3).required('Initials are required.'),
              role: Yup.string().required('Designation is required')
            })}
            onSubmit={async (values, { setErrors, setSubmitting }) => {
              try {
                await updateUserProfile(values);
                setSubmitting(false);
              } catch (err) {
                setErrors({ submit: err.message });
                setSubmitting(false);
              }
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <AvatarSelectionModal
                  isOpen={avatarModalOpen}
                  handleClose={() => setAvatarModalOpen(false)}
                  handleSelect={(avatar) => {
                    setSelectedAvatar(avatar);
                    setFieldValue('avatar', avatar);
                  }}
                />

                <Box sx={{ p: 2.5 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="personal-first-name">First Name</InputLabel>
                        <TextField
                          fullWidth
                          id="personal-first-name"
                          value={values.first_name}
                          name="first_name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="First Name"
                          autoFocus
                        />
                        {touched.first_name && errors.first_name && <FormHelperText error>{errors.first_name}</FormHelperText>}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="personal-last-name">Last Name</InputLabel>
                        <TextField
                          fullWidth
                          id="personal-last-name"
                          value={values.last_name}
                          name="last_name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Last Name"
                        />
                        {touched.last_name && errors.last_name && <FormHelperText error>{errors.last_name}</FormHelperText>}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="personal-initials">Initials</InputLabel>
                        <TextField
                          fullWidth
                          id="personal-initials"
                          value={values.initials}
                          name="initials"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Initials"
                        />
                        {touched.initials && errors.initials && <FormHelperText error>{errors.initials}</FormHelperText>}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1.25}>
                        <InputLabel htmlFor="personal-designation">Primary Role</InputLabel>
                        <Select
                          fullWidth
                          id="personal-designation"
                          value={values.role}
                          name="role"
                          onBlur={handleBlur}
                          onChange={handleChange}
                        >
                          {roles.map((i) => (
                            <MenuItem key={i} value={i}>
                              {i}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.role && errors.role && <FormHelperText error>{errors.role}</FormHelperText>}
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ p: 2.5 }}>
                  <Stack direction="row" justifyContent="flex-end">
                    <Button disabled={isSubmitting || Object.keys(errors).length !== 0} type="submit" variant="contained">
                      Save
                    </Button>
                  </Stack>
                </Box>
              </form>
            )}
          </Formik>
        </MainCard>
      </Grid>
    </Grid>
  );
}
