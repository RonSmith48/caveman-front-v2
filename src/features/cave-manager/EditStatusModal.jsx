import { useState } from 'react';
import {
  AppBar,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Toolbar,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Box,
  TextField
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useFormikContext } from 'formik';

const steps = [
  { label: 'Designed', field: 'design_date', dateLabel: 'Design Date' },
  { label: 'Drilled', field: 'drill_complete_shift', dateLabel: 'Drilling Complete Date' },
  { label: 'Charged', field: 'charge_shift', dateLabel: 'Charge Date' },
  { label: 'Bogging', field: 'bog_complete_shift', dateLabel: 'Bogging Complete Date' },
  { label: 'Complete', field: null, dateLabel: null }
];

export default function EditStatusModal() {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [originalStatus, setOriginalStatus] = useState('');
  const [abandoned, setAbandoned] = useState(false);
  const { values, setFieldValue, submitForm } = useFormikContext();

  const handleOpen = () => {
    const currIdx = steps.findIndex((s) => s.label === values.status);
    setActiveStep(currIdx >= 0 ? currIdx : 0);

    let orig = values.status;
    if (values.status === 'Abandoned') {
      const lastWithDate = steps
        .map((s, i) => ({ ...s, idx: i }))
        .filter((s) => s.field && !!values[s.field])
        .map((s) => s.idx)
        .pop();
      orig = lastWithDate != null ? steps[lastWithDate].label : 'Designed';
    }
    setOriginalStatus(orig);
    setAbandoned(values.status === 'Abandoned');
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const isStepDone = (idx) => {
    const field = steps[idx].field;
    return field ? !!values[field] : true;
  };

  const allDone = () => steps.every((_, i) => isStepDone(i));

  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const handleDateChange = (field) => (e) => {
    setFieldValue(field, e.target.value);
  };

  const handleSave = async () => {
    await setFieldValue('status', values.status);
    await submitForm();
    setOpen(false);
  };

  const handleRollback = () => {
    if (values.status === 'Designed') return;
    if (!window.confirm('Rolling back will delete this step and all later dates and cannot be undone. Continue?')) return;

    const curr = steps.findIndex((s) => s.label === values.status);
    steps.slice(curr).forEach((s) => {
      if (s.field) setFieldValue(s.field, '');
    });
    const prev = Math.max(0, curr - 1);
    setFieldValue('status', steps[prev].label);
    setActiveStep(prev);
    setOpen(false);
  };

  const toggleAbandon = () => {
    if (!abandoned) {
      if (!window.confirm('Are you sure you want to abandon this ring?')) return;
      setAbandoned(true);
      setFieldValue('status', 'Abandoned');
    } else {
      if (!window.confirm('Resume this ring?')) return;
      setAbandoned(false);
      setFieldValue('status', originalStatus);
    }
  };

  return (
    <>
      <Button variant="contained" disabled={!values.is_active} startIcon={<EditOutlinedIcon />} onClick={handleOpen}>
        Edit Status
      </Button>

      <Dialog fullScreen open={open} onClose={handleClose}>
        <AppBar position="relative">
          <Toolbar>
            <Typography variant="h6" sx={{ flex: 1 }}>
              Edit Status
            </Typography>
            <IconButton edge="end" color="inherit" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <DialogContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, idx) => (
              <Step key={step.label}>
                <StepLabel optional={isStepDone(idx) ? <Typography variant="caption">Done</Typography> : null}>{step.label}</StepLabel>
                <StepContent>
                  {step.field && (
                    <TextField
                      type="date"
                      label={step.dateLabel}
                      value={values[step.field] || ''}
                      onChange={handleDateChange(step.field)}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  )}
                  <Box sx={{ mb: 2 }}>
                    <Button disabled={idx === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                      Back
                    </Button>
                    {idx < steps.length - 1 && values.status !== 'Abandoned' && (
                      <Button variant="contained" onClick={handleNext} disabled={!isStepDone(idx)} sx={{ mt: 1 }}>
                        Continue
                      </Button>
                    )}
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleRollback} color="warning" disabled={values.status === 'Designed'}>
            Rollback Status
          </Button>

          {(activeStep <= 1 || abandoned) && (
            <Button variant={abandoned ? 'contained' : 'outlined'} color="error" onClick={toggleAbandon}>
              {abandoned ? 'Resume Ring' : 'Abandon Ring'}
            </Button>
          )}

          <Button onClick={handleSave} disabled={!allDone()} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
