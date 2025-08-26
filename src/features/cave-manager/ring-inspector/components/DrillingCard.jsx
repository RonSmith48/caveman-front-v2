// DrillingCard.jsx
import React from 'react';
import { useFormikContext, Field, useField } from 'formik';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Divider,
  Grid2,
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
  FormHelperText
} from '@mui/material';

import dayjs from 'dayjs';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function DrillingCard({ isEditable }) {
  const { values, setFieldValue, touched, errors } = useFormikContext();

  // Split fields (these are what the schema validates)
  const [dateField, dateMeta, dateHelpers] = useField('drill_complete_date'); // dayjs|null
  const [shiftField, shiftMeta, shiftHelpers] = useField('drill_complete_shift_label'); // 'Day'|'Night'|''

  const drillDateObj = dateField.value || null;
  const radioValue = shiftField.value || '';

  // Markup date handling (unchanged)
  const markupDate = values.markup_date ? dayjs(values.markup_date, 'YYYY-MM-DD') : null;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5">Drilling</Typography>
        <Divider sx={{ mb: 1, borderColor: 'warning.main' }} />
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
            <Typography variant="subtitle2">Azimuth</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.azimuth ?? 'Not specified'}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
            <Typography variant="subtitle2">Drill Look Direction</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.drill_look_direction ?? 'Not specified'}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
            <Typography variant="subtitle2">Drill Meters</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.drill_meters ?? 'Not specified'}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
            <Typography variant="subtitle2">Dump</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.dump ?? 'Not specified'}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
            <Typography variant="subtitle2">Holes</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.holes ?? 'Not specified'}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
            <Typography variant="subtitle2">Diameters</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.diameters ?? 'Not specified'}
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
                {values.markup_for ?? 'Not specified'}
              </Typography>
            </Grid2>
          )}

          {isEditable ? (
            <Grid2 size={{ xs: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Markup Date"
                  format="DD/MM/YYYY"
                  disableFuture
                  value={markupDate}
                  onChange={(newValue) => {
                    // small inline handler to avoid unused warnings
                    const formatted = newValue ? newValue.format('YYYY-MM-DD') : null;
                    values.markup_date = formatted;
                  }}
                  disabled={!values.is_active}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid2>
          ) : (
            <Grid2 size={{ xs: 6 }}>
              <Typography variant="subtitle2">Markup Date</Typography>
              <Typography variant="body1" color="textSecondary">
                {values.markup_date ?? 'Not specified'}
              </Typography>
            </Grid2>
          )}

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* Drilling Date */}
            <Grid2 xs={8}>
              {isEditable ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="Drilling Complete Date"
                    format="DD/MM/YYYY"
                    disableFuture
                    value={drillDateObj}
                    onChange={(newVal) => dateHelpers.setValue(newVal)}
                    disabled={!values.is_active || values.status === 'Designed'}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: Boolean(errors.dateMeta),
                        helperText: errors.dateMeta || ''
                      }
                    }}
                  />
                </LocalizationProvider>
              ) : (
                <>
                  <Typography variant="subtitle2">Drilling Complete Date</Typography>
                  <Typography variant="body1" color="textSecondary">
                    {drillDateObj ? drillDateObj.format('DD/MM/YYYY') : 'Undrilled'}
                  </Typography>
                </>
              )}
            </Grid2>

            {/* Shift */}
            <Grid2 xs={4}>
              {isEditable ? (
                <FormControl component="fieldset" error={shiftMeta.touched && Boolean(shiftMeta.error)} fullWidth>
                  <RadioGroup
                    name="drillShift"
                    value={radioValue}
                    onChange={(e) => shiftHelpers.setValue(e.target.value)}
                    sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}
                  >
                    <FormControlLabel
                      value="Day"
                      control={<Radio />}
                      label="Day"
                      disabled={!values.is_active || values.status === 'Designed'}
                    />
                    <FormControlLabel
                      value="Night"
                      control={<Radio />}
                      label="Night"
                      disabled={!values.is_active || values.status === 'Designed'}
                    />
                  </RadioGroup>
                  <FormHelperText>{shiftMeta.touched && shiftMeta.error}</FormHelperText>
                </FormControl>
              ) : (
                <>
                  <Typography variant="subtitle2">Shift</Typography>
                  <Typography variant="body1" color="textSecondary">
                    {radioValue || '—'}
                  </Typography>
                </>
              )}
            </Grid2>
          </Box>
        </Grid2>
      </CardContent>
    </Card>
  );
}
