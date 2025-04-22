import { Box, Typography } from '@mui/material';

export default function RingPlot({ holeData }) {
  const hasHoleData = Array.isArray(holeData) && holeData.length > 0;

  if (!hasHoleData) {
    return (
      <Box
        sx={{
          height: 400,
          backgroundColor: '#f3f3f3',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No hole data available for this ring.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 400, backgroundColor: '#fff', borderRadius: 2 }}>
      {/* Render actual ring data using Konva or other components here */}
      <Typography variant="body2" sx={{ p: 2 }}>
        [Ring plot goes here]
      </Typography>
    </Box>
  );
}
