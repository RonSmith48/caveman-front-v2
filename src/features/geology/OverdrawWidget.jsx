import React, { useEffect, useState } from 'react';
import { useNotifier } from 'contexts/NotifierContext';
import { notifyActivity } from 'utils/notifierHelpers';
import {
  Box,
  MenuItem,
  Button,
  Paper,
  Divider,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
  Select,
  TextField,
  CircularProgress
} from '@mui/material';
import { fetcher, fetcherPost } from 'utils/axiosBack';
import LocationHistoryTimeline from 'components/history/LocationHistoryTimeline';
import { enqueueSnackbar } from 'notistack';

export default function OverdrawWidget() {
  const [rings, setRings] = useState([]);
  const [selectedRingId, setSelectedRingId] = useState('');
  const [selectedRing, setSelectedRing] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('approved');
  const [loading, setLoading] = useState(true);
  const { notify } = useNotifier();

  useEffect(() => {
    fetchRings();
  }, []);

  const fetchRings = async () => {
    setLoading(true);
    const res = await fetcher('/prod-actual/geology/overdraw/');
    setRings(res.data);
    setLoading(false);
    if (res.data?.msg?.body) {
      enqueueSnackbar(response.data.msg.body, { variant: response.data.msg.type });
    }
  };

  useEffect(() => {
    const ring = rings.find((r) => r.location_id === selectedRingId);
    setSelectedRing(ring || null);
  }, [selectedRingId, rings]);

  const handleSubmit = async () => {
    if (status === 'approved' && (!quantity || parseFloat(quantity) <= 0)) {
      alert('Please enter a valid quantity for Ore.');
      return;
    }

    const payload = {
      ring_id: selectedRingId,
      quantity: status === 'rejected' ? 0 : Number(quantity),
      reason,
      status
    };

    const response = await fetcherPost('/prod-actual/geology/overdraw/', payload);
    setQuantity('');
    setReason('');
    fetchRings();
    notifyActivity(notify, selectedRingId, 'updated');
    if (response?.data?.msg) {
      enqueueSnackbar(response.data.msg.body, { variant: response.data.msg.type });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={5}>
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6">Overdraw Allocation</Typography>

          <Box sx={{ mt: 2 }}>
            <Select value={selectedRingId} onChange={(e) => setSelectedRingId(e.target.value)} displayEmpty fullWidth>
              <MenuItem value="" disabled>
                Select a Ring
              </MenuItem>
              {rings.map((r) => (
                <MenuItem key={r.location_id} value={r.location_id}>
                  {`${r.level} ${r.oredrive} R${r.ring_number_txt}`}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {selectedRing && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                Designed: {selectedRing.designed_tonnes}t | Bogged: {selectedRing.bogged_tonnes}t
              </Typography>
              <Typography variant="body2">Previously Allocated: {selectedRing.overdraw_total}t</Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1">New Entry</Typography>
              <FormLabel sx={{ mt: 2 }}>Declare Drawpoint:</FormLabel>
              <RadioGroup row value={status} onChange={(e) => setStatus(e.target.value)}>
                <FormControlLabel value="approved" control={<Radio />} label="Ore" />
                <FormControlLabel value="rejected" control={<Radio />} label="Waste" />
              </RadioGroup>

              {status === 'approved' && (
                <TextField
                  type="number"
                  label="Quantity"
                  fullWidth
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  sx={{ mt: 1 }}
                  required
                />
              )}
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                This comment will appear on the Level Status Report seen by the Production Shiftboss. Please keep it clear and concise.
              </Typography>
              <TextField
                label="Comment"
                fullWidth
                multiline
                minRows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                sx={{ mt: 2 }}
              />

              <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
                Submit Overdraw
              </Button>
            </Box>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12} sm={8} md={7}>
        {selectedRing && (
          <LocationHistoryTimeline
            location_id={selectedRing.location_id}
            defaultSources={['state', 'comments']}
            showMenu={true}
            filter={{ showDepartmentDropdown: true }}
          />
        )}
      </Grid>

      {loading && (
        <Grid item xs={12}>
          <CircularProgress sx={{ mt: 2 }} />
        </Grid>
      )}
    </Grid>
  );
}
