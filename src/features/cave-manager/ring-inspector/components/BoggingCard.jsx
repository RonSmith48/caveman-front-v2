import React from 'react';
import { useFormikContext, Field, useField } from 'formik';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  TextField,
  Typography,
  Divider,
  Grid2,
  RadioGroup,
  Radio
} from '@mui/material';

import dayjs from 'dayjs';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function BoggingCard({ isEditable }) {
  const { values, setFieldValue, touched, errors } = useFormikContext();
  const nullValue = 'Not specified';

  // --- Split fields for FIRED ---
  const [firedDateField, firedDateMeta, firedDateHelpers] = useField('fired_date'); // dayjs|null
  const [firedShiftField, firedShiftMeta, firedShiftHelpers] = useField('fired_shift_label'); // 'Day'|'Night'|''

  const firedDateObj = firedDateField.value || null;
  const firedShiftVal = firedShiftField.value || '';

  // --- Split fields for BOG COMPLETE ---
  const [compDateField, compDateMeta, compDateHelpers] = useField('bog_complete_date'); // dayjs|null
  const [compShiftField, compShiftMeta, compShiftHelpers] = useField('bog_complete_shift_label'); // 'Day'|'Night'|''

  const compDateObj = compDateField.value || null;
  const compShiftVal = compShiftField.value || '';

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5">Firing & Bogging</Typography>
        <Divider sx={{ mb: 1, borderColor: 'error.main' }} />

        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 6 }}>
            <Typography variant="subtitle2">Bogged Tonnes</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.bogged_tonnes ?? nullValue}
            </Typography>
          </Grid2>

          <Grid2 size={{ xs: 6 }}>
            <Field name="draw_deviation" label="Draw Deviation" as={TextField} fullWidth disabled={!values.is_active} />
          </Grid2>

          {/* ----- Fired (date + shift) ----- */}
          <Grid2 size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {/* Fired Date */}
              <Grid2 size={{ xs: 8 }}>
                {isEditable ? (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      label="Fired Date"
                      format="DD/MM/YYYY"
                      disableFuture
                      value={firedDateObj}
                      onChange={(newVal) => firedDateHelpers.setValue(newVal)}
                      disabled={!values.is_active}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: Boolean(errors.firedDateMeta),
                          helperText: errors.firedDateMeta || ''
                        }
                      }}
                    />
                  </LocalizationProvider>
                ) : (
                  <>
                    <Typography variant="subtitle2">Fired Date</Typography>
                    <Typography variant="body1" color="textSecondary">
                      {firedDateObj ? firedDateObj.format('DD/MM/YYYY') : '—'}
                    </Typography>
                  </>
                )}
              </Grid2>

              {/* Fired Shift */}
              <Grid2 size={{ xs: 4 }}>
                {isEditable ? (
                  <FormControl component="fieldset" fullWidth error={firedShiftMeta.touched && Boolean(firedShiftMeta.error)}>
                    <RadioGroup
                      name="firedShift"
                      value={firedShiftVal}
                      onChange={(e) => firedShiftHelpers.setValue(e.target.value)}
                      sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}
                    >
                      <FormControlLabel value="Day" control={<Radio />} label="Day" disabled={!values.is_active} />
                      <FormControlLabel value="Night" control={<Radio />} label="Night" disabled={!values.is_active} />
                    </RadioGroup>
                    <FormHelperText>{firedShiftMeta.touched && firedShiftMeta.error}</FormHelperText>
                  </FormControl>
                ) : (
                  <>
                    <Typography variant="subtitle2">Shift</Typography>
                    <Typography variant="body1" color="textSecondary">
                      {firedShiftVal || '—'}
                    </Typography>
                  </>
                )}
              </Grid2>
            </Box>
          </Grid2>

          {/* ----- Bog Complete (date + shift) ----- */}
          <Grid2 size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {/* Completion Date */}
              <Grid2 size={{ xs: 8 }}>
                {isEditable ? (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      label="Completion Date"
                      format="DD/MM/YYYY"
                      disableFuture
                      value={compDateObj}
                      onChange={(newVal) => compDateHelpers.setValue(newVal)}
                      disabled={!values.is_active}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: Boolean(errors.compDateMeta),
                          helperText: errors.compDateMeta || ''
                        }
                      }}
                    />
                  </LocalizationProvider>
                ) : (
                  <>
                    <Typography variant="subtitle2">Completion Date</Typography>
                    <Typography variant="body1" color="textSecondary">
                      {compDateObj ? compDateObj.format('DD/MM/YYYY') : '—'}
                    </Typography>
                  </>
                )}
              </Grid2>

              {/* Completion Shift */}
              <Grid2 size={{ xs: 4 }}>
                {isEditable ? (
                  <FormControl component="fieldset" fullWidth error={compShiftMeta.touched && Boolean(compShiftMeta.error)}>
                    <RadioGroup
                      name="completeShift"
                      value={compShiftVal}
                      onChange={(e) => compShiftHelpers.setValue(e.target.value)}
                      sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}
                    >
                      <FormControlLabel value="Day" control={<Radio />} label="Day" disabled={!values.is_active} />
                      <FormControlLabel value="Night" control={<Radio />} label="Night" disabled={!values.is_active} />
                    </RadioGroup>
                    <FormHelperText>{compShiftMeta.touched && compShiftMeta.error}</FormHelperText>
                  </FormControl>
                ) : (
                  <>
                    <Typography variant="subtitle2">Shift</Typography>
                    <Typography variant="body1" color="textSecondary">
                      {compShiftVal || '—'}
                    </Typography>
                  </>
                )}
              </Grid2>
            </Box>
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
}
