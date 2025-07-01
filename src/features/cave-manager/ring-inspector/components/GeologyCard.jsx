import React from 'react';
import { useFormikContext, Field } from 'formik';
import { Box, Card, CardContent, FormControlLabel, TextField, Typography, Divider, Grid2, Stack, Switch } from '@mui/material';

export default function GeologyCard({ isEditable }) {
  // grab whatever you need from Formik
  const { values, setFieldValue } = useFormikContext();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5">Geology</Typography>
        <Divider sx={{ mb: 1, borderColor: '#000' }} />
        <Grid2 container spacing={2}>
          {isEditable ? (
            <Grid2 size={{ xs: 6 }}>
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
            </Grid2>
          ) : (
            <Grid2 size={{ xs: 4 }}>
              <Typography variant="subtitle2">Has Pyrite</Typography>
              <Typography variant="body1" color="textSecondary">
                {values.has_pyrite ? 'Yes' : 'No'}
              </Typography>
            </Grid2>
          )}
          {isEditable ? (
            <Grid2 size={{ xs: 6 }}>
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
            </Grid2>
          ) : (
            <Grid2 size={{ xs: 4 }}>
              <Typography variant="subtitle2">In Water Zone</Typography>
              <Typography variant="body1" color="textSecondary">
                {values.in_water_zone ? 'Yes' : 'No'}
              </Typography>
            </Grid2>
          )}
          {isEditable ? (
            <Grid2 size={{ xs: 6 }}>
              <Field name="overdraw_amount" label="Overdraw Amount" as={TextField} fullWidth disabled={!values.is_active} />
            </Grid2>
          ) : (
            <Grid2 size={{ xs: 4 }}>
              <Typography variant="subtitle2">Overdraw Amount</Typography>
              <Typography variant="body1" color="textSecondary">
                {values.overdraw_amount}
              </Typography>
            </Grid2>
          )}
        </Grid2>
      </CardContent>
    </Card>
  );
}
