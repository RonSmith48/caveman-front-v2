import React from 'react';
import { useFormikContext, Field } from 'formik';
import { Box, Card, CardContent, TextField, Typography, Divider, Grid2, Stack, Switch } from '@mui/material';

export default function DrillingCard({ isEditable }) {
  // grab whatever you need from Formik
  const { values } = useFormikContext();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5">Drilling</Typography>
        <Divider sx={{ mb: 1, borderColor: 'warning.main' }} />
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
            <Typography variant="subtitle2">Azimuth</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.azimuth}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
            <Typography variant="subtitle2">Drill Look Direction</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.drill_look_direction}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
            <Typography variant="subtitle2">Drill Meters</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.drill_meters}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
            <Typography variant="subtitle2">Dump</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.dump}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
            <Typography variant="subtitle2">Holes</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.holes}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
            <Typography variant="subtitle2">Diameters</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.diameters}
            </Typography>
          </Grid2>
          {isEditable ? (
            <Grid2 size={{ xs: 6 }}>
              <Field name="markup_for" label="Markup For" as={TextField} fullWidth disabled={!values.is_active} />
            </Grid2>
          ) : (
            <Grid2 size={{ xs: 6 }}>
              <Typography variant="subtitle2">Markup for</Typography>
              <Typography variant="body1" color="textSecondary">
                {values.markup_for ? values.markup_for : 'Not specified'}
              </Typography>
            </Grid2>
          )}
          {isEditable ? (
            <Grid2 size={{ xs: 6 }}>
              <Field name="markup_date" label="Markup Date" as={TextField} fullWidth disabled={!values.is_active} />
            </Grid2>
          ) : (
            <Grid2 size={{ xs: 6 }}>
              <Typography variant="subtitle2">Markup Date</Typography>
              <Typography variant="body1" color="textSecondary">
                {values.markup_date ? values.markup_date : 'TBA'}
              </Typography>
            </Grid2>
          )}
          {isEditable ? (
            <Grid2 size={{ xs: 6 }}>
              <Field name="designed_to_suit" label="Designed For" as={TextField} fullWidth disabled={!values.is_active} />
            </Grid2>
          ) : (
            <Grid2 size={{ xs: 6 }}>
              <Typography variant="subtitle2">Designed for</Typography>
              <Typography variant="body1" color="textSecondary">
                {values.designed_to_suit ? values.designed_to_suit : 'Not specified'}
              </Typography>
            </Grid2>
          )}
          {isEditable ? (
            <Grid2 size={{ xs: 6 }}>
              <Field
                name="drill_complete_shift"
                label="Drilling Complete Date"
                as={TextField}
                fullWidth
                disabled={!values.is_active || values.status === 'Designed'}
              />
            </Grid2>
          ) : (
            <Grid2 size={{ xs: 6 }}>
              <Typography variant="subtitle2">Drilling Complete Date</Typography>
              <Typography variant="body1" color="textSecondary">
                {values.drill_complete_shift ? values.drill_complete_shift : 'Undrilled'}
              </Typography>
            </Grid2>
          )}
        </Grid2>
      </CardContent>
    </Card>
  );
}
