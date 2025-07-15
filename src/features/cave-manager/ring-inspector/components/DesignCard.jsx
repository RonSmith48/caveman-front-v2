import React from 'react';
import { useFormikContext, Field } from 'formik';
import { Box, Card, CardContent, FormControlLabel, TextField, Typography, Divider, Grid2, Stack, Switch } from '@mui/material';
import ParentChooserModal from 'features/konva/ParentChooserModal';
import dayjs from 'dayjs';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function DesignCard({ isEditable }) {
  // grab whatever you need from Formik
  const { values, setFieldValue } = useFormikContext();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5">Design</Typography>
        <Divider sx={{ mb: 1, borderColor: '#9900ff' }} />
        <Grid2 container spacing={1}>
          <Grid2 size={{ xs: 4 }}>
            <Typography variant="subtitle2">Location ID</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.location_id}
            </Typography>
          </Grid2>

          <Grid2 size={{ xs: 4 }}>
            <Typography variant="subtitle2">Blastsolids Volume</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.blastsolids_volume}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 4 }}>
            <Typography variant="subtitle2">Burden</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.burden}
            </Typography>
          </Grid2>
          {isEditable ? (
            <Grid2 size={{ xs: 6 }}>
              <Field name="designed_tonnes" label="Designed Tonnes" as={TextField} fullWidth disabled={!values.is_active} />
            </Grid2>
          ) : (
            <Grid2 size={{ xs: 4, xl: 3 }}>
              <Typography variant="subtitle2">Designed Tonnes</Typography>
              <Typography variant="body1" color="textSecondary">
                {values.designed_tonnes}
              </Typography>
            </Grid2>
          )}
          {isEditable ? (
            <Grid2 size={{ xs: 6 }}>
              <Field name="prod_dev_code" label="Prod/Dev Code" as={TextField} fullWidth disabled={!values.is_active} />
            </Grid2>
          ) : (
            <Grid2 size={{ xs: 4, xl: 3 }}>
              <Typography variant="subtitle2">Prod/Dev Code</Typography>
              <Typography variant="body1" color="textSecondary">
                {values.prod_dev_code}
              </Typography>
            </Grid2>
          )}
          <Grid2 size={{ xs: 12 }}>
            <Typography variant="subtitle2">Coordinates (X, Y, Z)</Typography>
            <Typography variant="body1" color="textSecondary">
              ({Number(values.x).toFixed(4)}, {Number(values.y).toFixed(4)}, {Number(values.z).toFixed(4)})
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
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
                  isEditable={isEditable}
                  orphanLocationId={values.location_id}
                  disabled={!values.is_active}
                  onPair={(ring) => {
                    // write only the slug into the form
                    setFieldValue('concept_ring', ring.name);
                  }}
                />
              </Stack>
            </Box>
          </Grid2>
          {isEditable ? (
            <Grid2 size={{ xs: 12, xl: 6 }}>
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
            </Grid2>
          ) : (
            <Grid2 size={{ xs: 12, xl: 6 }}>
              <Typography variant="subtitle2">In Overdraw Zone</Typography>
              <Typography variant="body1" color="textSecondary">
                {values.in_overdraw_zone ? 'Yes' : 'No'}
              </Typography>
            </Grid2>
          )}

          <Grid2 container spacing={1} sx={{ mt: 1 }}>
            {isEditable ? (
              <Grid2 size={{ xs: 6 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="Design Date"
                    format="DD/MM/YYYY"
                    disableFuture
                    value={values.design_date ? dayjs(values.design_date) : null}
                    onChange={(newValue) => {
                      setFieldValue('design_date', newValue ? newValue.format('YYYY-MM-DD') : '');
                    }}
                    disabled={!values.is_active}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid2>
            ) : (
              <Grid2 size={{ xs: 6 }}>
                <Typography variant="subtitle2">Design Date</Typography>
                <Typography variant="body1" color="textSecondary">
                  {values.design_date}
                </Typography>
              </Grid2>
            )}
            {isEditable ? (
              <Grid2 size={{ xs: 6 }}>
                <Field name="draw_percentage" label="Draw %" as={TextField} fullWidth disabled={!values.is_active} />
              </Grid2>
            ) : (
              <Grid2 size={{ xs: 6 }}>
                <Typography variant="subtitle2">Draw %</Typography>
                <Typography variant="body1" color="textSecondary">
                  {values.draw_percentage}
                </Typography>
              </Grid2>
            )}
            {isEditable ? (
              <Grid2 size={{ xs: 12 }}>
                <Field name="description" label="Description" as={TextField} fullWidth disabled={!values.is_active} />
              </Grid2>
            ) : (
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="subtitle2">Description</Typography>
                <Typography variant="body1" color="textSecondary">
                  {values.description ? values.description : 'No description provided'}
                </Typography>
              </Grid2>
            )}
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
}
