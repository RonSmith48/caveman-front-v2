import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Tooltip,
  Typography,
  Chip
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import ProfileAvatar from 'components/ProfileAvatar';
import { Formik, Form, Field } from 'formik';
import { fetcher, fetcherPatch } from 'utils/axios';
import RingDetailModal from 'features/bdcf/RingDetailModal';
import BDCFBogTable from 'features/bdcf/BogTable';

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
};

const FireEditModal = ({ open, onClose, location_id, handleSelectLevel, level }) => {
  const [ringDetails, setRingDetails] = useState(null);
  const [conditionOptions, setConditionOptions] = useState([]);
  const [openFullDetail, setopenFullDetail] = useState(false);
  const [openUnchargeConfirm, setOpenUnchargeConfirm] = useState(false);

  const SM_AVATAR_SIZE = 32;
  const LG_AVATAR_SIZE = 52;
  const DEFAULT_AVATAR_BGCOLOUR = '#F5F5F5';

  // Fetch the ring details for the selected location.
  useEffect(() => {
    if (open && location_id) {
      const fetchAllData = async () => {
        try {
          const [ringDetail, chargeResponse, detTypes] = await Promise.all([
            fetcher(`/prod-actual/bdcf/${location_id}`),
            fetcher('/prod-actual/bdcf/conditions/Bogging/')
          ]);
          setRingDetails(ringDetail.data);
          console.log(ringDetail.data);
          setConditionOptions(chargeResponse.data);
        } catch (error) {
          console.error('Failed to fetch detonator options:', error);
        }
      };
      fetchAllData();
    }
  }, [open, location_id]);

  const handleUnchargeClick = () => {
    setOpenUnchargeConfirm(true); // Open confirmation dialog
  };

  const handleCancelUncharge = () => {
    setOpenUnchargeConfirm(false); // Close confirmation dialog
  };

  const handleProceedUncharge = async () => {
    try {
      const payload = {
        location_id: ringDetails.prod_ring?.location_id // Send location_id to API
      };

      // Send DELETE request to API
      await fetcher(`/prod-actual/bdcf/unfire/${location_id}/`);

      onClose(); // Close main dialog
    } catch (error) {
      console.error('Uncharge Error:', error.response?.data || error.message);
    } finally {
      setOpenUnchargeConfirm(false); // Close confirmation dialog
      handleSelectLevel({ target: { value: level } });
    }
  };

  const handleFullDetail = () => {
    setopenFullDetail(true);
  };
  const handleCloseFullDetail = () => {
    setopenFullDetail(false);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        location_id: ringDetails.prod_ring?.location_id, // Ensure this is passed
        conditions: values.conditions.map((cond) => cond.id),
        comment: values.comment
      };

      // Send POST request to API
      const response = await fetcherPatch('/prod-actual/bdcf/charge/', payload);

      onClose(); // Close dialog after successful submission
    } catch (error) {
      console.error('Submission Error:', error.response?.data || error.message);
    } finally {
      setSubmitting(false);
      handleSelectLevel({ target: { value: level } });
    }
  };

  // Compute the selected conditions based on ringDetails.changes and conditionOptions.
  const selectedConditions =
    ringDetails?.changes && conditionOptions.length
      ? conditionOptions.filter((option) =>
          ringDetails.changes.some((change) => change.sec_state === option.sec_state && change.is_active === true)
        )
      : [];

  // While ringDetails is still being fetched, show a loading dialog.
  if (!ringDetails) {
    return (
      <Dialog open={open} onClose={onClose} fullScreen>
        <DialogTitle>Loading...</DialogTitle>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle>Edit Production Ring</DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3} justifyContent="space-between">
          {/* Left Side: Table */}
          <Grid item xs={12} md={9}>
            <BDCFBogTable location_id={ringDetails.prod_ring?.location_id} ringName={ringDetails.prod_ring?.alias} refreshKey={null} />
            <br />
            <TableContainer component={Paper} sx={{ overflowX: 'auto', minHeight: '300px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>State</TableCell>
                    <TableCell>Condition</TableCell>
                    <TableCell>Comment</TableCell>
                    <TableCell>Activated</TableCell>
                    <TableCell>Deactivated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ringDetails.changes?.map((change, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(change.created_at)}</TableCell>
                      <TableCell>{change.pri_state}</TableCell>
                      <TableCell>
                        {change.sec_state && (
                          <Chip
                            label={change.sec_state}
                            variant="outlined"
                            color={change.is_active ? 'primary' : 'secondary'}
                            size="small"
                          />
                        )}
                      </TableCell>
                      <TableCell>{change.comment}</TableCell>
                      <TableCell>
                        {change.activated && (
                          <Tooltip title={change.activated?.full_name}>
                            <div
                              style={{
                                width: SM_AVATAR_SIZE,
                                height: SM_AVATAR_SIZE,
                                backgroundColor: change.activated?.bg_colour || DEFAULT_AVATAR_BGCOLOUR,
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                overflow: 'hidden'
                              }}
                            >
                              <ProfileAvatar user={change.activated} size={SM_AVATAR_SIZE} />
                            </div>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>
                        {change.deactivated && (
                          <Tooltip title={change.deactivated?.full_name}>
                            <div
                              style={{
                                width: SM_AVATAR_SIZE,
                                height: SM_AVATAR_SIZE,
                                backgroundColor: change.deactivated?.bg_colour || DEFAULT_AVATAR_BGCOLOUR,
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                overflow: 'hidden'
                              }}
                            >
                              <ProfileAvatar user={change.deactivated} size={SM_AVATAR_SIZE} />
                            </div>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Right Side: Form */}
          <Grid item xs={12} md={3}>
            <Formik
              initialValues={{
                conditions: selectedConditions,
                comment: '' // New field for comment
              }}
              enableReinitialize
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <Grid container spacing={2} sx={{ pt: 1 }}>
                    {/* Conditions Autocomplete */}
                    <Grid item xs={12}>
                      <Autocomplete
                        multiple
                        options={conditionOptions}
                        getOptionLabel={(option) => option.sec_state}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        value={values.conditions}
                        onChange={(event, newValue) => setFieldValue('conditions', newValue)}
                        disableClearable
                        renderInput={(params) => (
                          <TextField {...params} variant="outlined" label="Ring Conditions" placeholder="Select conditions" />
                        )}
                      />
                    </Grid>

                    {/* Comment Multiline Textbox */}
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        multiline
                        rows={3} // Adjust the number of rows as needed
                        variant="outlined"
                        label="Comment"
                        name="comment"
                        placeholder="Enter comment here"
                      />
                    </Grid>

                    {/* Buttons */}
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="flex-start" gap={2}>
                        <Button
                          onClick={handleUnchargeClick}
                          variant="outlined"
                          color="warning"
                          disabled={parseFloat(ringDetails?.prod_ring?.bogged_tonnes) !== 0}
                        >
                          Un-Fire
                        </Button>
                        <Button onClick={handleFullDetail} variant="outlined">
                          Full Detail
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Dialog Actions */}
                  <DialogActions sx={{ mt: 2 }}>
                    <Button onClick={onClose} color="secondary">
                      Cancel
                    </Button>
                    <Button type="submit" color="primary">
                      Save
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </DialogContent>
      <RingDetailModal open={openFullDetail} onClose={handleCloseFullDetail} />
      {/* Uncharge warning dialog */}
      <Dialog open={openUnchargeConfirm} onClose={handleCancelUncharge} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Un-Fire</DialogTitle>
        <DialogContent>
          <Typography>Rollback to charged state?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUncharge} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleProceedUncharge} color="error" variant="contained">
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

FireEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  location_id: PropTypes.string, // adjust to match the type of your location_id
  handleSelectOredrive: PropTypes.func
};

export default FireEditModal;
