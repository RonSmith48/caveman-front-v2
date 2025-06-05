import React, { useState, useEffect } from 'react';

// material-ui
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
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
import { fetcher, fetcherPost } from 'utils/axiosBack';
import BDCFBogTable from 'features/bdcf/BogTable';

function BDCFBogTab() {
  const [pickerDate, setPickerDate] = useState(() => dayjs());
  const [pickValue, setPickValue] = useState(() => formatDate(new Date()));
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const currentHour = dayjs().hour();
    const fetchBoggingRings = async () => {
      try {
        const response = await fetcher('/prod-actual/bdcf/bog/');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching active rings list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoggingRings();

    if (currentHour < 12) {
      formik.setFieldValue('pickerDate', dayjs().subtract(1, 'day')); // Yesterday's date
      formik.setFieldValue('shift', 'Night');
    } else {
      formik.setFieldValue('pickerDate', dayjs()); // Today's date
      formik.setFieldValue('shift', 'Day');
    }
  }, []);

  const validationSchema = Yup.object({
    tonnes: Yup.number().integer('Must be an integer').required('Tonnes is required'),
    dropdownValue: Yup.string().required('You must select a ring')
  });

  const formik = useFormik({
    initialValues: {
      tonnes: '',
      pickerDate: null,
      shift: '',
      dropdownValue: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSave(values);
    }
  });

  const handleSelectRing = (event) => {
    const selectedValue = event.target.value;
    formik.setFieldValue('dropdownValue', selectedValue);

    // Update formik state based on selected dropdown
    const selectedItem = data.find((item) => item.location_id === selectedValue);
    if (selectedItem) {
      formik.setFieldValue('selectedRing', {
        location_id: selectedItem.location_id,
        name: selectedItem.value
      });
    }
  };

  const handleSave = async (values) => {
    const formattedDate = formatDate(formik.values.pickerDate);
    const location_id = formik.values.dropdownValue;

    // Prepare the payload with the formatted date
    const payload = {
      date: formattedDate,
      shift: formik.values.shift,
      location_id: formik.values.dropdownValue,
      tonnes: formik.values.tonnes
    };

    try {
      // Use fetcherPost to send the POST request
      const response = await fetcherPost(`/prod-actual/bdcf/bog/${location_id}/`, payload);

      // Log success or handle response as needed
      console.log('Record added successfully:', response);

      // Clear the text input (but keep the rest of the form data intact)
      formik.setFieldValue('tonnes', '');
      formik.setTouched({ tonnes: false });

      enqueueSnackbar(response.data.msg.body, { variant: response.data.msg.type });

      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      // Handle error appropriately
      console.error('Error adding record:', error);
      enqueueSnackbar('Error adding record', { variant: 'error' });
    }
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
                  label="Movement Date"
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

            <FormControl fullWidth>
              <InputLabel id="dropdown-label">Select Ring</InputLabel>
              <Select labelId="dropdown-label" value={formik.values.dropdownValue} label="Select Ring" onChange={handleSelectRing}>
                {data.map((item) => (
                  <MenuItem key={item.location_id} value={item.location_id}>
                    {item.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Tonnes"
              name="tonnes"
              value={formik.values.tonnes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              // error={formik.touched.tonnes && Boolean(formik.errors.tonnes)}
              helperText={formik.touched.tonnes && formik.errors.tonnes}
              fullWidth
            />

            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!formik.isValid || !formik.values.tonnes || !formik.values.dropdownValue}
            >
              Add Bogging Record
            </Button>
          </Box>
        </form>
      </Grid>

      <Grid item xs={12} md={8}>
        <TableContainer component={Paper}>
          {formik.values.dropdownValue ? (
            <BDCFBogTable
              location_id={formik.values.selectedRing?.location_id}
              ringName={formik.values.selectedRing?.name}
              refreshKey={refreshKey}
            /> // This will trigger a re-render on change
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Tonnes</TableCell>
                  <TableCell>Entered (timestamp)</TableCell>
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

export default BDCFBogTab;

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
