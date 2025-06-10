import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Chip,
  Typography,
  Button,
  TextField,
  IconButton,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Paper,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import MainCard from 'components/MainCard';
import { fetcherPost } from 'utils/axiosBack';
import { enqueueSnackbar } from 'notistack';

import { Formik, Field, FieldArray, Form } from 'formik';
import * as Yup from 'yup';

const BDCFGroupTab2 = ({ resetForm, agData, setAgData }) => {
  // Local UI state (for the Help and Reference dialogs)
  const [openHelp, setOpenHelp] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [disabled, setDisabled] = useState(true);

  // When agData becomes available, we could also reset any other state if needed.
  useEffect(() => {
    if (agData) {
      setDisabled(false);
    }

    // (If you need to perform any side effects when agData changes, do it here.)
  }, [agData]);

  // This helper builds a Yup validation schema based on the current split type.
  // It validates each entry and also tests that the total (tonnes or volume)
  // exactly matches the aggregate from agData.
  const getValidationSchema = () =>
    Yup.object().shape({
      entries: Yup.array().of(
        Yup.object().shape({
          name: Yup.string()
            .required('Name is required')
            .matches(/^[a-zA-Z0-9\s\-\_+&()/]*$/, 'Invalid name'),
          draw_percentage: Yup.number().typeError('Must be a number').required('Draw is required').min(0.1, 'Min is 0.1').max(2, 'Max is 2')
        })
      )
    });

  // Initial form values
  const initialValues = {
    splitType: 'tonnes',
    entries: agData?.form_elements
      ? [
          {
            level: agData.form_elements.level, // Always set the level
            oredrive: agData.form_elements.oredrive.length > 0 ? agData.form_elements.oredrive[0] : '', // Set the first oredrive
            name: '',
            tonnes: '',
            volume: '',
            draw_percentage: ''
          }
        ]
      : []
  };

  const handleSubmit = async (values, { resetForm: formikReset }) => {
    const payload = {
      original: agData.rings,
      aggregate: agData.aggregate,
      custom: values.entries.map((entry) => ({
        level: entry.level, // Ensure level is sent
        oredrive: entry.oredrive, // Ensure oredrive is sent
        name: entry.name,
        tonnes: entry.tonnes,
        volume: entry.volume,
        draw_percentage: entry.draw_percentage
      }))
    };

    try {
      const response = await fetcherPost('/api/prod-actual/bdcf/groups/custom-rings/', payload);
      console.log('Submission successful:', response);
      enqueueSnackbar('Submission successful!', { variant: 'success' });

      // Reset form only on success
      if (resetForm) resetForm();
      formikReset();
      if (setAgData) setAgData(null);
    } catch (error) {
      console.error('Error fetching rings:', error);
      enqueueSnackbar('Error fetching rings', { variant: 'error' });
    }
  };

  return (
    <MainCard
      title="Define Custom Rings from Group"
      secondary={
        <Tooltip title="Help">
          <IconButton onClick={() => setOpenHelp(true)} size="small">
            <HelpOutlineOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      }
      sx={{ '& .MuiCardHeader-root': { padding: '16px 16px' } }}
    >
      {/* Aggregate Totals Card */}
      {agData && (
        <Card sx={{ mb: 2, p: 0, backgroundColor: '#f5f5f5' }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Typography variant="h6">Aggregate Totals</Typography>
              <Typography variant="body2">
                <strong>Tonnes:</strong> {agData.aggregate.designed_tonnes.toFixed(1)} | <strong>Volume:</strong>{' '}
                {agData.aggregate.volume.toFixed(2)}
              </Typography>
            </div>
            <Button variant="outlined" onClick={() => setOpenDialog(true)}>
              Reference
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog for Reference Data Table */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Aggregated Rings</DialogTitle>
        <DialogContent>
          {agData?.rings && (
            <TableContainer component={Paper}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Alias</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Design/Modelled</strong>
                    </TableCell>
                    <TableCell>
                      <strong>In Flow</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Draw</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Holes</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {agData.rings.map((ring, index) => (
                    <TableRow key={index}>
                      <TableCell>{ring.alias}</TableCell>
                      <TableCell>{ring.designed_tonnes}</TableCell>
                      <TableCell>
                        <Chip
                          label={ring.in_flow ? 'Yes' : 'No'}
                          color={ring.in_flow ? 'warning' : 'success'}
                          variant="outlined"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell>{ring.draw_percentage.toFixed(3)}</TableCell>
                      <TableCell>{ring.holes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Formik Form */}
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        // We use a custom validate function so that the schema can be re-created
        // based on the current split type.
        validate={(values) => {
          try {
            getValidationSchema(values.splitType).validateSync(values, {
              abortEarly: false
            });
            return {};
          } catch (err) {
            const formErrors = {};
            if (err.inner) {
              err.inner.forEach((error) => {
                // If an error already exists for this field, keep the first one.
                if (!formErrors[error.path]) {
                  formErrors[error.path] = error.message;
                }
              });
            } else {
              formErrors[err.path] = err.message;
            }
            return formErrors;
          }
        }}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, isValid, isSubmitting, setFieldValue }) => {
          // Compute the running total and remaining balance:
          const total = values.entries.reduce((sum, entry) => sum + (Number(entry[values.splitType]) || 0), 0);
          const remaining =
            values.splitType === 'tonnes'
              ? parseFloat(((agData?.aggregate?.designed_tonnes ?? 0) - total).toFixed(1))
              : parseFloat(((agData?.aggregate?.volume ?? 0) - total).toFixed(2));

          return (
            <Form>
              {/* Split Type Radio Group */}
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend">Split By</FormLabel>
                <Field name="splitType">
                  {({ field }) => (
                    <RadioGroup
                      row
                      {...field}
                      onChange={(e) => {
                        // Update splitType and reset the entries when it changes.
                        setFieldValue('splitType', e.target.value);
                        setFieldValue('entries', []);
                      }}
                    >
                      <FormControlLabel value="tonnes" control={<Radio />} label="Tonnes" />
                      <FormControlLabel value="volume" control={<Radio />} label="Volume" />
                    </RadioGroup>
                  )}
                </Field>
              </FormControl>

              {/* Dynamic Entries */}
              <FieldArray name="entries">
                {({ push, remove }) => (
                  <>
                    <Grid container spacing={2}>
                      {values.entries.map((entry, index) => (
                        <Grid container item spacing={1} key={index} alignItems="center">
                          {/* Level Display */}
                          <Grid item xs={1}>
                            <Field name={`entries.${index}.level`}>
                              {({ field }) => <Typography {...field}>{field.value}</Typography>}
                            </Field>
                          </Grid>

                          {/* Oredrive Field - Ensure it is included in Formik state */}
                          <Grid item>
                            <Field name={`entries.${index}.oredrive`}>
                              {({ field }) =>
                                agData?.form_elements.oredrive.length > 1 ? (
                                  <TextField
                                    select
                                    label="Ore Drive"
                                    fullWidth
                                    required
                                    {...field}
                                    value={field.value || agData.form_elements.oredrive[0]}
                                    onChange={(e) => setFieldValue(`entries.${index}.oredrive`, e.target.value)}
                                  >
                                    {agData.form_elements.oredrive.map((drive) => (
                                      <MenuItem key={drive} value={drive}>
                                        {drive}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                ) : (
                                  <Typography {...field}>{field.value}</Typography>
                                )
                              }
                            </Field>
                          </Grid>

                          {/* Name Field */}
                          <Grid item xs={2}>
                            <Field name={`entries.${index}.name`}>
                              {({ field, meta }) => (
                                <TextField
                                  label="Ring Name"
                                  fullWidth
                                  required
                                  value={values.entries[index].name}
                                  onChange={(e) => {
                                    const newValue = e.target.value;
                                    // Prevent typing of invalid characters
                                    if (/^[a-zA-Z0-9\-\_+&()/]*$/.test(newValue)) {
                                      setFieldValue(`entries.${index}.name`, newValue);
                                    }
                                  }}
                                  error={touched.entries?.[index]?.name && Boolean(errors.entries?.[index]?.name)}
                                  helperText={touched.entries?.[index]?.name && errors.entries?.[index]?.name}
                                />
                              )}
                            </Field>
                          </Grid>

                          {/* Tonnes or Volume Field */}
                          <Grid item xs={2}>
                            <Field name={`entries.${index}.${values.splitType}`}>
                              {({ field, meta }) => (
                                <TextField
                                  label={values.splitType === 'tonnes' ? 'Tonnes' : 'Volume'}
                                  type="number"
                                  fullWidth
                                  required
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value;

                                    // Allow only numbers and decimals, preventing multiple dots
                                    if (/^\d*\.?\d*$/.test(value) || value === '') {
                                      field.onChange(e); // Allow valid value
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === '-' || e.key === 'e') {
                                      e.preventDefault(); // Prevent typing '-' or 'e'
                                    }
                                  }}
                                  inputProps={{ min: 0, step: values.splitType === 'tonnes' ? 0.1 : 0.01 }} // Adjust step size dynamically
                                  error={meta.touched && Boolean(meta.error)}
                                  helperText={meta.touched && meta.error}
                                />
                              )}
                            </Field>
                          </Grid>

                          {/* Draw Percentage */}
                          <Grid item xs={2}>
                            <Field name={`entries.${index}.draw_percentage`}>
                              {({ field, meta }) => (
                                <TextField
                                  label="Draw"
                                  type="number"
                                  fullWidth
                                  required
                                  inputProps={{ min: 0, max: 2, step: 0.001 }}
                                  {...field}
                                  error={meta.touched && Boolean(meta.error)}
                                  helperText={meta.touched && meta.error}
                                />
                              )}
                            </Field>
                          </Grid>

                          {/* Fill Remainder Button */}
                          <Grid item>
                            <Tooltip title="Fill with Remaining">
                              <IconButton
                                variant="outlined"
                                color="secondary"
                                onClick={() => {
                                  setFieldValue(`entries.${index}.${values.splitType}`, remaining);
                                }}
                                disabled={remaining <= 0}
                              >
                                <AutoFixHighIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>

                          {/* Remove Button */}
                          <Grid item xs={1}>
                            <Tooltip title="Remove Entry">
                              <IconButton color="secondary" onClick={() => remove(index)}>
                                <DeleteOutlineOutlinedIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Add New Entry Button */}
                    <Button
                      onClick={() =>
                        push({
                          level: agData.form_elements.level, // Ensure level is initialized
                          oredrive: agData.form_elements.oredrive.length > 0 ? agData.form_elements.oredrive[0] : '',
                          name: '',
                          tonnes: '',
                          volume: '',
                          draw_percentage: ''
                        })
                      }
                      variant="contained"
                      sx={{ mt: 2 }}
                      disabled={disabled}
                    >
                      + Define a Custom Ring
                    </Button>
                  </>
                )}
              </FieldArray>

              {/* Remaining Balance */}
              <Grid sx={{ mt: 1 }}>
                {!disabled && (
                  <Typography variant="body1" sx={{ mt: 2, color: remaining === 0 ? 'green' : 'black' }}>
                    {values.splitType === 'tonnes'
                      ? `Remaining Tonnes: ${remaining.toFixed(1)}`
                      : `Remaining Volume: ${remaining.toFixed(2)}`}
                  </Typography>
                )}
              </Grid>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                disabled={remaining !== 0 || !isValid || isSubmitting}
              >
                Submit
              </Button>
            </Form>
          );
        }}
      </Formik>

      {/* Help Dialog */}
      <Dialog open={openHelp} onClose={() => setOpenHelp(false)} fullWidth>
        <DialogTitle>How it Works</DialogTitle>
        <DialogContent>
          <p>How it works goes here</p>
          <p>Dont forget to mention what happens when working with flow tonnes.</p>
        </DialogContent>
      </Dialog>
    </MainCard>
  );
};

export default BDCFGroupTab2;
