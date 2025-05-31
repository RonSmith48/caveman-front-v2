import React, { useState, useEffect, useRef } from 'react';
import useAuth from 'hooks/useAuth';

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
import BDCFChargeTable from 'features/bdcf/ChargeTable';

function BDCFChargeTab() {
  const [data, setData] = useState({ drilled_list: [], designed_list: [] });
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [detOptions, setDetOptions] = useState([]);
  const [ringNumDrop, setRingNumDrop] = useState([]);
  const [isRecharge, setIsRecharge] = useState(false);
  const [chargedRings, setChargedRings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRings, setLoadingRings] = useState(false);
  const [oredriveValue, setOredriveValue] = useState('');

  const { user } = useAuth();
  const [settings, setSettings] = useState({ 'equipment-sounds': false });
  const audioRef = useRef(new Audio('/sounds/pump_action_1.mp3'));

  useEffect(() => {
    const currentHour = dayjs().hour();

    fetchData();
    fetchSettings();

    if (currentHour < 12) {
      formik.setFieldValue('pickerDate', dayjs().subtract(1, 'day')); // Yesterday's date
      formik.setFieldValue('shift', 'Night');
    } else {
      formik.setFieldValue('pickerDate', dayjs()); // Today's date
      formik.setFieldValue('shift', 'Day');
    }
  }, []);

  const fetchData = async () => {
    try {
      const [chargeResponse, detTypes] = await Promise.all([
        fetcher('/prod-actual/bdcf/charge/'),
        fetcher('/settings/explosive-types-list/')
      ]);

      setData(chargeResponse.data);
      setDropdownOptions(chargeResponse.data.drilled_drives_list);
      if (detTypes) {
        setDetOptions(detTypes.data.value);
      }
    } catch (error) {
      console.error('Error fetching designed rings list:', error);
      enqueueSnackbar('Check explosive list types', { variant: 'error' });
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
    comment: Yup.string(),
    conditions: Yup.array().of(Yup.string()),
    explosive: Yup.string().required('Explosive type is required')
  });

  const formik = useFormik({
    initialValues: {
      pickerDate: null,
      shift: '',
      selectOredrive: '',
      selectRing: '',
      comment: '',
      recharged: isRecharge,
      incomplete: false,
      charged_short: false,
      blocked_holes: false,
      explosive: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formattedDate = formatDate(values.pickerDate);

        // Construct the conditions list
        const conditions = [];
        if (values.recharged) conditions.push('Recharged Holes');
        if (values.incomplete) conditions.push('Incomplete');
        if (values.charged_short) conditions.push('Charged Short');
        if (values.blocked_holes) conditions.push('Blocked Holes');

        const payload = {
          date: formattedDate,
          shift: values.shift,
          location_id: values.selectRing, // Use selectRing as location_id
          comment: values.comment || null,
          conditions: conditions, // Send conditions as a list
          status: 'Charged',
          explosive: values.explosive
        };

        const response = await fetcherPost('/prod-actual/bdcf/charge/', payload);

        // play a sound if enabled
        if (settings['equipment-sounds'] == true) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }

        enqueueSnackbar(response.data.msg.body, { variant: response.data.msg.type });

        // Optionally reset the form or refetch data
        formik.setFieldValue('blocked_holes', false);
        formik.setFieldValue('comment', '');
        formik.setFieldValue('recharged', false);
        formik.setFieldValue('incomplete', false);
        formik.setFieldValue('charged_short', false);
        formik.setFieldValue('explosive', '');
        formik.setFieldValue('selectRing', '');
        const currentOredrive = values.selectOredrive; // Get the current oredrive
        if (currentOredrive) {
          await handleSelectOredrive({ target: { value: currentOredrive } }); // Refetch rings for the current oredrive
        }
      } catch (error) {
        console.error('Error processing ring:', error);
        enqueueSnackbar('Failed to process ring. Please try again.', { variant: 'error' });
      }
    }
  });

  const handleIsRechargeToggle = () => {
    const newIsRecharge = !isRecharge;

    formik.setFieldValue('selectOredrive', '');
    formik.setFieldValue('selectRing', '');
    setIsRecharge(newIsRecharge);

    if (newIsRecharge) {
      // Uncheck blocked_holes when recharging
      formik.setFieldValue('blocked_holes', false);
    }

    // Toggle dropdown options based on recharge state
    setDropdownOptions(newIsRecharge ? data.drilled_list : data.designed_list);
  };

  const handleIncomplete = () => {
    const isIncomplete = !formik.values.incomplete;

    formik.setFieldValue('incomplete', isIncomplete);
    if (isIncomplete) {
      if (formik.values.blocked_holes) {
        formik.setFieldValue('blocked_holes', false);
        // Clear comment if blocked_holes was checked
        formik.setFieldValue('comment', '');
      }
    } else {
      // Clear comment if incomplete is unchecked
      formik.setFieldValue('comment', '');
    }
  };

  const handleBlockedHoles = () => {
    const isBlockedHoles = !formik.values.blocked_holes;

    formik.setFieldValue('blocked_holes', isBlockedHoles);
    if (isBlockedHoles) {
      // Uncheck other fields if blocked_holes is checked
      formik.setFieldValue('incomplete', false);
      formik.setFieldValue('charged_short', false);
      formik.setFieldValue('explosive', '');
      setIsRecharge(false); // Uncheck recharged by resetting isRecharge
    } else {
      formik.setFieldValue('comment', '');
    }
  };

  const handleChargedShort = () => {
    const isChargedShort = !formik.values.charged_short;

    formik.setFieldValue('charged_short', isChargedShort);

    if (isChargedShort) {
      // Uncheck blocked_holes if charged_short is checked
      if (formik.values.blocked_holes) {
        formik.setFieldValue('blocked_holes', false);
        // Clear comment if blocked_holes was checked
        formik.setFieldValue('comment', '');
      }
    }
  };

  const handleSelectOredrive = async (event) => {
    const lvl_od = event.target.value;
    formik.setFieldValue('selectOredrive', lvl_od);
    formik.setFieldValue('selectRing', '');

    setLoadingRings(true);

    try {
      const response = await fetcher(`/prod-actual/bdcf/charge/${lvl_od}/`);
      const rings = isRecharge ? response.data.charged : response.data.drilled;
      setChargedRings(response.data.charged_rings);
      setRingNumDrop(rings);
      setChargedRings(response.data.charged_rings || []);
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

  const isSubmitDisabled = () => {
    const { selectOredrive, selectRing, explosive, blocked_holes, incomplete, comment } = formik.values;

    // Check if mandatory fields are filled
    const mandatoryFieldsFilled = selectOredrive && selectRing;

    // Check if explosive is required and valid
    const explosiveValid = blocked_holes || explosive;

    // Check if blocked_holes or incomplete require a comment
    const commentValid = (!blocked_holes && !incomplete) || comment;

    // Return the final condition
    return !(mandatoryFieldsFilled && explosiveValid && commentValid);
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
                  label="Charge Date"
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
                    control={<Checkbox checked={formik.values.incomplete} onChange={handleIncomplete} />}
                    label="Incomplete"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={formik.values.charged_short} onChange={handleChargedShort} />}
                    label="Charged Short"
                    labelPlacement="end"
                  />
                </Grid>
                <Grid xs={6}>
                  <FormControlLabel
                    control={<Checkbox checked={formik.values.blocked_holes} onChange={handleBlockedHoles} />}
                    label="Blocked (No charge)"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    control={<Checkbox disabled checked={isRecharge} onChange={handleIsRechargeToggle} />}
                    label="Is Recharged"
                    labelPlacement="end"
                  />
                </Grid>
              </FormGroup>
            </FormControl>

            {(formik.values.incomplete || formik.values.blocked_holes || formik.values.charged_short) && (
              <TextField
                label="Comment"
                name="comment"
                value={formik.values.comment}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.comment && Boolean(formik.errors.comment)}
                helperText={formik.touched.comment && formik.errors.comment}
                fullWidth
                multiline
                rows={4}
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

            <FormControl fullWidth>
              <InputLabel id="explosive-dropdown-label">Charged With</InputLabel>
              <Select
                labelId="explosive-dropdown-label"
                value={formik.values.explosive || ''}
                onChange={(event) => formik.setFieldValue('explosive', event.target.value)}
                label="Charged With"
              >
                {detOptions.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.explosive && formik.errors.explosive && (
                <Typography variant="body2" color="error">
                  {formik.errors.explosive}
                </Typography>
              )}
            </FormControl>

            <Button variant="contained" color="primary" type="submit" disabled={isSubmitDisabled()}>
              {settings['equipment-sounds'] ? 'Lock n Load' : 'Charge Ring'}
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
              <BDCFChargeTable
                oredrive={formik.values.selectOredrive}
                ringData={chargedRings}
                handleSelectOredrive={handleSelectOredrive}
              />
            )
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Completed</TableCell>
                  <TableCell>Ring</TableCell>
                  <TableCell>Detonator</TableCell>
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

export default BDCFChargeTab;

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
