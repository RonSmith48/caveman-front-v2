import React, { useState } from 'react';
// material-ui
import {
  Grid,
  Alert,
  AlertTitle,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
  Typography
} from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { WarningFilled } from '@ant-design/icons';

// ==============================|| PLUGINS - DROPZONE ||============================== //

const DupeFileDateAlert = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleLearnMoreClick = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid>
          <Alert color="warning" variant="border" icon={<WarningFilled />}>
            <AlertTitle variant="h5">SET THE DUPE FILE DATE FIRST</AlertTitle>

            <Typography variant="body1" component="div">
              As soon as you drop the Dupe.csv file, it will upload using the{' '}
              <Typography variant="h5" component="span">
                Dupe File Date
              </Typography>{' '}
              as the reference date.
            </Typography>

            <Typography variant="body1" component="div" sx={{ mt: 2 }}>
              <Link href="#" onClick={() => handleLearnMoreClick('paper')} sx={{ mr: 1, ml: 1 }}>
                Learn more
              </Link>
            </Typography>
          </Alert>
        </Grid>
        <Grid>
          <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
          >
            <Grid container spacing={2} justifyContent="space-between" alignItems="center">
              <Grid item>
                <DialogTitle>PMD Dupe Dropzone</DialogTitle>
              </Grid>
              <Grid item sx={{ mr: 1.5 }}>
                <IconButton color="secondary" onClick={handleCloseDialog}>
                  <CloseOutlined />
                </IconButton>
              </Grid>
            </Grid>
            <DialogContent dividers>
              <DialogContentText>What it does and how it works goes here.</DialogContentText>
            </DialogContent>
          </Dialog>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DupeFileDateAlert;
