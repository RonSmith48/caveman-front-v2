// ParentChooserModal.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Divider,
  IconButton,
  Typography,
  Dialog,
  DialogContent,
  Toolbar,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Card,
  CardContent,
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeviceHubOutlinedIcon from '@mui/icons-material/DeviceHubOutlined';
import ParentChooser from 'components/third-party/konva/ParentChooser';
import HelpDialog from 'components/HelpDialog';
import MainCard from 'components/MainCard';

export default function ParentChooserModal({ orphanLocationId, onPair, disabled = false }) {
  const [open, setOpen] = useState(false);
  const [showCandidates, setShowCandidates] = useState(true);
  const [showNearby, setShowNearby] = useState(true);
  const [displayMode, setDisplayMode] = useState('none');
  const [hoveredData, setHoveredData] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="Choose Parent" arrow>
        <IconButton aria-label="Choose Parent" color="primary" disabled={disabled} onClick={handleOpen}>
          <DeviceHubOutlinedIcon />
        </IconButton>
      </Tooltip>

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
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Box sx={{ flex: '0 0 auto' }}>
              <ParentChooser
                orphanLocationId={orphanLocationId}
                showCandidates={showCandidates}
                showNearby={showNearby}
                displayMode={displayMode}
                onHover={(data) => setHoveredData(data)}
                onSelect={(ring) => {
                  if (onPair) onPair(ring);
                  handleClose();
                }}
              />
            </Box>

            <Box sx={{ flex: '0 0 350px', ml: 2, display: 'flex', flexDirection: 'column' }}>
              <MainCard title="Options" secondary={<HelpDialog id={16} />}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Highlight By</FormLabel>
                  <RadioGroup row value={displayMode} onChange={(e) => setDisplayMode(e.target.value)}>
                    <FormControlLabel value="none" control={<Radio />} label="None" />
                    <FormControlLabel value="cu" control={<Radio />} label="Copper" />
                    <FormControlLabel value="au" control={<Radio />} label="Gold" />
                    <FormControlLabel value="density" control={<Radio />} label="Density" />
                  </RadioGroup>
                </FormControl>
                <Divider sx={{ my: 2 }} />

                <FormControlLabel
                  control={<Checkbox checked={showCandidates} onChange={() => setShowCandidates((prev) => !prev)} />}
                  label="Show Candidates"
                />
                <FormControlLabel
                  control={<Checkbox checked={showNearby} onChange={() => setShowNearby((prev) => !prev)} />}
                  label="Show Nearby Rings"
                />
              </MainCard>

              <Card sx={{ mt: 2, width: '100%', overflowY: 'auto', flex: 1 }}>
                <CardContent>
                  {hoveredData ? (
                    <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                      <Box component="thead">
                        <Box component="tr">
                          <Box component="th" colSpan={2} sx={{ textAlign: 'left', pb: 1 }}>
                            Details
                          </Box>
                        </Box>
                      </Box>
                      <Box component="tbody">
                        {Object.entries(hoveredData).map(([key, value]) => {
                          let display = String(value);
                          if (key === 'dist') display = `${value.toFixed(2)} m`;
                          if (key === 'cu') display = `${value} %`;
                          if (key === 'au') display = `${value} g/t`;
                          return (
                            <Box component="tr" key={key}>
                              <Box component="td" sx={{ pr: 1, verticalAlign: 'top', fontWeight: 'bold' }}>
                                {key}
                              </Box>
                              <Box component="td" sx={{ verticalAlign: 'top' }}>
                                {display}
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2">Hover over a ring for details</Typography>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
