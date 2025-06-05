'use client';

import React, { useState, useEffect } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

// third party
import { Formik } from 'formik';
import * as Yup from 'yup';
import { enqueueSnackbar } from 'notistack';

// project imports
import MainCard from 'components/MainCard';
import { fetcher, fetcherPost, fetcherPatch } from 'utils/axiosBack';

function ConceptCSVHeadersForm() {
  const [headers, setHeaders] = useState(null); // State to store API data
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await fetcher('/settings/concept_csv_headers'); // Using the fetcher function
      if (data) {
        setHeaders(data.data.value); // Assuming the setting value is stored in `value`
      } else {
        setHeaders({});
      }
    } catch (error) {
      console.error('Error fetching settings:', error); // If the setting does not exist
      setHeaders({});
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (values) => {
    const payload = {
      key: 'concept_csv_headers', // Unique key for the setting
      value: values // Save all form fields as JSON
    };

    try {
      if (headers && Object.keys(headers).length > 0) {
        // Update setting if it exists
        await fetcherPatch(`/settings/concept_csv_headers/`, payload);
        enqueueSnackbar('CSV file headers updated', { variant: 'success' });
      } else {
        // Create new setting if it does not exist
        await fetcherPost('/settings/', payload);
        enqueueSnackbar('CSV file headers setting created', { variant: 'success' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      enqueueSnackbar('Error saving setting', { variant: 'error' });
    }
  };

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <MainCard title="EPS Link CSV File Headers" secondary="help">
      {!loading ? (
        <Formik
          initialValues={{
            id: headers?.id || '',
            level: headers?.level || '',
            heading: headers?.heading || '',
            drive: headers?.drive || '',
            name: headers?.name || '',
            loc: headers?.loc || '',
            x: headers?.x || '',
            y: headers?.y || '',
            z: headers?.z || '',
            tonnes: headers?.tonnes || '',
            draw_zone: headers?.draw_zone || '',
            density: headers?.density || '',
            au: headers?.au || '',
            cu: headers?.cu || '',
            predecessors: headers?.predecessors || '',
            successors: headers?.successors || ''
          }}
          validationSchema={Yup.object().shape({
            id: Yup.string().max(50).required('This is a required field.'),
            level: Yup.string().max(50).required('This is a required field.'),
            heading: Yup.string().max(50).required('This is a required field.'),
            drive: Yup.string().max(50).required('This is a required field.'),
            name: Yup.string().max(50).required('This is a required field.'),
            loc: Yup.string().max(50).required('This is a required field.'),
            x: Yup.string().max(50).required('This is a required field.'),
            y: Yup.string().max(50).required('This is a required field.'),
            z: Yup.string().max(50).required('This is a required field.'),
            tonnes: Yup.string().max(50).required('This is a required field.'),
            draw_zone: Yup.string().max(50).required('This is a required field.'),
            density: Yup.string().max(50).required('This is a required field.'),
            au: Yup.string().max(50).required('This is a required field.'),
            cu: Yup.string().max(50).required('This is a required field.'),
            predecessors: Yup.string().max(50).required('This is a required field.'),
            successors: Yup.string().max(50).required('This is a required field.')
          })}
          onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
            setSubmitting(true);
            saveSettings(values)
              .then(() => {
                setStatus({ success: true });
              })
              .catch((err) => {
                setStatus({ success: false });
                setErrors({ submit: err.message });
              })
              .finally(() => {
                setSubmitting(false);
              });
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <Box component="form" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={8} lg={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3} lg={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                      <InputLabel sx={{ textAlign: { xs: 'left', sm: 'right' } }}>ID :</InputLabel>
                    </Grid>
                    <Grid item xs={12} sm={9} lg={8}>
                      <TextField fullWidth id="headers-id" value={values.id} name="id" onBlur={handleBlur} onChange={handleChange} />
                      {touched.id && errors.id && (
                        <FormHelperText error id="headers-id-helper">
                          {errors.id}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={8} lg={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3} lg={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                      <InputLabel sx={{ textAlign: { xs: 'left', sm: 'right' } }}>Level :</InputLabel>
                    </Grid>
                    <Grid item xs={12} sm={9} lg={8}>
                      <TextField
                        fullWidth
                        id="headers-level"
                        value={values.level}
                        name="level"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {touched.level && errors.level && (
                        <FormHelperText error id="headers-level-helper">
                          {errors.level}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={8} lg={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3} lg={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                      <InputLabel sx={{ textAlign: { xs: 'left', sm: 'right' } }}>Heading :</InputLabel>
                    </Grid>
                    <Grid item xs={12} sm={9} lg={8}>
                      <TextField
                        fullWidth
                        id="headers-heading"
                        value={values.heading}
                        name="heading"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {touched.heading && errors.heading && (
                        <FormHelperText error id="headers-heading-helper">
                          {errors.heading}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={8} lg={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3} lg={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                      <InputLabel sx={{ textAlign: { xs: 'left', sm: 'right' } }}>Drive :</InputLabel>
                    </Grid>
                    <Grid item xs={12} sm={9} lg={8}>
                      <TextField
                        fullWidth
                        id="headers-drive"
                        value={values.drive}
                        name="drive"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {touched.drive && errors.drive && (
                        <FormHelperText error id="headers-drive-helper">
                          {errors.drive}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={8} lg={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3} lg={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                      <InputLabel sx={{ textAlign: { xs: 'left', sm: 'right' } }}>Name :</InputLabel>
                    </Grid>
                    <Grid item xs={12} sm={9} lg={8}>
                      <TextField fullWidth id="headers-name" value={values.name} name="name" onBlur={handleBlur} onChange={handleChange} />
                      {touched.name && errors.name && (
                        <FormHelperText error id="headers-name-helper">
                          {errors.name}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={8} lg={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3} lg={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                      <InputLabel sx={{ textAlign: { xs: 'left', sm: 'right' } }}>Loc :</InputLabel>
                    </Grid>
                    <Grid item xs={12} sm={9} lg={8}>
                      <TextField fullWidth id="headers-loc" value={values.loc} name="loc" onBlur={handleBlur} onChange={handleChange} />
                      {touched.loc && errors.loc && (
                        <FormHelperText error id="headers-loc-helper">
                          {errors.loc}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={8} lg={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3} lg={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                      <InputLabel sx={{ textAlign: { xs: 'left', sm: 'right' } }}>X :</InputLabel>
                    </Grid>
                    <Grid item xs={12} sm={9} lg={8}>
                      <TextField fullWidth id="headers-x" value={values.x} name="x" onBlur={handleBlur} onChange={handleChange} />
                      {touched.x && errors.x && (
                        <FormHelperText error id="headers-x-helper">
                          {errors.x}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={8} lg={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3} lg={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                      <InputLabel sx={{ textAlign: { xs: 'left', sm: 'right' } }}>Y :</InputLabel>
                    </Grid>
                    <Grid item xs={12} sm={9} lg={8}>
                      <TextField fullWidth id="headers-y" value={values.y} name="y" onBlur={handleBlur} onChange={handleChange} />
                      {touched.y && errors.y && (
                        <FormHelperText error id="headers-y-helper">
                          {errors.y}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={8} lg={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3} lg={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                      <InputLabel sx={{ textAlign: { xs: 'left', sm: 'right' } }}>Z :</InputLabel>
                    </Grid>
                    <Grid item xs={12} sm={9} lg={8}>
                      <TextField fullWidth id="headers-z" value={values.z} name="z" onBlur={handleBlur} onChange={handleChange} />
                      {touched.z && errors.z && (
                        <FormHelperText error id="headers-z-helper">
                          {errors.z}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={8} lg={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3} lg={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                      <InputLabel sx={{ textAlign: { xs: 'left', sm: 'right' } }}>Draw :</InputLabel>
                    </Grid>
                    <Grid item xs={12} sm={9} lg={8}>
                      <TextField
                        fullWidth
                        id="headers-draw_zone"
                        value={values.draw_zone}
                        name="draw_zone"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {touched.draw_zone && errors.draw_zone && (
                        <FormHelperText error id="headers-draw_zone-helper">
                          {errors.draw_zone}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={8} lg={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3} lg={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                      <InputLabel sx={{ textAlign: { xs: 'left', sm: 'right' } }}>Density :</InputLabel>
                    </Grid>
                    <Grid item xs={12} sm={9} lg={8}>
                      <TextField
                        fullWidth
                        id="headers-density"
                        value={values.density}
                        name="density"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {touched.density && errors.density && (
                        <FormHelperText error id="headers-density-helper">
                          {errors.density}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={8} lg={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3} lg={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                      <InputLabel sx={{ textAlign: { xs: 'left', sm: 'right' } }}>Au :</InputLabel>
                    </Grid>
                    <Grid item xs={12} sm={9} lg={8}>
                      <TextField fullWidth id="headers-au" value={values.au} name="au" onBlur={handleBlur} onChange={handleChange} />
                      {touched.au && errors.au && (
                        <FormHelperText error id="headers-au-helper">
                          {errors.au}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={8} lg={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3} lg={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                      <InputLabel sx={{ textAlign: { xs: 'left', sm: 'right' } }}>Cu :</InputLabel>
                    </Grid>
                    <Grid item xs={12} sm={9} lg={8}>
                      <TextField fullWidth id="headers-cu" value={values.cu} name="cu" onBlur={handleBlur} onChange={handleChange} />
                      {touched.cu && errors.cu && (
                        <FormHelperText error id="headers-cu-helper">
                          {errors.cu}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={8} lg={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3} lg={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                      <InputLabel sx={{ textAlign: { xs: 'left', sm: 'right' } }}>Tonnes :</InputLabel>
                    </Grid>
                    <Grid item xs={12} sm={9} lg={8}>
                      <TextField
                        fullWidth
                        id="headers-tonnes"
                        value={values.tonnes}
                        name="tonnes"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {touched.tonnes && errors.tonnes && (
                        <FormHelperText error id="headers-tonnes-helper">
                          {errors.tonnes}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={8} lg={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3} lg={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                      <InputLabel sx={{ textAlign: { xs: 'left', sm: 'right' } }}>Predecessors :</InputLabel>
                    </Grid>
                    <Grid item xs={12} sm={9} lg={8}>
                      <TextField
                        fullWidth
                        id="headers-predecessors"
                        value={values.predecessors}
                        name="predecessors"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {touched.predecessors && errors.predecessors && (
                        <FormHelperText error id="headers-predecessors-helper">
                          {errors.predecessors}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={8} lg={6}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3} lg={4} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
                      <InputLabel sx={{ textAlign: { xs: 'left', sm: 'right' } }}>Successors :</InputLabel>
                    </Grid>
                    <Grid item xs={12} sm={9} lg={8}>
                      <TextField
                        fullWidth
                        id="headers-successors"
                        value={values.successors}
                        name="successors"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {touched.successors && errors.successors && (
                        <FormHelperText error id="headers-successors-helper">
                          {errors.successors}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Box sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                  <Button disabled={isSubmitting || Object.keys(errors).length !== 0} type="submit" variant="contained">
                    Save
                  </Button>
                </Stack>
              </Box>
            </Box>
          )}
        </Formik>
      ) : (
        <CircularProgress />
      )}
    </MainCard>
  );
}

export default ConceptCSVHeadersForm;
