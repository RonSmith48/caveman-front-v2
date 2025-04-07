import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const RingDetailModal = ({ open, onClose }) => {
  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <DialogTitle>
        Full Detail
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close" sx={{ position: 'absolute', right: 16, top: 16 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="h4">NOTHING YET</Typography>
      </DialogContent>
    </Dialog>
  );
};

export default RingDetailModal;
