import React from 'react';
import { useFormikContext, Field } from 'formik';
import { Box, Card, CardContent, FormControlLabel, TextField, Typography, Divider, Grid2, Stack, Switch } from '@mui/material';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import IconButton from '@mui/material/IconButton';
import StatusSection from './StatusSection';
import ParentChooserModal from 'features/konva/ParentChooserModal';

export default function GeotechCard({ isEditable }) {
  // grab whatever you need from Formik
  const { values, setFieldValue } = useFormikContext();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5">Geotechnical</Typography>
        <Divider sx={{ mb: 1, borderColor: '#000' }} />
        <Grid2 container spacing={2}>
          {isEditable ? (
            <Grid2 size={{ xs: 6, sm: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.cable_bolted || false}
                    onChange={(e) => setFieldValue('cable_bolted', e.target.checked)}
                    name="cable_bolted"
                    color="primary"
                    disabled={!values.is_active}
                  />
                }
                label="Cable Bolted"
              />
            </Grid2>
          ) : (
            <Grid2 size={{ xs: 4 }}>
              <Typography variant="subtitle2">Cable Bolted</Typography>
              <Typography variant="body1" color="textSecondary">
                {values.cable_bolted ? 'Yes' : 'No'}
              </Typography>
            </Grid2>
          )}
          {isEditable ? (
            <Grid2 size={{ xs: 6, sm: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.area_rehab || false}
                    onChange={(e) => setFieldValue('area_rehab', e.target.checked)}
                    name="area_rehab"
                    color="primary"
                    disabled={!values.is_active}
                  />
                }
                label="Area Rehab"
              />
            </Grid2>
          ) : (
            <Grid2 size={{ xs: 4 }}>
              <Typography variant="subtitle2">Area Rehab</Typography>
              <Typography variant="body1" color="textSecondary">
                {values.area_rehab ? 'Yes' : 'No'}
              </Typography>
            </Grid2>
          )}
          {isEditable ? (
            <Grid2 size={{ xs: 6, sm: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.fault || false}
                    onChange={(e) => setFieldValue('fault', e.target.checked)}
                    name="fault"
                    color="primary"
                    disabled={!values.is_active}
                  />
                }
                label="Fault"
              />
            </Grid2>
          ) : (
            <Grid2 size={{ xs: 4 }}>
              <Typography variant="subtitle2">Fault</Typography>
              <Typography variant="body1" color="textSecondary">
                {values.fault ? 'Yes' : 'No'}
              </Typography>
            </Grid2>
          )}
        </Grid2>
      </CardContent>
    </Card>
  );
}
