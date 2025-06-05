import React, { useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button, CardContent, Chip, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MainCard from 'components/MainCard';
import { Delete as DeleteIcon, HelpOutline as HelpIcon, ArrowForward } from '@mui/icons-material';
import GroupHelp from 'features/bdcf/GroupHelp';
import { fetcher } from 'utils/axiosBack';
import { enqueueSnackbar } from 'notistack';

const InspectionDialog = ({ open, onClose, selectedRow = {}, refresh }) => {
  const { pooled_rings = {}, group_rings = [], touched = false, id: group } = selectedRow;
  const pooledStatus = pooled_rings.status || 'Unknown';
  const [helpOpen, setHelpOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Track delete status

  // Handle Delete Group Request
  const handleDelete = async () => {
    if (!selectedRow) return;
    setIsDeleting(true);
    try {
      await fetcher(`/prod-actual/bdcf/groups/remove/${selectedRow.id}/`);
      enqueueSnackbar('Group removed successfully', { variant: 'success' });
      refresh;
      onClose(); // Close dialog after successful deletion
    } catch (error) {
      console.error('Error deleting group:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { overflowX: 'hidden', minHeight: '80vh' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Inspection Details
          <IconButton edge="end" color="inherit" onClick={() => setHelpOpen(true)} aria-label="help">
            <HelpIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Cards Side by Side */}
          <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Pooled Rings Card */}
            <MainCard
              sx={{ minWidth: 350, p: 0 }}
              title="Pooled Rings"
              secondary={
                <>
                  <Chip label={pooledStatus} color="primary" size="small" />
                </>
              }
            >
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {pooled_rings.rings?.map((ring) => (
                    <Chip key={ring.location_id} label={ring.alias} color="secondary" variant="outlined" />
                  ))}
                </Box>
              </CardContent>
            </MainCard>

            {/* Arrow Leading to Group Rings */}
            <ArrowForward sx={{ fontSize: 40 }} />

            {/* Group Rings Card */}
            <MainCard sx={{ minWidth: 350, p: 0 }} title="Grouped Custom Rings">
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {group_rings.map((ring) => (
                    <Box key={ring.location_id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                      <Chip label={ring.alias} color="secondary" variant="outlined" />
                      <Chip label={ring.status} color={ring.status === pooledStatus ? 'primary' : 'error'} size="small" />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </MainCard>
          </Box>

          {/* Centered Delete Button Below */}
          <Box sx={{ textAlign: 'center', marginTop: 3 }}>
            <span>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                disabled={touched || isDeleting} // Disable when touched or deleting
                onClick={handleDelete}
              >
                {isDeleting ? 'Deleting...' : 'Delete Group'}
              </Button>
            </span>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Help Dialog */}
      <GroupHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
};

export default InspectionDialog;
