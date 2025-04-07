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
  InputLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Typography
} from '@mui/material';

// third party
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { enqueueSnackbar } from 'notistack';

// project imports
import { fetcher, fetcherPost } from 'utils/axios';
import BDCFDrillTable from 'features/bdcf/DrillTable';

function BDCFDrillTab() {
  const [data, setData] = useState({ drilled_list: [], designed_list: [] });
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [ringNumDrop, setRingNumDrop] = useState([]);
  const [isRedrill, setIsRedrill] = useState(false);
  const [drilledRings, setDrilledRings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRings, setLoadingRings] = useState(false);

  const { user } = useUser();
  const [settings, setSettings] = useState({ 'equipment-sounds': false });
  const audioRef = useRef(new Audio('/assets/sounds/hammer_drill_1.mp3'));

  useEffect(() => {
    fetchData();
    fetchSettings();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetcher('/prod-actual/bdcf/drill/');
      setData(response.data);
      setDropdownOptions(response.data.designed_list);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching designed rings list:', error);
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
    shift: Yup.string().required('Shift is required'),
    selectOredrive: Yup.string().required('Ore drive is required'),
    selectRing: Yup.string().required('Ring is required'),
    drilled_mtrs: Yup.number(),
    conditions: Yup.array().of(Yup.string())
  });

  const formik = useFormik({
    initialValues: {
      pickerDate: dayjs().subtract(1, 'day'),
      shift: 'Day',
      selectOredrive: '',
      selectRing: '',
      drilled_mtrs: '',
      redrill: isRedrill,
      half_drilled: false,
      lost_rods: false,
      has_bg: false,
      making_water: false
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (settings['equipment-sounds'] == true) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }

        const formattedDate = formatDate(values.pickerDate);
        // Construct the drill conditions list
        const drillConditions = [];
        if (values.redrill) drillConditions.push('Redrilled');
        if (values.half_drilled) drillConditions.push('Incomplete');
        if (values.lost_rods) drillConditions.push('Lost Rods');
        if (values.has_bg) drillConditions.push('BG Reported');
        if (values.making_water) drillConditions.push('Making Water');

        const payload = {
          date: formattedDate,
          shift: values.shift,
          location_id: values.selectRing, // Use selectRing as location_id
          drilled_mtrs: values.drilled_mtrs || null,
          conditions: drillConditions, // Send drill conditions as a list
          status: 'Drilled'
        };

        const response = await fetcherPost('/prod-actual/bdcf/drill/', payload);

        enqueueSnackbar(response.data.msg.body, { variant: response.data.msg.type });

        // Optionally reset the form or refetch data
        formik.resetForm();
        const currentOredrive = values.selectOredrive; // Get the current oredrive
        if (currentOredrive) {
          await handleSelectOredrive({ target: { value: currentOredrive } }); // Refetch rings for the current oredrive
        }
      } catch (error) {
        console.error('Error processing drill return:', error);
        enqueueSnackbar('Failed to process drill return. Please try again.', { variant: 'error' });
      }
    }
  });

  const handleIsRedrillToggle = () => {
    formik.setFieldValue('selectOredrive', '');
    formik.setFieldValue('selectRing', '');
    setIsRedrill(!isRedrill);
    setDropdownOptions(isRedrill ? data.designed_list : data.drilled_list); // Toggle between lists
  };

  const handleSelectOredrive = async (event) => {
    const lvl_od = event.target.value;
    formik.setFieldValue('selectOredrive', lvl_od);
    formik.setFieldValue('selectRing', '');

    setLoadingRings(true);

    try {
      const response = await fetcher(`/prod-actual/bdcf/drilled/${lvl_od}/`);
      const rings = isRedrill ? response.data.drilled : response.data.designed;

      setDrilledRings(response.data.drilled_rings);
      setRingNumDrop(rings);
      setDrilledRings(response.data.drilled_rings || []);
      setLoadingRings(false);
    } catch (error) {
      // Handle error appropriately
      console.error('Error fetching rings:', error);
      enqueueSnackbar('Error fetching rings', { variant: 'error' });
      setLoadingRings(false);
    }
  };

  const handleSelectRing = async (event) => {
    const selectedRing = event.target.value;
    formik.setFieldValue('selectRing', selectedRing);
  };

  const handleIncomplete = () => {
    formik.setFieldValue('half_drilled', !formik.values.half_drilled);
  };

  const isSubmitDisabled = () => {
    // Check required fields and conditionally disable button
    return !(
      (formik.values.selectOredrive && formik.values.selectRing && (!formik.values.half_drilled || formik.values.drilled_mtrs)) // if half_drilled is checked, drilled_mtrs must be filled
    );
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
                  label="Activity Date"
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

            <FormControl component="fieldset">
              <FormGroup aria-label="position" row>
                <Grid xs={6}>
                  <FormControlLabel
                    control={<Checkbox checked={isRedrill} onChange={handleIsRedrillToggle} />}
                    label="Is Redrill"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={formik.values.half_drilled} onChange={handleIncomplete} />}
                    label="Incomplete"
                    labelPlacement="end"
                  />
                </Grid>
                <Grid xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.lost_rods}
                        onChange={() => formik.setFieldValue('lost_rods', !formik.values.lost_rods)}
                      />
                    }
                    label="Has Lost Rods"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox checked={formik.values.has_bg} onChange={() => formik.setFieldValue('has_bg', !formik.values.has_bg)} />
                    }
                    label="BG Reported"
                    labelPlacement="end"
                  />
                </Grid>
                <Grid xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.making_water}
                        onChange={() => formik.setFieldValue('making_water', !formik.values.making_water)}
                      />
                    }
                    label="Is Making Water"
                    labelPlacement="end"
                  />
                </Grid>
              </FormGroup>
            </FormControl>

            {/* Conditionally render the Drilled Meters input */}
            {formik.values.half_drilled && (
              <TextField
                label="Drilled Meters"
                name="drilled_mtrs"
                value={formik.values.drilled_mtrs}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.drilled_mtrs && Boolean(formik.errors.drilled_mtrs)}
                helperText={formik.touched.drilled_mtrs && formik.errors.drilled_mtrs}
                fullWidth
              />
            )}

            <FormControl fullWidth>
              <InputLabel id="dropdown-label">Select Ore Drive</InputLabel>
              <Select
                labelId="dropdown-label"
                value={formik.values.selectOredrive || ''}
                label="Select Ore Drive"
                onChange={handleSelectOredrive}
              >
                {dropdownOptions.map((item) => (
                  <MenuItem key={item.level_oredrive} value={item.level_oredrive}>
                    {item.level_oredrive}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="dropdown-label">Select Ring</InputLabel>
              <Select labelId="dropdown-label" value={formik.values.selectRing || ''} label="Select Ring" onChange={handleSelectRing}>
                {ringNumDrop.map((item) => (
                  <MenuItem key={item.location_id} value={item.location_id}>
                    {item.ring_number_txt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="contained" color="primary" type="submit" disabled={isSubmitDisabled()}>
              Process Drill Return
            </Button>
          </Box>
        </form>
      </Grid>

      <Grid item xs={12} md={8}>
        <TableContainer component={Paper}>
          {formik.values.selectOredrive ? (
            loadingRings ? (
              <Typography variant="body2">Loading rings...</Typography>
            ) : (
              <BDCFDrillTable oredrive={formik.values.selectOredrive} ringData={drilledRings} handleSelectOredrive={handleSelectOredrive} />
            )
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Ring</TableCell>
                  <TableCell>Conditions</TableCell>
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

export default BDCFDrillTab;

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
