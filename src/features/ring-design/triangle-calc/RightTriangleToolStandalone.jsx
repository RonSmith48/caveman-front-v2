import React from 'react';
import { Box } from '@mui/material';
import MainCard from 'components/MainCard';
import RightTriangleCalc from './RightTriangleCalc';

export default function RightTriangleToolStandalone() {
  return (
    <Box p={2}>
      <MainCard title="Right Triangle Calculator" sx={{ maxWidth: 500, margin: '0 auto' }}>
        <RightTriangleCalc />
      </MainCard>
    </Box>
  );
}
