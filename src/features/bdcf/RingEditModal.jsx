import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid } from '@mui/material';
import LocationTimeline from 'components/project/LocationTimeline';
// import Stats from './Stats'; // Placeholder for stats component
import LocationEdit from 'components/project/LocationEdit';
import { fetcher } from 'utils/axiosBack'; // Your API fetcher

const RingEditModal = ({ open, onClose, location_id, handleSelectOredrive }) => {
  const [ringDetails, setRingDetails] = useState(null);

  useEffect(() => {
    if (location_id) {
      const fetchRingDetails = async () => {
        try {
          const response = await fetcher(`/prod-actual/history/${location_id}`);
          setRingDetails(response.data);
          console.log(response);
        } catch (error) {
          console.error('Failed to fetch ring details:', error);
        }
      };
      fetchRingDetails();
    }
  }, [location_id]);

  const handleSave = () => {
    // Perform save actions here
    onSave();
    onClose();
    //handleSelectOredrive();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle>Edit Production Ring</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <LocationTimeline location_id={location_id} />
          </Grid>
          <Grid item xs={6}>
            <LocationEdit location_id={location_id} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

RingEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default RingEditModal;
