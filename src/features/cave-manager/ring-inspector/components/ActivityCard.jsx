// File: components/ActivityCard.jsx
import React from 'react';
import { useFormikContext, Field } from 'formik';
import { Card, CardContent, TextField, Typography, Divider, Grid2, Button } from '@mui/material';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import IconButton from '@mui/material/IconButton';
import StatusSection from './StatusSection';

export default function ActivityCard({ isEditable }) {
  // grab whatever you need from Formik
  const { values, setFieldValue } = useFormikContext();

  const isDesignedOrDrilled = ['Designed', 'Drilled'].includes(values.status);
  const isAbandoned = values.status === 'Abandoned';
  const handleAbandon = () => {
    setFieldValue('status', 'Abandoned');
    setFieldValue('is_active', false);
  };

  const handleResume = () => {
    const resumedStatus = values.drilling_complete_shift ? 'Drilled' : 'Designed';
    setFieldValue('status', resumedStatus);
    setFieldValue('is_active', true);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5">Activity</Typography>
        <Divider sx={{ mb: 1, borderColor: 'primary.main' }} />

        <Grid2 container spacing={1} sx={{ mb: 1 }}>
          <Grid2 size={{ xs: 12 }}>
            {/* always show status slider, but disable it if not editable */}
            <StatusSection isEditable={isEditable} />
          </Grid2>
        </Grid2>

        {isDesignedOrDrilled && isEditable && (
          <Grid2 container spacing={1} sx={{ mb: 1 }}>
            <Grid2 xs={12}>
              <Button variant="outlined" color="error" onClick={handleAbandon}>
                Abandon Ring
              </Button>
            </Grid2>
          </Grid2>
        )}

        {/* Resume button when Abandoned */}
        {isAbandoned && (
          <Grid2 container spacing={1} sx={{ mb: 1 }}>
            <Grid2 xs={12}>
              <Button variant="outlined" color="success" disabled={!isEditable} onClick={handleResume}>
                Resume Ring
              </Button>
            </Grid2>
          </Grid2>
        )}

        <Grid2 container spacing={1} sx={{ mb: 1 }}>
          <Grid2 size={{ xs: 12 }}>
            <Typography variant="subtitle2">Bogging comment (as seen on Level Status Report)</Typography>
            <Field name="comment" as={TextField} fullWidth disabled={!values.is_active || !isEditable} />
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
}
