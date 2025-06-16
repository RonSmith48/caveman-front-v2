import React, { useState } from 'react';
import { AppBar, IconButton, Typography, Dialog, DialogContent, Toolbar, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeviceHubOutlinedIcon from '@mui/icons-material/DeviceHubOutlined';
import ParentChooser from 'components/third-party/konva/ParentChooser';

/**
 * ConceptDesignedPairer
 * Dialog for pairing an orphaned designed ring with a concept ring
 */
export default function ParentChooserModal({ orphanLocationId, onPair, disabled = false }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* Trigger button */}
      <IconButton aria-label="Choose Parent" color="primary" disabled={disabled} onClick={handleOpen}>
        <DeviceHubOutlinedIcon />
      </IconButton>

      <Dialog fullScreen open={open} onClose={handleClose}>
        <AppBar position="relative">
          <Toolbar>
            <Typography variant="h6" sx={{ flex: 1 }}>
              Choosing Conceptual Parent
            </Typography>
            <IconButton edge="end" color="inherit" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <DialogContent>
          <ParentChooser
            orphanLocationId={orphanLocationId}
            onSelect={(conceptRingId) => {
              if (onPair) onPair(conceptRingId);
              handleClose();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
