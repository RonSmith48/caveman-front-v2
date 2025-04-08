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

// project imports
import MainCard from 'components/MainCard';
import ConceptRingDrop from 'features/prod-concept/ConceptRingDrop';
import ConceptCSVHeadersForm from 'features/prod-concept/ConceptCSVHeadersForm';

// ==============================|| PLUGINS - DROPZONE ||============================== //

const ConceptUpload = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleLearnMoreClick = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <Typography variant="h4">Concept Ring Upload</Typography>
        <br />
        <MainCard>
          <ConceptRingDrop />
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={8}>
        <Grid>
          <Alert color="warning" variant="border" icon={<WarningFilled />}>
            <AlertTitle variant="h5">ABOUT YOUR FLOW MODEL LINK FILE</AlertTitle>
            Your file must be of CSV type and requires the headers named exactly to work. Your file may contain other headers, but they will
            be ignored.
            <Link href="#" onClick={() => handleLearnMoreClick('paper')} sx={{ mr: 1, ml: 1, mb: 1, mt: 1 }}>
              Learn more
            </Link>
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
                <DialogTitle>Flow Model Link File Dropzone</DialogTitle>
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
        <Grid item sx={{ mt: 2 }}>
          <ConceptCSVHeadersForm />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ConceptUpload;
