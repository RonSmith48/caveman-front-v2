import { Grid, Typography, Divider } from '@mui/material';

export default function DepartmentSection({ title, children }) {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Divider />
      </Grid>
      {children}
    </Grid>
  );
}
