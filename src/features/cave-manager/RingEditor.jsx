import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import {
  TextField,
  Box,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Button,
  Typography,
  Divider,
  Card,
  CardContent,
  FormControlLabel,
  Stack,
  Switch,
  Tooltip
} from '@mui/material';
import * as Yup from 'yup';

import { fetcher, fetcherPut } from 'utils/axiosBack';
import RingPlot from './RingPlot';
import MainCard from 'components/MainCard';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import EditStatusModal from 'features/cave-manager/EditStatusModal';
import ParentChooserModal from 'features/konva/ParentChooserModal';

const validationSchema = Yup.object().shape({});

export default function RingEditor() {
  const { loc: location_id } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const nullValue = 'No Value';

  useEffect(() => {
    fetcher(`/api/prod-actual/prod-rings/${location_id}/`)
      .then((res) => {
        setInitialValues(res.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log('the error', e);
        setError('Error loading ring data');
        setLoading(false);
      });
  }, [location_id]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!initialValues) return null;

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await fetcherPut(`/api/prod-actual/prod-rings/${location_id}/`, values);
      setSubmitting(false);
    } catch (err) {
      console.error('Submission failed:', err);
      setSubmitting(false);
    }
  };

  const hideChargingCard = ['Designed', 'Drilled', 'Abandoned'].includes(initialValues.status);
  const hideFireBogCard = ['Designed', 'Drilled', 'Charged', 'Abandoned'].includes(initialValues.status);

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
      {({ isSubmitting, values, setFieldValue }) => (
        console.log('formik values:', values),
        (
          <>
            <MainCard
              title={
                <Typography variant="h4" component="div">
                  {values.alias}
                </Typography>
              }
              sx={{ mb: 2 }}
              secondary={
                <Button
                  variant="contained"
                  color={values.is_active ? 'success' : 'secondary'}
                  onClick={() => setFieldValue('is_active', !values.is_active)}
                >
                  {values.is_active ? 'Active' : 'Inactive'}
                </Button>
              }
            >
              <Grid container spacing={1}>
                {/* === Left: Form Sections === */}
                <Grid item xs={12} sm={12} md={8} minWidth={500}>
                  <Form>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="h5">Activity</Typography>
                            <Divider sx={{ mb: 1, borderColor: 'primary.main' }} />
                            <Grid container spacing={1}>
                              <Grid item xs={4}>
                                <Typography variant="subtitle2">Status</Typography>
                                <Typography variant="body1" color="primary">
                                  {values.status}
                                </Typography>
                              </Grid>
                              <Grid item xs={8}>
                                <EditStatusModal values={values} />
                              </Grid>
                            </Grid>
                            <Typography variant="h6" sx={{ mt: 1 }}>
                              Discourse
                            </Typography>
                            <Divider sx={{ mb: 1 }} />
                            <Grid container spacing={1}>
                              <Grid item xs={12}>
                                <Typography variant="subtitle2">Bogging comment (as seen on Level Status Report)</Typography>
                                <Field name="comment" label="" as={TextField} fullWidth disabled={!values.is_active} />
                              </Grid>
                              <Grid item xs={9}>
                                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                                  People are discussing this location, join the discussion.
                                </Typography>
                              </Grid>
                              <Grid item xs={3}>
                                <IconButton aria-label="" color="primary" disabled={!values.is_active}>
                                  <QuestionAnswerOutlinedIcon />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="h5">Design</Typography>
                            <Divider sx={{ mb: 1, borderColor: '#9900ff' }} />
                            <Grid container spacing={1}>
                              <Grid item xs={4} xl={3}>
                                <Typography variant="subtitle2">Location ID</Typography>
                                <Typography variant="body1" color="textSecondary">
                                  {values.location_id}
                                </Typography>
                              </Grid>

                              <Grid item xs={4} xl={3}>
                                <Typography variant="subtitle2">Blastsolids Volume</Typography>
                                <Typography variant="body1" color="textSecondary">
                                  {values.blastsolids_volume}
                                </Typography>
                              </Grid>
                              <Grid item xs={4} xl={3}>
                                <Typography variant="subtitle2">Burden</Typography>
                                <Typography variant="body1" color="textSecondary">
                                  {values.burden}
                                </Typography>
                              </Grid>

                              <Grid item xs={4} xl={3}>
                                <Typography variant="subtitle2">Designed Tonnes</Typography>
                                <Typography variant="body1" color="textSecondary">
                                  {values.designed_tonnes}
                                </Typography>
                              </Grid>
                              <Grid item xs={4} xl={3}>
                                <Typography variant="subtitle2">Prod/Dev Code</Typography>
                                <Typography variant="body1" color="textSecondary">
                                  {values.prod_dev_code}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} xl={8}>
                                <Typography variant="subtitle2">Coordinates (X, Y, Z)</Typography>
                                <Typography variant="body1" color="textSecondary">
                                  ({Number(values.x).toFixed(4)}, {Number(values.y).toFixed(4)}, {Number(values.z).toFixed(4)})
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="subtitle2">Conceptual Parent</Typography>
                                <Box
                                  sx={{
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    px: 1,
                                    py: 0
                                  }}
                                >
                                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography
                                      variant="body1"
                                      color={values.concept_ring ? 'textSecondary' : 'warning'}
                                      fontWeight={values.concept_ring ? 'normal' : 'bold'}
                                    >
                                      {values.concept_ring || 'Orphaned Ring'}
                                    </Typography>

                                    <ParentChooserModal
                                      orphanLocationId={values.location_id}
                                      disabled={!values.is_active}
                                      onPair={(ring) => {
                                        // write only the slug into the form
                                        setFieldValue('concept_ring', ring.name);
                                      }}
                                    />
                                  </Stack>
                                </Box>
                              </Grid>
                              <Grid item xs={12} xl={6}>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={values.in_overdraw_zone || false}
                                      onChange={(e) => setFieldValue('in_overdraw_zone', e.target.checked)}
                                      name="in_overdraw_zone"
                                      color="primary"
                                      disabled={!values.is_active}
                                    />
                                  }
                                  label="In Overdraw Zone"
                                />
                              </Grid>
                              <Grid container spacing={1} sx={{ mt: 1 }}>
                                <Grid item xs={6}>
                                  <Field name="design_date" label="Design Date" as={TextField} fullWidth disabled={!values.is_active} />
                                </Grid>

                                <Grid item xs={6}>
                                  <Field name="draw_percentage" label="Draw %" as={TextField} fullWidth disabled={!values.is_active} />
                                </Grid>
                                <Grid item xs={6}>
                                  <Field name="description" label="Description" as={TextField} fullWidth disabled={!values.is_active} />
                                </Grid>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="h5">Drilling</Typography>
                            <Divider sx={{ mb: 1, borderColor: 'warning.main' }} />
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6} lg={4}>
                                <Typography variant="subtitle2">Azimuth</Typography>
                                <Typography variant="body1" color="textSecondary">
                                  {values.azimuth}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} lg={4}>
                                <Typography variant="subtitle2">Drill Look Direction</Typography>
                                <Typography variant="body1" color="textSecondary">
                                  {values.drill_look_direction}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} lg={4}>
                                <Typography variant="subtitle2">Drill Meters</Typography>
                                <Typography variant="body1" color="textSecondary">
                                  {values.drill_meters}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} lg={4}>
                                <Typography variant="subtitle2">Dump</Typography>
                                <Typography variant="body1" color="textSecondary">
                                  {values.dump}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} lg={4}>
                                <Typography variant="subtitle2">Holes</Typography>
                                <Typography variant="body1" color="textSecondary">
                                  {values.holes}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} lg={4}>
                                <Typography variant="subtitle2">Diameters</Typography>
                                <Typography variant="body1" color="textSecondary">
                                  {values.diameters}
                                </Typography>
                              </Grid>

                              <Grid item xs={6}>
                                <Field name="markup_for" label="Markup For" as={TextField} fullWidth disabled={!values.is_active} />
                              </Grid>
                              <Grid item xs={6}>
                                <Field name="markup_date" label="Markup Date" as={TextField} fullWidth disabled={!values.is_active} />
                              </Grid>
                              <Grid item xs={6}>
                                <Field name="designed_to_suit" label="Designed For" as={TextField} fullWidth disabled={!values.is_active} />
                              </Grid>
                              <Grid item xs={6}>
                                <Field
                                  name="drill_complete_shift"
                                  label="Drilling Complete Date"
                                  as={TextField}
                                  fullWidth
                                  disabled={!values.is_active || values.status === 'Designed'}
                                />
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                      {!hideChargingCard && (
                        <Grid item xs={6}>
                          <Card>
                            <CardContent>
                              <Typography variant="h5">Charging</Typography>
                              <Divider sx={{ mb: 1, borderColor: 'success.main' }} />
                              <Grid container spacing={2} sx={{ mb: 1 }}>
                                <Grid item xs={12} sm={6}>
                                  <Typography variant="subtitle2">Emulsion Est. Qty</Typography>
                                  <Typography variant="body1" color="textSecondary">
                                    {values.designed_emulsion_qty || nullValue}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <Typography variant="subtitle2">Designed Detonator</Typography>
                                  <Typography variant="body1" color="textSecondary">
                                    {values.detonator_designed || nullValue}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Field
                                    name="detonator_actual"
                                    label="Detonator Used"
                                    as={TextField}
                                    fullWidth
                                    disabled={!values.is_active}
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <Field name="charge_shift" label="Charge Date" as={TextField} fullWidth disabled={!values.is_active} />
                                </Grid>
                                <Grid item xs={6}>
                                  <Field name="fireby_date" label="Fire By" as={TextField} fullWidth disabled={!values.is_active} />
                                </Grid>
                              </Grid>
                              <Grid container spacing={2}></Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      )}
                      {!hideFireBogCard && (
                        <Grid item xs={6}>
                          <Card>
                            <CardContent>
                              <Typography variant="h5">Firing & Bogging</Typography>
                              <Divider sx={{ mb: 1, borderColor: 'error.main' }} />
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <Typography variant="subtitle2">Bogged Tonnes</Typography>
                                  <Typography variant="body1" color="textSecondary">
                                    {values.bogged_tonnes}
                                  </Typography>
                                </Grid>

                                <Grid item xs={6}>
                                  <Field name="fired_shift" label="Fired Shift" as={TextField} fullWidth disabled={!values.is_active} />
                                </Grid>
                                <Grid item xs={6}>
                                  <Field
                                    name="draw_deviation"
                                    label="Draw Deviation"
                                    as={TextField}
                                    fullWidth
                                    disabled={!values.is_active}
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <Field
                                    name="bog_complete_shift"
                                    label="Bogging Complete Shift"
                                    as={TextField}
                                    fullWidth
                                    disabled={!values.is_active}
                                  />
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      )}
                      <Grid item xs={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="h5">Geology</Typography>
                            <Divider sx={{ mb: 1, borderColor: '#000' }} />
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={values.has_pyrite || false}
                                      onChange={(e) => setFieldValue('has_pyrite', e.target.checked)}
                                      name="has_pyrite"
                                      color="primary"
                                      disabled={!values.is_active}
                                    />
                                  }
                                  label="Has Pyrite"
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={values.in_water_zone || false}
                                      onChange={(e) => setFieldValue('in_water_zone', e.target.checked)}
                                      name="in_water_zone"
                                      color="primary"
                                      disabled={!values.is_active}
                                    />
                                  }
                                  label="In Water Zone"
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <Field
                                  name="overdraw_amount"
                                  label="Overdraw Amount"
                                  as={TextField}
                                  fullWidth
                                  disabled={!values.is_active}
                                />
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="h5">Geotechnical</Typography>
                            <Divider sx={{ mb: 1, borderColor: '#000' }} />
                            <Grid container spacing={2}>
                              <Grid item xs={6} sm={4}>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={values.cable_bolted || false}
                                      onChange={(e) => setFieldValue('cable_bolted', e.target.checked)}
                                      name="cable_bolted"
                                      color="primary"
                                      disabled={!values.is_active}
                                    />
                                  }
                                  label="Cable Bolted"
                                />
                              </Grid>
                              <Grid item xs={6} sm={4}>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={values.area_rehab || false}
                                      onChange={(e) => setFieldValue('area_rehab', e.target.checked)}
                                      name="area_rehab"
                                      color="primary"
                                      disabled={!values.is_active}
                                    />
                                  }
                                  label="Area Rehab"
                                />
                              </Grid>
                              <Grid item xs={6} sm={4}>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={values.fault || false}
                                      onChange={(e) => setFieldValue('fault', e.target.checked)}
                                      name="fault"
                                      color="primary"
                                      disabled={!values.is_active}
                                    />
                                  }
                                  label="Fault"
                                />
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={3} sx={{ mt: 2 }}>
                      <Button type="submit" variant="contained" disabled={isSubmitting}>
                        Save Changes
                      </Button>
                    </Grid>
                  </Form>
                </Grid>

                {/* === Right: RingPlot, outside the form === */}
                <Grid item xs={12} sm={5} md={4}>
                  <RingPlot holeData={values.hole_data} azimuth={values.azimuth} />
                </Grid>
              </Grid>
            </MainCard>
          </>
        )
      )}
    </Formik>
  );
}
