import React from 'react';
import { useFormikContext, Field, useField } from 'formik';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Divider,
  Grid2
} from '@mui/material';

import dayjs from 'dayjs';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function ChargingCard({ isEditable }) {
  const { values, setFieldValue, touched, errors } = useFormikContext();
  const nullValue = 'Not specified';

  // Split fields (validated by schema / requiredFieldsByStatus)
  const [dateField, dateMeta, dateHelpers] = useField('charge_date'); // dayjs|null
  const [shiftField, shiftMeta, shiftHelpers] = useField('charge_shift_label'); // 'Day'|'Night'|''

  const chargeDateObj = dateField.value || null;
  const chargeShift = shiftField.value || '';

  // Fireby remains a plain YYYY-MM-DD string
  const firebyDateObj = values.fireby_date ? dayjs(values.fireby_date, 'YYYY-MM-DD') : null;

  const handleFirebyDateChange = (newValue) => {
    setFieldValue('fireby_date', newValue ? newValue.format('YYYY-MM-DD') : null);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5">Charging</Typography>
        <Divider sx={{ mb: 1, borderColor: 'success.main' }} />

        <Grid2 container spacing={2} sx={{ mb: 1 }}>
          <Grid2 sx={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Emulsion Est. Qty</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.designed_emulsion_qty || nullValue}
            </Typography>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2">Designed Detonator</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.detonator_designed || nullValue}
            </Typography>
          </Grid2>

          <Grid2 size={{ xs: 6 }}>
            <Field name="detonator_actual" label="Detonator Used" as={TextField} fullWidth disabled={!values.is_active} />
          </Grid2>

          <Grid2 size={{ xs: 6 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Fireby Date"
                format="DD/MM/YYYY"
                value={firebyDateObj}
                onChange={(newVal) => handleFirebyDateChange(newVal)}
                disabled={!values.is_active}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: Boolean(errors.fireby_date),
                    helperText: errors.fireby_date || ''
                  }
                }}
              />
            </LocalizationProvider>
          </Grid2>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* Charge Date */}
            <Grid2 size={{ xs: 8 }}>
              {isEditable ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="Charge Date"
                    format="DD/MM/YYYY"
                    disableFuture
                    value={chargeDateObj}
                    onChange={(newVal) => dateHelpers.setValue(newVal)}
                    disabled={!values.is_active}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: Boolean(dateMeta.error),
                        helperText: dateMeta.error || ''
                      }
                    }}
                  />
                </LocalizationProvider>
              ) : (
                <>
                  <Typography variant="subtitle2">Charge Date</Typography>
                  <Typography variant="body1" color="textSecondary">
                    {chargeDateObj ? chargeDateObj.format('DD/MM/YYYY') : 'Uncharged'}
                  </Typography>
                </>
              )}
            </Grid2>

            {/* Shift */}
            <Grid2 size={{ xs: 4 }}>
              {isEditable ? (
                <FormControl component="fieldset" fullWidth error={Boolean(shiftMeta.error)}>
                  <RadioGroup
                    name="chargeShift"
                    value={chargeShift}
                    onChange={(e) => shiftHelpers.setValue(e.target.value)}
                    sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}
                  >
                    <FormControlLabel value="Day" control={<Radio />} label="Day" disabled={!values.is_active} />
                    <FormControlLabel value="Night" control={<Radio />} label="Night" disabled={!values.is_active} />
                  </RadioGroup>
                  <FormHelperText>{shiftMeta.error}</FormHelperText>
                </FormControl>
              ) : (
                <>
                  <Typography variant="subtitle2">Shift</Typography>
                  <Typography variant="body1" color="textSecondary">
                    {chargeShift || '—'}
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
