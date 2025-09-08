import React, { useState } from 'react';
import MainCard from 'components/MainCard';
import RightTriangleCalc from './triangle-calc/RightTriangleCalc';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

function DetachMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleDetach = () => {
    handleClose();
    const url = `${window.location.origin}/prod-eng/ring-design/triangle-calc`;
    const features = [
      'width=500',
      'height=700',
      'menubar=no',
      'toolbar=no',
      'location=no',
      'status=no',
      'scrollbars=yes',
      'resizable=yes',
      'noopener',
      'noreferrer'
    ].join(',');
    const w = window.open(url, 'RightTriangleCalcPlain', features);
    if (w) {
      try {
        w.opener = null;
      } catch {}
      w.focus();
    }
  };

  return (
    <>
      <IconButton aria-label="more" aria-controls={open ? 'rt-menu' : undefined} aria-haspopup="true" onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu id="rt-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleDetach}>
          <ListItemIcon>
            <OpenInNewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Pop-out" />
        </MenuItem>
      </Menu>
    </>
  );
}

export default function DnBToolbox() {
  return (
    <MainCard title="Right Triangle Calculator" secondary={<DetachMenu />} sx={{ maxWidth: 500 }}>
      <RightTriangleCalc />
    </MainCard>
  );
}
