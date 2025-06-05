import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormControlLabel, Grid2, InputLabel, MenuItem, Select, Switch, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetcherPost } from 'utils/axiosBack';
import MainCard from 'components/MainCard';

export default function RingEditorPage() {
  const navigate = useNavigate();

  const [level, setLevel] = useState('');
  const [oredrive, setOredrive] = useState('');
  const [ring, setRing] = useState('');

  const [levels, setLevels] = useState([]);
  const [oredrives, setOredrives] = useState([]);
  const [rings, setRings] = useState([]);

  const [includeInactive, setIncludeInactive] = useState(false);
  const [includeCompleted, setIncludeCompleted] = useState(false);

  useEffect(() => {
    fetcherPost('/prod-actual/ring-editor/levels/', {
      include_inactive: includeInactive,
      include_completed: includeCompleted
    })
      .then((res) => setLevels(res.data || []))
      .catch((err) => console.error('Failed to fetch levels', err));

    setLevel('');
    setOredrive('');
    setRing('');
  }, [includeInactive, includeCompleted]);

  useEffect(() => {
    if (!level) return;

    fetcherPost('/prod-actual/ring-editor/oredrives/', {
      level,
      include_inactive: includeInactive,
      include_completed: includeCompleted
    })
      .then((res) => setOredrives(res.data || []))
      .catch((err) => console.error('Failed to fetch oredrives', err));

    setOredrive('');
    setRing('');
  }, [level, includeInactive, includeCompleted]);

  useEffect(() => {
    if (!oredrive) return;

    fetcherPost('/prod-actual/ring-editor/rings/', {
      level,
      oredrive,
      include_inactive: includeInactive,
      include_completed: includeCompleted
    })
      .then((res) => setRings(res.data || []))
      .catch((err) => console.error('Failed to fetch rings', err));

    setRing('');
  }, [oredrive, includeInactive, includeCompleted]);

  const canSubmit = Boolean(level && oredrive && ring);

  const handleSubmit = () => {
    const selectedRing = rings.find((r) => r.ring_number_txt === ring);
    if (!selectedRing) return;
    navigate(`/prod-eng/ring-editor/${selectedRing.location_id}`);
  };

  return (
    <Grid2 container key={location.pathname}>
      <Grid2 size={{ xs: 12, lg: 3 }}>
        <MainCard title="Edit Ring">
          <Box display="flex" flexDirection="column" gap={2}>
            <FormControlLabel
              control={<Switch checked={includeInactive} onChange={(e) => setIncludeInactive(e.target.checked)} />}
              label="Include deactivated rings"
            />

            <FormControlLabel
              control={<Switch checked={includeCompleted} onChange={(e) => setIncludeCompleted(e.target.checked)} />}
              label="Include completed rings"
            />

            <FormControl fullWidth>
              <InputLabel>Level</InputLabel>
              <Select value={level} onChange={(e) => setLevel(e.target.value)} label="Level">
                {levels.map((lvl) => (
                  <MenuItem key={lvl} value={lvl}>
                    {lvl}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={!level}>
              <InputLabel>Oredrive</InputLabel>
              <Select value={oredrive} onChange={(e) => setOredrive(e.target.value)} label="Oredrive">
                {oredrives.map((od) => (
                  <MenuItem key={od} value={od}>
                    {od}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={!oredrive}>
              <InputLabel>Ring</InputLabel>
              <Select value={ring} onChange={(e) => setRing(e.target.value)} label="Ring">
                {rings.map((r) => (
                  <MenuItem key={r.location_id} value={r.ring_number_txt}>
                    {r.ring_number_txt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="contained" disabled={!canSubmit} onClick={handleSubmit}>
              Edit Ring
            </Button>
          </Box>
        </MainCard>
      </Grid2>
    </Grid2>
  );
}
