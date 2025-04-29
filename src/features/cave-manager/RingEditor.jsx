import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { TextField, Grid, CircularProgress, Alert, Button, Typography, Divider } from '@mui/material';
import * as Yup from 'yup';

import { fetcher, fetcherPut } from 'utils/axios';
import RingPlot from './RingPlot';

const validationSchema = Yup.object().shape({});

export default function RingEditor() {
  const { loc: location_id } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetcher(`/prod-actual/prod-rings/${location_id}/`)
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
      await fetcherPut(`/prod-actual/prod-rings/${location_id}/`, values);
      setSubmitting(false);
    } catch (err) {
      console.error('Submission failed:', err);
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
      {({ isSubmitting, values }) => (
        <>
          <Grid container spacing={3}>
            {/* === Left: Form Sections === */}
            <Grid item xs={12} lg={7}>
              <Form>
                <Grid container spacing={3}>
                  {/* === Production === */}
                  <Grid item xs={12}>
                    <Typography variant="h6">Production</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Field name="to_bog" label="Tonnes to Bog" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="bogged" label="Bogged Tonnes" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="remaining_tonnes" label="Remaining Tonnes" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="detonator_type" label="Detonator Type" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="designed_kg_emulsion" label="Designed kg Emulsion" as={TextField} fullWidth />
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* === Engineering === */}
                  <Grid item xs={12}>
                    <Typography variant="h6">Engineering</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Field name="designed_tonnes" label="In Situ Tonnes" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="draw_percentage" label="Draw %" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="draw_deviation" label="Draw Deviation" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="dump" label="Dump" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="azimuth" label="Azimuth" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="holes" label="Number of Holes" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="diameters" label="Hole Diameters" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="drill_meters" label="Drill Meters" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="drill_look_direction" label="Look Direction" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="designed_to_suit" label="Designed For" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="burden" label="Burden" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="blastsolids_volume" label="BlastSolids Volume" as={TextField} fullWidth />
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* === Geology === */}
                  <Grid item xs={12}>
                    <Typography variant="h6">Geology</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Field name="has_pyrite" label="Has Pyrite" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="in_water_zone" label="In Water Zone" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="in_overdraw_zone" label="Overdraw Zone" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="overdraw_amount" label="Overdraw Amount" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="dome_entry" label="Dome Entry" as={TextField} fullWidth />
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* === Geotechnical === */}
                  <Grid item xs={12}>
                    <Typography variant="h6">Geotechnical</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Field name="cable_bolted" label="Cable Bolted" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="area_rehab" label="Area Rehab" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="ungrouted_ddh" label="Ungrouted DDH" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="fault" label="Fault" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="prox_to_void" label="Prox to Void" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="redrilled" label="Redrilled" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="bg_report" label="Broken Ground" as={TextField} fullWidth />
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* === Planning === */}
                  <Grid item xs={12}>
                    <Typography variant="h6">Planning</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Field name="density" label="Density (g/cm³)" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="pgca_modelled_tonnes" label="Modelled Tonnes" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="modelled_au" label="Au (g/t)" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="modelled_cu" label="Cu (%)" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="blastsolids_id" label="Blast Solid ID" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="x" label="Avg X" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2">Avg Y</Typography>
                        <Typography variant="body1" color="secondary">
                          {values.y}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="z" label="Avg Z" as={TextField} fullWidth />
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* === Survey === */}
                  <Grid item xs={12}>
                    <Typography variant="h6">Survey</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Field name="markup_for" label="Markup For" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="markup_date" label="Markup Date" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="avg_x" label="Avg X" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="avg_y" label="Avg Y" as={TextField} fullWidth InputProps={{ readOnly: true }} />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="avg_z" label="Avg Z (RL)" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="to_wop" label="To WOP (m)" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="to_eop" label="To EOP (m)" as={TextField} fullWidth />
                      </Grid>
                      <Grid item xs={4}>
                        <Field name="hole_data" label="Hole Data" as={TextField} fullWidth />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      Save Changes
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            </Grid>
            {/* === Right: RingPlot, outside the form === */}
            <Grid item xs={12} lg={5}>
              <RingPlot holeData={values.hole_data} azimuth={values.azimuth} />
            </Grid>
          </Grid>
        </>
      )}
    </Formik>
  );
}
