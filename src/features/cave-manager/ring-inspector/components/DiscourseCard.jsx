import React from 'react';
import { useFormikContext, Field } from 'formik';
import { Box, Card, CardContent, FormControlLabel, TextField, Typography, Divider, Grid2, Stack, Switch } from '@mui/material';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import IconButton from '@mui/material/IconButton';
import StatusSection from './StatusSection';
import ParentChooserModal from 'features/konva/ParentChooserModal';

export default function DiscourseCard({ isEditable }) {
  // grab whatever you need from Formik
  const { values } = useFormikContext();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" sx={{ mt: 1 }}>
          Discourse
        </Typography>
        <Divider sx={{ mb: 1, borderColor: 'error.main' }} />
        <Grid2 container spacing={1} sx={{ mb: 1 }}>
          <Grid2 size={{ xs: 9 }}>
            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
              People are discussing this location, join the discussion.
            </Typography>
          </Grid2>

          <Grid2 size={{ xs: 3 }}>
            <IconButton aria-label="comments" color="primary" disabled={!values.is_active}>
              <QuestionAnswerOutlinedIcon />
            </IconButton>
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
}
