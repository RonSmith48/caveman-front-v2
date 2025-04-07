import React, { useState, useEffect, useRef } from 'react';
import useUser from 'hooks/useUser';

// material-ui
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Box,
  Checkbox,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Radio,
  RadioGroup,
  FormControlLabel,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Typography
} from '@mui/material';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

// third party
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { enqueueSnackbar } from 'notistack';

// project imports
import { fetcher, fetcherPost } from 'utils/axios';
import BDCFFireTable from 'features/bdcf/FireTable';

function BDCFFireTab() {
  const [levelOptions, setLevelOptions] = useState([]);
  const [driveRingOptions, setdriveRingOptions] = useState([]);
  const [firedRings, setFiredRings] = useState([]);
  const [filteredRings, setFilteredRings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRings, setLoadingRings] = useState(false);
  const [isFiring, setIsFiring] = useState(false);

  const { user } = useUser();
  const [settings, setSettings] = useState({ 'equipment-sounds': false });
  const audioRef = useRef(new Audio('/sounds/explosion_1.mp3'));

  useEffect(() => {
    fetchData();
    fetchSettings();
  }, []);

  const fetchData = async () => {
    try {
      const fireResponse = await fetcher('/prod-actual/bdcf/fire/');
      setLevelOptions(fireResponse.data);
    } catch (error) {
      console.error('Error fetching charged rings list:', error);
      enqueueSnackbar('Error fetching levels containing charged rings', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const data = await fetcher(`/settings/user-${user.id}/`);
      if (data?.data?.value) {
        setSettings(data.data.value);
      }
    } catch (error) {
      console.error('Setting does not exist, using default', error);
    }
  };

  const validationSchema = Yup.object().shape({
    pickerDate: Yup.date().required('Date is required'),
    shift: Yup.string().required('Shift is required')
  });

  const formik = useFormik({
    initialValues: {
      pickerDate: dayjs().subtract(1, 'day'),
      shift: 'Day',
      selectLevel: '',
      selectRing: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formattedDate = formatDate(values.pickerDate);
        const selectedRingData = driveRingOptions.find((ring) => ring.location_id === values.selectRing);

        const payload = {
          date: formattedDate,
          shift: values.shift,
          location_id: values.selectRing, // Use selectRing as location_id
          oredrive: selectedRingData ? selectedRingData.oredrive : null
        };

        const response = await fetcherPost('/prod-actual/bdcf/fire/', payload);
        if (settings['equipment-sounds'] == true) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }

        if (response?.data?.msg) {
          enqueueSnackbar(response.data.msg.body, { variant: response.data.msg.type });
        } else {
          enqueueSnackbar('Ring fired successfully', { variant: 'success' });
        }

        // Optionally reset the form or refetch data
        formik.resetForm();
        const currentLevel = values.selectLevel; // Get the current oredrive
        if (currentLevel) {
          await handleSelectLevel({ target: { value: currentLevel } }); // Refetch rings for the current oredrive
        }
      } catch (error) {
        console.error('Error processing ring:', error);
        enqueueSnackbar('Failed to process ring. Please try again.', { variant: 'error' });
      }
    }
  });

  const handleSelectLevel = async (event) => {
    const lvl = event.target.value;
    formik.setFieldValue('selectLevel', lvl);
    formik.setFieldValue('selectRing', '');

    setIsFiring(false);
    setLoadingRings(true);

    try {
      const response = await fetcher(`/prod-actual/bdcf/fire/${lvl}/`);
      const boggingRings = response.data.fired_rings || [];
      const chargedRings = response.data.charged_rings || [];

      setFiredRings(boggingRings); // Store all bogging rings
      setFilteredRings(boggingRings);
      setdriveRingOptions(chargedRings);
      setLoadingRings(false);
      if (response.data?.msg?.body) {
        enqueueSnackbar(response.data.msg.body, { variant: response.data.msg.type });
      }
    } catch (error) {
      // Handle error appropriately
      console.error('Error fetching rings:', error);
      enqueueSnackbar('Error fetching rings', { variant: 'error' });
      setLoadingRings(false);
    }
  };

  const handleSelectRing = (event) => {
    const selectedLocationId = event.target.value;
    formik.setFieldValue('selectRing', selectedLocationId);

    if (!selectedLocationId) {
      // No selection, show all rings
      setFilteredRings(firedRings);
      setIsFiring(false);
    } else {
      // Find the ring in driveRingOptions with the selected location_id
      const selectedRingData = driveRingOptions.find((ring) => ring.location_id === selectedLocationId);

      if (selectedRingData) {
        // Filter firedRings to include only those with the same oredrive
        const filtered = firedRings.filter((ring) => ring.oredrive === selectedRingData.oredrive);
        setFilteredRings(filtered);
        setIsFiring(true);
      } else {
        // In case nothing matches, default to all fired rings
        setFilteredRings(firedRings);
        setIsFiring(false);
      }
    }
  };

  const isSubmitDisabled = () => {
    return !formik.values.selectRing;
  };

  return (
    <Grid container spacing={2}>
      {/* Form Section */}
      <Grid item xs={12} md={4}>
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ paddingBottom: '10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Fire Date"
                  format="DD/MM/YYYY"
                  disableFuture
                  value={formik.values.pickerDate}
                  onChange={(date) => formik.setFieldValue('pickerDate', date)}
                  textField={(params) => <TextField {...params} sx={{ width: '10rem' }} />}
                />
              </LocalizationProvider>

              <RadioGroup row value={formik.values.shift} onChange={(event) => formik.setFieldValue('shift', event.target.value)}>
                <FormControlLabel value="Day" control={<Radio />} label="Day" />
                <FormControlLabel value="Night" control={<Radio />} label="Night" />
              </RadioGroup>
            </Box>

            {/* Level Dropdown */}
            <TextField select label="Select Level" value={formik.values.selectLevel} onChange={handleSelectLevel} fullWidth>
              {levelOptions.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Select DriveRing"
              value={formik.values.selectRing}
              onChange={handleSelectRing}
              fullWidth
              disabled={!formik.values.selectLevel} // Disable until Level is selected
            >
              {driveRingOptions.map((ring) => (
                <MenuItem
                  key={ring.location_id}
                  value={ring.location_id}
                  disabled={ring.orphaned}
                  sx={(theme) => ({
                    bgcolor: ring.orphaned ? theme.palette.warning.light : 'inherit', // Background warning color
                    opacity: ring.orphaned ? 0.8 : 1, // Slight transparency for disabled effect
                    '&.Mui-disabled': {
                      bgcolor: theme.palette.warning.light, // Keep background color even when disabled
                      opacity: 0.6 // Make it look disabled but still noticeable
                    }
                  })}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <ListItemText primary={ring.alias} />
                    {ring.orphaned && <WarningAmberOutlinedIcon sx={{ color: '#cc5200' }} />}
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            <Button variant="contained" color="primary" type="submit" disabled={isSubmitDisabled()}>
              {settings['equipment-sounds'] ? 'Fire in the Hole' : 'Fire Ring'}
            </Button>
          </Box>
        </form>
      </Grid>

      <Grid item xs={12} md={8}>
        <TableContainer component={Paper}>
          {formik.values.selectLevel ? (
            loadingRings ? (
              <Typography variant="body2">Loading rings...</Typography>
            ) : (
              <BDCFFireTable
                level={formik.values.selectLevel}
                ringData={filteredRings}
                handleSelectLevel={handleSelectLevel}
                isFiring={isFiring}
              />
            )
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Alias</TableCell>
                  <TableCell>Contributor</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
            </Table>
          )}
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default BDCFFireTab;

// ============= Functions ====================

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}
