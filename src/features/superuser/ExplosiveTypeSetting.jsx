'use client';

import React, { useState, useEffect } from 'react';

// Material-UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import DeleteIcon from '@mui/icons-material/Delete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// Third-party
import { Formik } from 'formik';
import { enqueueSnackbar } from 'notistack';

// Project imports
import MainCard from 'components/MainCard';
import { fetcher, fetcherPost, fetcherPatch } from 'utils/axiosBack';

function ExplosiveTypes() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState('');
  const [isNew, setIsNew] = useState(false);

  const fetchSettings = async () => {
    try {
      const data = await fetcher('/settings/explosive-types-list/');
      if (data) {
        setSettings(data.data.value || []);
      } else {
        setSettings([]);
        setIsNew(true);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setSettings([]);
      setIsNew(true);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (values) => {
    const payload = {
      key: 'explosive-types-list',
      value: values
    };

    try {
      if (isNew) {
        await fetcherPost('/settings/', payload);
        enqueueSnackbar('Explosives list created', { variant: 'success' });
      } else {
        await fetcherPatch('/settings/explosive-types-list/', payload);
        enqueueSnackbar('Explosives list settings updated', { variant: 'success' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      enqueueSnackbar('Error saving setting', { variant: 'error' });
    }
  };

  const addItem = () => {
    if (newItem.trim()) {
      setSettings((prev) => [...prev, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index) => {
    setSettings((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <MainCard title="Detonator & Explosive Types" secondary="Help">
      {!loading ? (
        <Formik
          enableReinitialize
          initialValues={{ explosiveTypes: settings }}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            saveSettings(values.explosiveTypes).finally(() => setSubmitting(false));
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Box component="form" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Form Section */}
                <Grid item xs={12} md={5}>
                  <Stack spacing={2}>
                    <TextField fullWidth label="New Explosive Type" value={newItem} onChange={(e) => setNewItem(e.target.value)} />
                    <Button variant="contained" onClick={addItem} disabled={!newItem.trim()}>
                      Add
                    </Button>
                  </Stack>
                  <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
                    <Button type="submit" variant="contained" disabled={isSubmitting || settings.length === 0}>
                      Save
                    </Button>
                  </Stack>
                </Grid>

                {/* Table Section */}
                <Grid item xs={12} md={7}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <strong>Explosive Type</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>Actions</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {settings.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item}</TableCell>
                            <TableCell align="right">
                              <IconButton edge="end" onClick={() => removeItem(index)}>
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Box>
          )}
        </Formik>
      ) : (
        <CircularProgress />
      )}
    </MainCard>
  );
}

export default ExplosiveTypes;
