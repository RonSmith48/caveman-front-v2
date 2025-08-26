// RingInspectForm.jsx
import React, { useMemo } from 'react';
import { Formik, Form } from 'formik';
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
import ConditionsCard from './components/ConditionsCard';
import DiscourseCard from './components/DiscourseCard';
import RingPlotPanel from './components/RingPlotPanel';
import validationSchema from './validationSchema';
import { fetcherPut } from 'utils/axiosBack';
import useAuth from 'hooks/useAuth';
import { parseShkey, buildShkey } from 'utils/shkey';

// 👇 Configure ALL shkey-backed fields in one place
const SHKEY_FIELDS = [
  { db: 'drill_complete_shift', date: 'drill_complete_date', shift: 'drill_complete_shift_label' },
  { db: 'charge_shift', date: 'charge_date', shift: 'charge_shift_label' },
  { db: 'fired_shift', date: 'fired_date', shift: 'fired_shift_label' },
  { db: 'bog_complete_shift', date: 'bog_complete_date', shift: 'bog_complete_shift_label' }
];

export default function RingInspectForm({ initialValues }) {
  const location_id = initialValues.location_id;
  const { user } = useAuth();

  // Hydrate split fields from DB values once
  const derivedInitials = useMemo(() => {
    const v = { ...initialValues };
    SHKEY_FIELDS.forEach(({ db, date, shift }) => {
      const { date: d, shift: s } = parseShkey(initialValues[db] || '');
      v[date] = d;
      v[shift] = s;
    });
    return v;
  }, [initialValues]);

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
      const payload = { ...values };

      // Compose each SHKEY from its split fields and strip the splits from the payload
      SHKEY_FIELDS.forEach(({ db, date, shift }) => {
        payload[db] = buildShkey(values[date], values[shift]);
        delete payload[date];
        delete payload[shift];
      });

      await fetcherPut(`/api/prod-actual/prod-rings/${location_id}/`, payload);
      enqueueSnackbar('Ring successfully updated', { variant: 'success' });
    } catch (err) {
      console.error('Submission failed:', err);
      enqueueSnackbar('Error saving ring', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={derivedInitials} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize validateOnMount>
      {({ isSubmitting, isValid, values, setFieldValue }) => (
        <MainCard
          title={<Typography variant="h4">{values.alias}</Typography>}
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
                  {cardOrder.map((cardKey) => {
                    if (!cardVisibility[values.status]?.includes(cardKey)) return null;
                    const canEdit = roleEdit[user.role]?.includes(cardKey) ?? false;
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
