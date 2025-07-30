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
  FormHelperText,
  FormLabel
} from '@mui/material';

import dayjs from 'dayjs';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { parseShkey } from 'utils/shkey';

export default function DrillingCard({ isEditable }) {
  const { values, setFieldValue, errors, touched, setFieldTouched } = useFormikContext();
  const [drillField, drillMeta, drillHelpers] = useField('drill_complete_shift');

  const { date: drillDate, shift: drillShift } = parseShkey(drillField.value || '');
  const markupDate = values.markup_date ? dayjs(values.markup_date, 'YYYY-MM-DD') : null;

  const handleDrillDateChange = (newValue) => {
    const dateStr = newValue ? newValue.format('YYYYMMDD') : '';
    const shiftNum = drillShift || '1';
    const newKey = dateStr ? `${dateStr}P${shiftNum}` : '';
    setFieldValue('drill_complete_shift', newKey);
  };

  const handleDrillShiftChange = (e) => {
    const shiftValue = e.target.value;
    const dateStr = drillDate || dayjs().format('YYYYMMDD');
    const shiftNum = shiftValue === 'Night' ? '2' : '1';
    const newKey = `${dateStr}P${shiftNum}`;
    setFieldValue('drill_complete_shift', newKey);
  };

  const handleMarkupDateChange = (newValue) => {
    if (newValue) {
      setFieldValue('markup_date', newValue.format('YYYY-MM-DD'));
    } else {
      setFieldValue('markup_date', null);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5">Drilling</Typography>
        <Divider sx={{ mb: 1, borderColor: 'warning.main' }} />
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
            <Typography variant="subtitle2">Azimuth</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.azimuth ? values.azimuth : 'Not specified'}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
            <Typography variant="subtitle2">Drill Look Direction</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.drill_look_direction ? values.drill_look_direction : 'Not specified'}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
            <Typography variant="subtitle2">Drill Meters</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.drill_meters ? values.drill_meters : 'Not specified'}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
            <Typography variant="subtitle2">Dump</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.dump ? values.dump : 'Not specified'}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
            <Typography variant="subtitle2">Holes</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.holes ? values.holes : 'Not specified'}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
            <Typography variant="subtitle2">Diameters</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.diameters ? values.diameters : 'Not specified'}
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Markup Date"
                  format="DD/MM/YYYY"
                  disableFuture
                  value={markupDate}
                  onChange={handleMarkupDateChange}
                  disabled={!values.is_active}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid2>
          ) : (
            <Grid2 size={{ xs: 6 }}>
              <Typography variant="subtitle2">Markup Date</Typography>
              <Typography variant="body1" color="textSecondary">
                {values.markup_date ? values.markup_date : 'Not specified'}
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
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center'
            }}
          >
            {/* Drilling Date column */}
            <Grid2 xs={8}>
              {isEditable ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="Drilling Complete Date"
                    format="DD/MM/YYYY"
                    disableFuture
                    value={drillDate}
                    onChange={(newVal) => {
                      handleDrillDateChange(newVal);
                      setFieldTouched('drill_complete_shift', true);
                    }}
                    disabled={!values.is_active || values.status === 'Designed'}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={drillMeta.touched && Boolean(drillMeta.error)}
                        helperText={drillMeta.touched && drillMeta.error}
                      />
                    )}
                  />
                </LocalizationProvider>
              ) : (
                <>
                  <Typography variant="subtitle2">Drilling Complete Date</Typography>
                  <Typography variant="body1" color="textSecondary">
                    {datePart ? dayjs(datePart, 'YYYYMMDD').format('DD/MM/YYYY') : 'Undrilled'}
                  </Typography>
                </>
              )}
            </Grid2>

            {/* Shift column */}
            <Grid2 xs={4}>
              {isEditable ? (
                <FormControl component="fieldset" error={touched.drill_complete_shift && Boolean(errors.drill_complete_shift)} fullWidth>
                  <RadioGroup
                    name="drillShift"
                    value={drillShift}
                    onChange={(e) => {
                      handleDrillShiftChange(e);
                      setFieldTouched('drill_complete_shift', true);
                    }}
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
                  <FormHelperText>{drillMeta.touched && drillMeta.error}</FormHelperText>
                </FormControl>
              ) : (
                <>
                  <Typography variant="subtitle2">Shift</Typography>
                  <Typography variant="body1" color="textSecondary">
                    {drillShift}
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
