'use client';

import React, { useState, useEffect } from 'react';

// Material-UI
import {
  Box,
  Grid,
  Stack,
  TextField,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Third-party
import { Formik } from 'formik';
import { enqueueSnackbar } from 'notistack';

// Project imports
import MainCard from 'components/MainCard';
import { fetcher, fetcherPost } from 'utils/axiosBack';
import HelpDialog from 'components/HelpDialog';

function RingConditionList() {
  const [states, setStates] = useState([]); // Store all ring states
  const [loading, setLoading] = useState(true);
  const [selectedPriState, setSelectedPriState] = useState(''); // Selected primary state
  const [secStates, setSecStates] = useState([]); // Store filtered secondary states
  const [newItem, setNewItem] = useState(''); // New condition input
  const [adding, setAdding] = useState(false); // Button loading state

  // Fetch states data from API
  const fetchStatesList = async () => {
    try {
      const response = await fetcher('/api/prod-actual/ring-states/');
      if (response) {
        setStates(response.data);
      }
    } catch (error) {
      console.error('Error fetching states list:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update secondary states when primary state changes
  useEffect(() => {
    if (selectedPriState) {
      const filteredSecStates = states
        .filter((state) => state.pri_state === selectedPriState && state.sec_state)
        .map((state) => ({ sec_state: state.sec_state, can_delete: state.can_delete }));
      setSecStates(filteredSecStates);
    } else {
      setSecStates([]);
    }
  }, [selectedPriState, states]);

  // Add new condition
  const addItem = async () => {
    if (!newItem.trim()) return;

    // Prevent duplicate entries
    if (secStates.some((state) => state.sec_state === newItem.trim())) {
      console.warn('Duplicate entry detected.');
      return;
    }

    setAdding(true);
    const payload = {
      pri_state: selectedPriState,
      sec_state: newItem.trim()
    };

    try {
      const addState = await fetcherPost('/api/prod-actual/ring-states/', payload);
      setNewItem('');
      fetchStatesList(); // Refresh table after adding
      if (addState?.data?.msg) {
        enqueueSnackbar(addState.data.msg.body, { variant: addState.data.msg.type });
      } else {
        enqueueSnackbar('Condition added successfully', { variant: 'success' });
      }
    } catch (error) {
      console.error('Error adding new condition:', error);
      enqueueSnackbar('Error adding new condition', { variant: 'error' });
    } finally {
      setAdding(false);
    }
  };

  // Remove item
  const removeItem = async (secState) => {
    try {
      const deleteState = await fetcherPost('/api/prod-actual/ring-states/delete/', { pri_state: selectedPriState, sec_state: secState });
      fetchStatesList(); // Refresh table after deletion
      if (deleteState?.data?.msg) {
        enqueueSnackbar(deleteState.data.msg.body, { variant: deleteState.data.msg.type });
      } else {
        enqueueSnackbar('Condition deleted successfully', { variant: 'success' });
      }
    } catch (error) {
      console.error('Error deleting condition:', error);
      enqueueSnackbar('Error deleting condition', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchStatesList();
  }, []);

  return (
    <MainCard title="Ring Conditions" secondary={<HelpDialog id={13} />}>
      {!loading ? (
        <Box>
          <Grid container spacing={3}>
            {/* Selection & Input Section */}
            <Grid item xs={12} md={5}>
              <Stack spacing={2}>
                {/* Primary State Selector */}
                <Select fullWidth value={selectedPriState} onChange={(e) => setSelectedPriState(e.target.value)} displayEmpty>
                  <MenuItem value="" disabled>
                    Select Primary State
                  </MenuItem>
                  {Array.from(new Set(states.map((state) => state.pri_state))).map((priState, index) => (
                    <MenuItem key={index} value={priState}>
                      {priState}
                    </MenuItem>
                  ))}
                </Select>

                {/* New Condition Input */}
                <TextField fullWidth label="New Ring Condition" value={newItem} onChange={(e) => setNewItem(e.target.value)} />
                <Button variant="contained" onClick={addItem} disabled={adding || !newItem.trim()}>
                  {adding ? 'Adding...' : 'Add'}
                </Button>
              </Stack>
            </Grid>

            {/* Secondary State Table */}
            <Grid item xs={12} md={7}>
              <TableContainer component={Paper}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Condition</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Actions</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  {secStates.length > 0 && (
                    <TableBody>
                      {secStates.map((state, index) => (
                        <TableRow key={index}>
                          <TableCell>{state.sec_state}</TableCell>
                          <TableCell align="right">
                            <IconButton edge="end" onClick={() => removeItem(state.sec_state)} disabled={!state.can_delete}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <CircularProgress />
      )}
    </MainCard>
  );
}

export default RingConditionList;
