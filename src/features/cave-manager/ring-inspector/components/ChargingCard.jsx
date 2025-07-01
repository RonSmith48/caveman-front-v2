import React from 'react';
import { useFormikContext, Field } from 'formik';
import { Box, Card, CardContent, FormControlLabel, TextField, Typography, Divider, Grid, Stack, Switch } from '@mui/material';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import IconButton from '@mui/material/IconButton';
import StatusSection from './StatusSection';
import ParentChooserModal from 'features/konva/ParentChooserModal';

export default function ChargingCard({ isEditable }) {
  // grab whatever you need from Formik
  const { values } = useFormikContext();
  const nullValue = 'No Value';

  return (
    <Card sx={{ mb: 2 }}>
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
            <Field name="detonator_actual" label="Detonator Used" as={TextField} fullWidth disabled={!values.is_active} />
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
  );
}
