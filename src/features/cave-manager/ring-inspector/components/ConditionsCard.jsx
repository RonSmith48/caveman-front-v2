import React from 'react';
import { useFormikContext, Field } from 'formik';
import { Box, Card, CardContent, FormControlLabel, TextField, Typography, Divider, Grid, Stack, Switch } from '@mui/material';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import IconButton from '@mui/material/IconButton';
import StatusSection from './StatusSection';
import ParentChooserModal from 'features/konva/ParentChooserModal';

export default function ConditionsCard({ isEditable }) {
  // grab whatever you need from Formik
  const { values } = useFormikContext();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>Conditions card</CardContent>
    </Card>
  );
}
