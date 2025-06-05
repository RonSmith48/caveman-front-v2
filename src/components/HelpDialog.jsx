import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

export default function HelpDialog({ referenceNumber }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button variant="contained" disabled={!values.is_active} startIcon={<EditOutlinedIcon />} onClick={handleOpen}>
        Edit Status
      </Button>

      <Dialog open={open} onClose={handleClose} fullScreen>
        <DialogTitle>Edit Status</DialogTitle>
        <DialogContent>
          {/* Your form or content goes here */}
          <p>This is where you edit the status.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleClose}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
