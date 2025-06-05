import { Box } from '@mui/material';

export default function SiteAdmin() {
  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <iframe
        src="http://localhost:8000/admin/" // replace with actual backend URL in prod
        title="Site Admin"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />
    </Box>
  );
}
