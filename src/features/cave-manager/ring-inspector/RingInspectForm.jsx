// RingInspectForm.jsx
import React from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import { Button, Grid2, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { enqueueSnackbar } from 'notistack';
import { cardOrder, cardVisibility, roleEdit } from './cardConfig';
import ActivityCard from './components/ActivityCard';
import DesignCard from './components/DesignCard';
import DrillingCard from './components/DrillingCard';
import ChargingCard from './components/ChargingCard';
import BoggingCard from './components/BoggingCard';
import GeologyCard from './components/GeologyCard';
import GeotechCard from './components/GeotechCard';
import DiscourseCard from './components/DiscourseCard';
import ConditionsCard from './components/ConditionsCard';
import RingPlotPanel from './components/RingPlotPanel';
import validationSchema from './validationSchema';
import { fetcherPut } from 'utils/axiosBack';
import useAuth from 'hooks/useAuth';

export default function RingInspectForm({ initialValues }) {
  const location_id = initialValues.location_id;
  const { user } = useAuth();

  const components = {
    activity: ActivityCard,
    design: DesignCard,
    drilling: DrillingCard,
    charging: ChargingCard,
    bogging: BoggingCard,
    geology: GeologyCard,
    geotechnical: GeotechCard,
    conditions: ConditionsCard
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await fetcherPut(`/api/prod-actual/prod-rings/${location_id}/`, values);
      enqueueSnackbar('Ring successfully updated', { variant: 'success' });
    } catch (err) {
      console.error('Submission failed:', err);
      enqueueSnackbar('Error saving ring', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
      {({ isSubmitting, isValid, values, setFieldValue }) => (
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
          <Grid2 container spacing={1}>
            <Grid2 size={{ xs: 12, md: 8 }}>
              <Form>
                <Grid2 container spacing={1}>
                  {/* Loop through your ordered card keys */}
                  {cardOrder.map((cardKey) => {
                    // 1) should this card show for the current status?
                    if (!cardVisibility[values.status]?.includes(cardKey)) {
                      return null;
                    }

                    // 2) can this user's role edit this card?
                    const canEdit = roleEdit[user.role]?.includes(cardKey) ?? false;

                    // 3) pick the right component and pass isEditable
                    const CardComp = components[cardKey];
                    return (
                      <Grid2 size={{ xs: 12, md: 6 }} key={cardKey}>
                        <CardComp isEditable={canEdit} />
                      </Grid2>
                    );
                  })}
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Button type="submit" variant="contained" disabled={isSubmitting || !isValid} sx={{ mt: 2 }}>
                    Save Changes
                  </Button>
                </Grid2>
              </Form>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <DiscourseCard />
              <RingPlotPanel holeData={values.hole_data} azimuth={values.azimuth} />
            </Grid2>
          </Grid2>
        </MainCard>
      )}
    </Formik>
  );
}
