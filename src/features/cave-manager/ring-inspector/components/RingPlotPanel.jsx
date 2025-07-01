// File: components/RingPlotPanel.jsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import RingPlot from 'features/cave-manager/ring-inspector/components/RingPlot';

export default function RingPlotPanel({ holeData, azimuth }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Ring Plot</Typography>
        <RingPlot holeData={holeData} azimuth={azimuth} />
      </CardContent>
    </Card>
  );
}
