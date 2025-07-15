import React from 'react';
import { useFormikContext, Field } from 'formik';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  TextField,
  Typography,
  Divider,
  Grid2,
  RadioGroup,
  Radio,
  Stack,
  Switch
} from '@mui/material';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import IconButton from '@mui/material/IconButton';
import StatusSection from './StatusSection';
import ParentChooserModal from 'features/konva/ParentChooserModal';

import { parseShkey } from 'utils/shkey';

import dayjs from 'dayjs';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function BoggingCard({ isEditable }) {
  // grab whatever you need from Formik
  const { values } = useFormikContext();

  const { date: firedDate, shift: firedShift } = parseShkey(values.fired_shift);
  const { date: completeDate, shift: completeShift } = parseShkey(values.complete_shift);

  const handleFiredDateChange = (newValue) => {
    const dateStr = newValue ? newValue.format('YYYYMMDD') : '';
    const shiftNum = shiftPart || '1';
    const newKey = dateStr ? `${dateStr}P${shiftNum}` : '';
    setFieldValue('fired_shift', newKey);
  };

  const handleFiredShiftChange = (e) => {
    const shiftValue = e.target.value;
    const dateStr = datePart || dayjs().format('YYYYMMDD');
    const shiftNum = shiftValue === 'Night' ? '2' : '1';
    const newKey = `${dateStr}P${shiftNum}`;
    setFieldValue('fired_shift', newKey);
  };

  const handleCompleteDateChange = (newValue) => {
    const dateStr = newValue ? newValue.format('YYYYMMDD') : '';
    const shiftNum = shiftPart || '1';
    const newKey = dateStr ? `${dateStr}P${shiftNum}` : '';
    setFieldValue('bog_complete_shift', newKey);
  };

  const handleCompleteShiftChange = (e) => {
    const shiftValue = e.target.value;
    const dateStr = datePart || dayjs().format('YYYYMMDD');
    const shiftNum = shiftValue === 'Night' ? '2' : '1';
    const newKey = `${dateStr}P${shiftNum}`;
    setFieldValue('bog_complete_shift', newKey);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5">Firing & Bogging</Typography>
        <Divider sx={{ mb: 1, borderColor: 'error.main' }} />
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 6 }}>
            <Typography variant="subtitle2">Bogged Tonnes</Typography>
            <Typography variant="body1" color="textSecondary">
              {values.bogged_tonnes}
            </Typography>
          </Grid2>

          <Grid2 size={{ xs: 6 }}>
            <Field name="draw_deviation" label="Draw Deviation" as={TextField} fullWidth disabled={!values.is_active} />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
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
                      label="Fired Date"
                      format="DD/MM/YYYY"
                      disableFuture
                      value={firedDate}
                      onChange={handleFiredDateChange}
                      disabled={!values.is_active}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                ) : (
                  <>
                    <Typography variant="subtitle2">Fired Date</Typography>
                    <Typography variant="body1" color="textSecondary">
                      {firedDate.format('DD/MM/YYYY')}
                    </Typography>
                  </>
                )}
              </Grid2>

              {/* Shift column */}
              <Grid2 size={{ xs: 4 }}>
                {isEditable ? (
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      name="firedShift"
                      value={firedShift}
                      onChange={handleFiredShiftChange}
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
                  </FormControl>
                ) : (
                  <>
                    <Typography variant="subtitle2">Shift</Typography>
                    <Typography variant="body1" color="textSecondary">
                      {firedShift}
                    </Typography>
                  </>
                )}
              </Grid2>
            </Box>
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
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
                      label="Completion Date"
                      format="DD/MM/YYYY"
                      disableFuture
                      value={completeDate}
                      onChange={handleCompleteDateChange}
                      disabled={!values.is_active}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                ) : (
                  <>
                    <Typography variant="subtitle2">Completion Date</Typography>
                    <Typography variant="body1" color="textSecondary">
                      {completeDate.format('DD/MM/YYYY')}
                    </Typography>
                  </>
                )}
              </Grid2>

              {/* Shift column */}
              <Grid2 size={{ xs: 4 }}>
                {isEditable ? (
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      name="completeShift"
                      value={completeShift}
                      onChange={handleCompleteShiftChange}
                      sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}
                    >
                      <FormControlLabel value="Day" control={<Radio />} label="Day" disabled={!values.is_active} />
                      <FormControlLabel value="Night" control={<Radio />} label="Night" disabled={!values.is_active} />
                    </RadioGroup>
                  </FormControl>
                ) : (
                  <>
                    <Typography variant="subtitle2">Shift</Typography>
                    <Typography variant="body1" color="textSecondary">
                      {completeShift}
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
