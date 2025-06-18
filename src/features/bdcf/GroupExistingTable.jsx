'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Formik, Form, Field } from 'formik';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { fetcher } from 'utils/axiosBack';
import { enqueueSnackbar } from 'notistack';
import MainCard from 'components/MainCard';
import HelpDialog from 'components/HelpDialog';
import SearchIcon from '@mui/icons-material/Search';
import ProfileAvatar from 'components/ProfileAvatar';
import InspectionDialog from 'features/bdcf/InspectFireGroupDialog';

const BDCFExistingGroups = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState([true]);
  const SM_AVATAR_SIZE = 32;

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetcher('/api/prod-actual/bdcf/groups/existing/');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching designed rings list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (row) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

  return (
    <MainCard
      title="Existing Groups"
      secondary={
        <Tooltip title="Help">
          <IconButton onClick={() => setOpenHelp(true)} size="small">
            <HelpDialog id={8} />
          </IconButton>
        </Tooltip>
      }
      sx={{ '& .MuiCardHeader-root': { padding: '16px 16px' } }}
    >
      {/* Collapsible Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Oredrive</TableCell>
              <TableCell>Contributor</TableCell>
              <TableCell>Inspect</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && groups.length > 0 ? (
              groups.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    {new Date(row.date).getDate().toString().padStart(2, '0')}-
                    {(new Date(row.date).getMonth() + 1).toString().padStart(2, '0')}-{new Date(row.date).getFullYear()}
                  </TableCell>

                  <TableCell>{row.level}</TableCell>
                  <TableCell>{row.oredrive}</TableCell>
                  <TableCell>
                    <Tooltip title={row.contributor.full_name}>
                      <div
                        style={{
                          width: SM_AVATAR_SIZE,
                          height: SM_AVATAR_SIZE,
                          backgroundColor: row.contributor?.bg_colour,
                          borderRadius: '50%', // Makes the background a circle
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          overflow: 'hidden' // Ensures the avatar stays inside the circle
                        }}
                      >
                        <ProfileAvatar user={row.contributor} size={SM_AVATAR_SIZE} />
                      </div>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Inspect">
                      <IconButton onClick={() => handleOpenDialog(row)}>
                        <SearchIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {loading ? 'Loading...' : 'No active groups'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Inspect Dialog */}
      {selectedRow && (
        <InspectionDialog open={openDialog} onClose={() => setOpenDialog(false)} selectedRow={selectedRow} refresh={fetchData} />
      )}
    </MainCard>
  );
};

export default BDCFExistingGroups;
