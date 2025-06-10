import { useState, useEffect } from 'react';
import useAuth from 'hooks/useAuth';

// material-ui
import {
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Checkbox,
  FormControlLabel
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { fetcher, fetcherPost, fetcherPatch } from 'utils/axiosBack';

// third party
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { enqueueSnackbar } from 'notistack';

// ==============================|| ACCOUNT PROFILE - SETTINGS ||============================== //

export default function TabSettings() {
  const [settings, setSettings] = useState({
    'equipment-sounds': false,
    'notification-sound': false
  });
  const [loading, setLoading] = useState(true);
  const [isNew, setIsNew] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const fetchSettings = async () => {
      try {
        const data = await fetcher(`/api/settings/user-${user.id}/`);
        if (data?.data?.value) {
          setSettings(data.data.value);
        } else {
          setIsNew(true);
        }
      } catch (error) {
        console.error('Setting does not exist:', error);
        setIsNew(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    'equipment-sounds': Yup.boolean(),
    'notification-sound': Yup.boolean()
  });

  // Submit Handler
  const handleSubmit = async (values) => {
    const payload = {
      key: `user-${user.id}`,
      value: values
    };

    try {
      if (isNew) {
        await fetcherPost('/api/settings/', payload);
        enqueueSnackbar('Personal preferences created', { variant: 'success' });
      } else {
        await fetcherPatch(`/api/settings/user-${user.id}/`, payload);
        enqueueSnackbar('Personal preferences updated', { variant: 'success' });
      }
      setSettings(values);
    } catch (error) {
      console.error('Error saving preferences:', error);
      enqueueSnackbar('Error saving preferences', { variant: 'error' });
    }
  };

  return (
    <Formik enableReinitialize initialValues={settings} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ values, handleChange, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <MainCard title="Sound & Vision Settings">
                    <Stack spacing={2.5}>
                      {loading ? (
                        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 100 }}>
                          <CircularProgress />
                        </Stack>
                      ) : (
                        <List sx={{ p: 0, '& .MuiListItem-root': { p: 0, py: 0.25 } }}>
                          <ListItem>
                            <ListItemText primary={<Typography color="secondary">Play activity sound when processing</Typography>} />
                            <Checkbox checked={values['equipment-sounds']} onChange={handleChange} name="equipment-sounds" />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary={<Typography color="secondary">Play sound on notification</Typography>} />
                            <Checkbox checked={values['notification-sound']} onChange={handleChange} name="notification-sound" />
                          </ListItem>
                        </List>
                      )}
                    </Stack>
                  </MainCard>
                </Grid>

                <Grid item xs={12}>
                  <MainCard title="System Notification">
                    <Stack spacing={2.5}>
                      <List sx={{ p: 0, '& .MuiListItem-root': { p: 0, py: 0.25 } }}>
                        <ListItem>
                          <ListItemText primary={<Typography color="secondary">Lorem ipsum odor amet</Typography>} />
                          <Checkbox defaultChecked />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary={<Typography color="secondary">Habitasse quam montes</Typography>} />
                          <Checkbox defaultChecked />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary={<Typography color="secondary">Hac iaculis nullam</Typography>} />
                          <Checkbox />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary={<Typography color="secondary">Vulputate mi ad quam</Typography>} />
                          <Checkbox />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary={<Typography color="secondary">Ligula molestie litora</Typography>} />
                          <Checkbox />
                        </ListItem>
                      </List>
                    </Stack>
                  </MainCard>
                </Grid>
              </Grid>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              <MainCard title="Activity Related Emails">
                <Stack spacing={2.5}>
                  <Typography variant="subtitle1">When to email?</Typography>
                  <List sx={{ p: 0, '& .MuiListItem-root': { p: 0, py: 0.25 } }}>
                    <ListItem>
                      <ListItemText primary={<Typography color="secondary">Etiam ultricies nisi vel augue</Typography>} />
                      <Checkbox defaultChecked />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={<Typography color="secondary">Curabitur ullamcorper ultricies nisi</Typography>} />
                      <Checkbox />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={<Typography color="secondary">Maecenas nec odio et ante tincidunt</Typography>} />
                      <Checkbox defaultChecked />
                    </ListItem>
                  </List>
                  <Divider />
                  <Typography variant="subtitle1">When to escalate emails?</Typography>
                  <List sx={{ p: 0, '& .MuiListItem-root': { p: 0, py: 0.25 } }}>
                    <ListItem>
                      <ListItemText primary={<Typography color="secondary.light">Sed consequat</Typography>} />
                      <Checkbox defaultChecked disabled />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={<Typography color="secondary.light">Nam quam nunc, blandit vel</Typography>} />
                      <Checkbox disabled />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={<Typography color="secondary">Etiam ultricies nisi vel augue</Typography>} />
                      <Checkbox defaultChecked />
                    </ListItem>
                  </List>
                </Stack>
              </MainCard>
            </Grid>

            {/* Submit Buttons */}
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                <Button type="submit" variant="contained" disabled={loading}>
                  Update Profile
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
