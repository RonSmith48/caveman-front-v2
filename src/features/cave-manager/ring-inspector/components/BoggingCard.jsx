import React from 'react';
import { useFormikContext, Field } from 'formik';
import { Box, Card, CardContent, FormControlLabel, TextField, Typography, Divider, Grid, Stack, Switch } from '@mui/material';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import IconButton from '@mui/material/IconButton';
import StatusSection from './StatusSection';
import ParentChooserModal from 'features/konva/ParentChooserModal';

export default function BoggingCard({ isEditable }) {
  // grab whatever you need from Formik
  const { values } = useFormikContext();

  return (
    <Card sx={{ mb: 2 }}>
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
            <Field name="draw_deviation" label="Draw Deviation" as={TextField} fullWidth disabled={!values.is_active} />
          </Grid>
          <Grid item xs={6}>
            <Field name="bog_complete_shift" label="Bogging Complete Shift" as={TextField} fullWidth disabled={!values.is_active} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
