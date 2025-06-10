import React, { useState, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Radio,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Button,
  Grid,
  Stack,
  Tooltip
} from '@mui/material';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { fetcher, fetcherPost } from 'utils/axiosBack';
import { enqueueSnackbar } from 'notistack';
import MainCard from 'components/MainCard';
import BDCFDefineGroups from 'features/bdcf/GroupTab2';
import BDCFExistingGroups from 'features/bdcf/GroupExistingTable';
import * as Yup from 'yup';

const BDCFGroupTab1 = () => {
  const [levels, setLevels] = useState([]);
  const [rings, setRings] = useState([]);
  const [openHelp, setOpenHelp] = useState(false);
  const [agResponseData, setAgResponseData] = useState(null);
  const formikRef = useRef(null);

  // Fetch levels when radio option changes
  const handleCreateFrom = async (event, setFieldValue, setTouched) => {
    setLevels([]);
    setRings([]);
    setFieldValue('level', '');
    setFieldValue('ring', []);

    setTouched({ level: false, ring: false });

    const drill_charge = event.target.value;

    try {
      const response = await fetcher(`/api/prod-actual/bdcf/groups/levels/${drill_charge}/`);
      setLevels(response.data);
      setFieldValue('createFrom', drill_charge);
    } catch (error) {
      console.error('Error fetching levels:', error);
      enqueueSnackbar('Error fetching levels', { variant: 'error' });
    }
  };

  // Fetch rings when level changes
  const handleSelectLevel = async (event, values, setFieldValue, setTouched) => {
    setRings([]);
    setFieldValue('ring', []);
    setTouched({ ring: false });

    const lvl = event.target.value;

    if (!values.createFrom) {
      enqueueSnackbar('Please select "Drilled Rings" or "Charged Rings" first.', { variant: 'warning' });
      return;
    }

    const payload = {
      level: lvl,
      create_from: values.createFrom
    };

    try {
      const response = await fetcherPost('/api/prod-actual/bdcf/groups/rings-select/', payload);
      setRings(response.data);
      setFieldValue('level', lvl);
    } catch (error) {
      console.error('Error fetching rings:', error);
      enqueueSnackbar('Error fetching rings', { variant: 'error' });
    }
  };

  const resetForm = () => {
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  };

  const validationSchema = Yup.object().shape({
    createFrom: Yup.string().required('You must select an option'),
    level: Yup.number().required('You must select a level'),
    ring: Yup.array().min(1, 'Select at least 1 ring').required('Select at least 1 rings')
  });

  return (
    <Grid container spacing={2}>
      {/* Form Section */}
      <Grid item xs={12} md={4}>
        <MainCard
          title="Aggregate Rings"
          secondary={
            <Tooltip title="Help">
              <IconButton onClick={() => setOpenHelp(true)} size="small">
                <HelpOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          }
          sx={{ '& .MuiCardHeader-root': { padding: '16px 16px' } }}
        >
          <Formik
            innerRef={formikRef}
            initialValues={{
              createFrom: '',
              level: '',
              ring: []
            }}
            validationSchema={validationSchema}
            validateOnMount={true}
            onSubmit={async (values) => {
              const payload = {
                create_from: values.createFrom,
                level: values.level,
                location_ids: values.ring.map((ring) => ring.location_id)
              };

              try {
                const ag_response = await fetcherPost('/api/prod-actual/bdcf/groups/rings-aggregate/', payload);
                if (ag_response && ag_response.data.msg) {
                  enqueueSnackbar(ag_response.data.msg.body, { variant: ag_response.data.msg.type });
                }

                if (ag_response?.data?.rings && ag_response?.data?.aggregate) {
                  setAgResponseData(ag_response.data);
                }
              } catch (error) {
                console.error('Error submitting rings:', error);
                enqueueSnackbar('Error submitting rings', { variant: 'error' });
              }
            }}
          >
            {({ values, errors, touched, isValid, setFieldValue, setTouched }) => (
              <Form>
                {/* Radio Group */}
                <FormControl component="fieldset" error={touched.createFrom && !!errors.createFrom}>
                  <FormLabel component="legend">Create groups from</FormLabel>
                  <RadioGroup
                    row
                    name="createFrom"
                    value={values.createFrom}
                    onChange={(e) => handleCreateFrom(e, setFieldValue, setTouched)}
                  >
                    <FormControlLabel value="Drilled" control={<Radio />} label="Drilled Rings" />
                    <FormControlLabel value="Charged" control={<Radio />} label="Charged Rings" />
                  </RadioGroup>
                  {touched.createFrom && errors.createFrom && <p style={{ color: 'red' }}>{errors.createFrom}</p>}
                </FormControl>

                {/* Level Dropdown */}
                <FormControl fullWidth sx={{ mt: 2 }} error={touched.level && !!errors.level}>
                  <FormLabel>Level</FormLabel>
                  <Select
                    name="level"
                    value={values.level}
                    onChange={(e) => handleSelectLevel(e, values, setFieldValue, setTouched)}
                    disabled={levels.length === 0}
                  >
                    {levels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.level && errors.level && <p style={{ color: 'red' }}>{errors.level}</p>}
                </FormControl>

                {/* Rings Autocomplete */}
                <FormControl fullWidth sx={{ mt: 2 }} error={touched.ring && !!errors.ring}>
                  <Autocomplete
                    multiple
                    disableCloseOnSelect
                    disableClearable
                    options={rings}
                    getOptionLabel={(option) => option.alias}
                    value={values.ring || []}
                    onChange={(_, newValue) => setFieldValue('ring', newValue)}
                    renderOption={(props, option, { selected }) => (
                      <li key={option.alias} {...props} style={{ backgroundColor: selected ? '#f0f0f0' : 'transparent' }}>
                        {option.alias}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Rings"
                        variant="outlined"
                        error={touched.ring && !!errors.ring}
                        helperText={touched.ring && errors.ring}
                      />
                    )}
                    disabled={rings.length === 0}
                  />
                </FormControl>

                {/* Submit Button */}
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }} disabled={!isValid}>
                  Use Selected
                </Button>
              </Form>
            )}
          </Formik>

          {/* Dialog */}
          <Dialog open={openHelp} onClose={() => setOpenHelp(false)} fullWidth>
            <DialogTitle>How it Works</DialogTitle>
            <DialogContent>
              <p>How it works goes here</p>
            </DialogContent>
          </Dialog>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={8}>
        <Stack spacing={2}>
          <BDCFDefineGroups resetForm={resetForm} agData={agResponseData} setAgData={setAgResponseData} />
          <BDCFExistingGroups />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default BDCFGroupTab1;
