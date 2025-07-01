// File: components/StatusSection.jsx
import React, { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { Grid2, Typography, Box, Slider } from '@mui/material';
import { statuses, marks } from '../cardConfig';

export default function StatusSection({ isEditable }) {
  const { values, setFieldValue } = useFormikContext();
  const statusIndex = statuses.includes(values.status) ? statuses.indexOf(values.status) : 0;

  const [sliderVal, setSliderVal] = useState(statusIndex);
  useEffect(() => setSliderVal(statusIndex), [statusIndex]);
  console.log('editable', isEditable);

  return (
    <Grid2 container direction="column" spacing={1} sx={{ mb: 2 }}>
      {/* Row 1: label & value */}
      <Grid2 container alignItems="center" spacing={1} item>
        <Grid2 item>
          <Typography variant="subtitle2">Status</Typography>
        </Grid2>
        <Grid2 item>
          <Typography variant="body1" color="primary">
            {values.status}
          </Typography>
        </Grid2>
      </Grid2>

      {/* Row 2: the slider */}
      <Grid2 size={{ xs: 12 }} sx={{ px: 4 }}>
        <Slider
          value={sliderVal}
          min={0}
          max={statuses.length - 1}
          step={1}
          marks={marks}
          disabled={!isEditable}
          valueLabelDisplay="off"
          valueLabelFormat={(v) => statuses[v]}
          onChange={(_, v) => typeof v === 'number' && setSliderVal(v)}
          onChangeCommitted={(_, v) => typeof v === 'number' && setFieldValue('status', statuses[v])}
        />
      </Grid2>
    </Grid2>
  );
}
