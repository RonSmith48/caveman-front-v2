import React from 'react';
import { useFormikContext, Field } from 'formik';
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
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import IconButton from '@mui/material/IconButton';
import StatusSection from './StatusSection';
import ParentChooserModal from 'features/konva/ParentChooserModal';

import { parseShkey } from 'utils/shkey';

import dayjs from 'dayjs';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function ChargingCard({ isEditable }) {
  // grab whatever you need from Formik
  const { values, setFieldValue, errors, touched, setFieldTouched } = useFormikContext();
  const nullValue = 'Not specified';
  const { date: chargeDate, shift: chargeShift } = parseShkey(values.charge_shift);
  const firebyDate = values.fireby_date ? dayjs(values.fireby_date, 'YYYY-MM-DD') : null;

  const handleChargeDateChange = (newValue) => {
    const dateStr = newValue ? newValue.format('YYYYMMDD') : '';
    const shiftNum = shiftPart || '1';
    const newKey = dateStr ? `${dateStr}P${shiftNum}` : '';
    setFieldValue('charge_shift', newKey);
  };

  const handleChargeShiftChange = (e) => {
    const shiftValue = e.target.value;
    const dateStr = datePart || dayjs().format('YYYYMMDD');
    const shiftNum = shiftValue === 'Night' ? '2' : '1';
    const newKey = `${dateStr}P${shiftNum}`;
    setFieldValue('charge_shift', newKey);
  };

  const handleFirebyDateChange = (newValue) => {
    if (newValue) {
      setFieldValue('fireby_date', newValue.format('YYYY-MM-DD'));
    } else {
      setFieldValue('fireby_date', null);
    }
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
                value={firebyDate}
                onChange={(newVal) => {
                  handleFirebyDateChange(newVal);
                  setFieldTouched('fireby_date', true);
                }}
                disabled={!values.is_active}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={touched.fireby_date && Boolean(errors.fireby_date)}
                    helperText={touched.fireby_date && errors.fireby_date}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid2>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center'
            }}
          >
            {/* Drilling Date column */}
            <Grid2 size={{ xs: 8 }}>
              {isEditable ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="Charge Date"
                    format="DD/MM/YYYY"
                    disableFuture
                    value={chargeDate}
                    onChange={(newVal) => {
                      handleChargeDateChange(newVal);
                      setFieldTouched('charge_shift', true);
                    }}
                    disabled={!values.is_active}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={touched.charge_shift && Boolean(errors.charge_shift)}
                        helperText={touched.charge_shift && errors.charge_shift}
                      />
                    )}
                  />
                </LocalizationProvider>
              ) : (
                <>
                  <Typography variant="subtitle2">Charge Date</Typography>
                  <Typography variant="body1" color="textSecondary">
                    {datePart ? dayjs(datePart, 'YYYYMMDD').format('DD/MM/YYYY') : 'Uncharged'}
                  </Typography>
                </>
              )}
            </Grid2>

            {/* Shift column */}
            <Grid2 size={{ xs: 4 }}>
              {isEditable ? (
                <FormControl component="fieldset" fullWidth error={touched.charge_shift && Boolean(errors.charge_shift)}>
                  <RadioGroup
                    name="chargeShift"
                    value={chargeShift}
                    onChange={(e) => {
                      handleChargeShiftChange(e);
                      setFieldTouched('charge_shift', true);
                    }}
                    sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}
                  >
                    <FormControlLabel value="Day" control={<Radio />} label="Day" disabled={!values.is_active} />
                    <FormControlLabel value="Night" control={<Radio />} label="Night" disabled={!values.is_active} />
                  </RadioGroup>
                  <FormHelperText>{touched.charge_shift && errors.charge_shift}</FormHelperText>
                </FormControl>
              ) : (
                <>
                  <Typography variant="subtitle2">Shift</Typography>
                  <Typography variant="body1" color="textSecondary">
                    {chargeShift}
                  </Typography>
                </>
              )}
            </Grid2>
          </Box>
        </Grid2>
        <Grid2 container spacing={2}></Grid2>
      </CardContent>
    </Card>
  );
}
