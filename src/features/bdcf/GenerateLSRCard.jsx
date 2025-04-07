import { useState } from 'react';
import { Box, Card, CardContent, Grid, Button, Typography } from '@mui/material';
import { fetcher } from 'utils/axios';
import { enqueueSnackbar } from 'notistack';
function GenerateLSRCard() {
  const [loading, setLoading] = useState(false);

  const handleLevelStatusReport = async () => {
    try {
      setLoading(true);
      const response = await fetcher('report/prod/level-status/create/');

      if (response?.data?.msg) {
        enqueueSnackbar(response.data.msg.body, { variant: response.data.msg.type });
      } else {
        enqueueSnackbar('Report created successfully', { variant: 'success' });
      }
    } catch (error) {
      console.error('Error creating Level Status Report:', error);
      enqueueSnackbar('Error creating Level Status Report', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        position: 'relative',
        height: 200,
        backgroundImage: 'url(/images/backgrounds/toy_loader1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        boxShadow: 3,
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)' // Optional dark overlay for text contrast
        }}
      />
      <CardContent sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Generate Level Status Report
        </Typography>
        <Button variant="contained" onClick={handleLevelStatusReport} disabled={loading}>
          {loading ? 'Processing...' : 'Process'}
        </Button>
      </CardContent>
    </Card>
  );
}
export default GenerateLSRCard;
