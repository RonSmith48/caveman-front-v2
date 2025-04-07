import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function GroupsHelp({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Why Can't I Delete This Group?</DialogTitle>
      <DialogContent>
        <p>Groups cannot be deleted when they have been modified. To enable deletion:</p>
        <ul>
          <li>Ensure all custom rings have the same status as pooled rings.</li>
          <li>To make status the same, you may have to reverse transactions</li>
          <li>Go to the indiviual ring(s) to reverse transactions</li>
        </ul>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
