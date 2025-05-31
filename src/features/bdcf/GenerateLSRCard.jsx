import { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Checkbox, FormControlLabel } from '@mui/material';
import { fetcher } from 'utils/axios';
import { enqueueSnackbar } from 'notistack';

function GenerateLSRCard() {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // List of items to display - replace these with actual checklist items
  const checklistItems = [
    'Verify data completeness',
    'Confirm field validation',
    'Check layout alignment',
    'Ensure all calculations are correct'
  ];

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      // Transmit draft status: if not confirmed, draft=true; if confirmed, draft=false
      const draftParam = !confirmed;
      const endpoint = `report/prod/level-status/create/?draft=${draftParam}`;
      const response = await fetcher(endpoint);

      if (response?.data?.msg) {
        enqueueSnackbar(response.data.msg.body, { variant: response.data.msg.type });
      } else {
        const successMessage = draftParam ? 'Draft report created' : 'Final report created successfully';
        enqueueSnackbar(successMessage, { variant: 'success' });
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
        height: 300,
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
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
      />
      <CardContent sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Typography variant="h6" gutterBottom align="center">
          Generate Level Status Report
        </Typography>

        <Box component="ul" sx={{ listStyleType: 'disc', pl: 4, mb: 2 }}>
          {checklistItems.map((item, index) => (
            <Typography component="li" key={index} sx={{ mb: 1 }}>
              {item}
            </Typography>
          ))}
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              sx={{ color: 'white', '&.Mui-checked': { color: 'lightgreen' } }}
            />
          }
          label={<Typography sx={{ color: 'white' }}>I confirm all items have been checked</Typography>}
        />

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="contained" onClick={handleGenerateReport} disabled={loading}>
            {loading ? 'Processing...' : confirmed ? 'Generate Final Report' : 'Generate Draft Report'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default GenerateLSRCard;
