import React, { useMemo, useState } from 'react';
import { Box, Card, CardHeader, CardContent, Grid, TextField, Button, Stack, Alert, Typography, Divider } from '@mui/material';

// Inputs: legs a, b; hypotenuse c; acute angles A, B (degrees). Angle C is fixed at 90°.

export default function RightTriangleCalc() {
  const [inputs, setInputs] = useState({ sideA: '', sideB: '', sideC: '', angleA: '', angleB: '' });
  const [errors, setErrors] = useState([]);

  // Helpers
  const toNum = (v) => {
    const n = parseFloat((v ?? '').toString());
    return Number.isFinite(n) ? n : 0;
  };
  const rad = (deg) => (Math.PI * deg) / 180;
  const deg = (radVal) => (180 * radVal) / Math.PI;
  const fmt = (n) => (Number.isFinite(n) ? +n.toFixed(6) : '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    // allow only digits and a single decimal point; disallow negatives
    const safe = value.replace(/[^0-9.]/g, '');
    setInputs((s) => ({ ...s, [name]: safe }));
  };

  const reset = () => {
    setInputs({ sideA: '', sideB: '', sideC: '', angleA: '', angleB: '' });
    setErrors([]);
  };

  const calculate = () => {
    const errs = [];

    let a = toNum(inputs.sideA);
    let b = toNum(inputs.sideB);
    let c = toNum(inputs.sideC);
    let A = toNum(inputs.angleA);
    let B = toNum(inputs.angleB);

    const has = { a: a > 0, b: b > 0, c: c > 0, A: A > 0, B: B > 0 };

    // Angle cross-check
    if (has.A && has.B && Math.abs(A + B - 90) > 1e-9) {
      errs.push('Two angles are provided but do not add up to 90°. Provide one acute angle, or ensure A + B = 90°.');
    }

    // Side cross-check
    if (has.a && has.b && has.c) {
      if (Math.abs(c - Math.sqrt(a * a + b * b)) > 1e-9) {
        errs.push('Three sides were provided, but they do not form a right triangle (c² ≠ a² + b²).');
      }
    }

    if (errs.length) {
      setErrors(errs);
      return;
    }

    // Solve angles if needed
    if (has.A) {
      B = 90 - A;
    } else if (has.B) {
      A = 90 - B;
    } else if (has.a && has.b) {
      A = deg(Math.atan(a / b));
      B = deg(Math.atan(b / a));
    } else if (has.a && has.c) {
      A = deg(Math.asin(a / c));
      B = deg(Math.acos(a / c));
    } else if (has.b && has.c) {
      A = deg(Math.acos(b / c));
      B = deg(Math.asin(b / c));
    }

    const gotAngles = A > 0 && B > 0 && Math.abs(A + B - 90) < 1e-6;
    if (!gotAngles) {
      setErrors(['Not enough information. Enter at least one side and one acute angle, or any two sides.']);
      return;
    }

    // Solve sides
    if (has.a) {
      b = a / Math.tan(rad(A)); // tan A = a/b  -> b = a / tan A
      c = a / Math.sin(rad(A)); // sin A = a/c  -> c = a / sin A
    } else if (has.b) {
      a = b / Math.tan(rad(B)); // tan B = b/a  -> a = b / tan B
      c = b / Math.sin(rad(B)); // sin B = b/c  -> c = b / sin B
    } else if (has.c) {
      a = c * Math.sin(rad(A)); // sin A = a/c  -> a = c sin A
      b = c * Math.cos(rad(A)); // cos A = b/c  -> b = c cos A
    }

    if (!(a > 0 && b > 0 && c > 0)) {
      setErrors(['Not enough information. Enter at least one side and one acute angle, or any two sides.']);
      return;
    }

    setErrors([]);
    setInputs({
      sideA: String(fmt(a)),
      sideB: String(fmt(b)),
      sideC: String(fmt(c)),
      angleA: String(fmt(A)),
      angleB: String(fmt(B))
    });
  };

  const filled = useMemo(() => {
    return (
      Number(inputs.sideA) > 0 ||
      Number(inputs.sideB) > 0 ||
      Number(inputs.sideC) > 0 ||
      Number(inputs.angleA) > 0 ||
      Number(inputs.angleB) > 0
    );
  }, [inputs]);

  return (
    <>
      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Stack spacing={0.75}>
            {errors.map((e, i) => (
              <span key={i}>{e}</span>
            ))}
          </Stack>
        </Alert>
      )}
      <Typography variant="body" color="text.secondary" sx={{ mb: 1 }}>
        Provide any two values (two sides, or one side + one acute angle). Angle C is fixed at 90°.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Box
          component="img"
          src="/images/graphics/triangle-right.jpg"
          alt="Right triangle diagram"
          sx={{ maxWidth: '100%', height: 'auto' }}
        />
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="angle A"
            name="angleA"
            value={inputs.angleA}
            onChange={handleChange}
            type="number"
            inputProps={{ step: 'any', min: 0, max: 90 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="angle B"
            name="angleB"
            value={inputs.angleB}
            onChange={handleChange}
            type="number"
            inputProps={{ step: 'any', min: 0, max: 90 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="side a"
            name="sideA"
            value={inputs.sideA}
            onChange={handleChange}
            type="number"
            inputProps={{ step: 'any', min: 0 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="side b"
            name="sideB"
            value={inputs.sideB}
            onChange={handleChange}
            type="number"
            inputProps={{ step: 'any', min: 0 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="side c"
            name="sideC"
            value={inputs.sideC}
            onChange={handleChange}
            type="number"
            inputProps={{ step: 'any', min: 0 }}
          />
        </Grid>
      </Grid>

      <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
        <Button variant="contained" onClick={calculate}>
          Calculate
        </Button>
        <Button variant="outlined" onClick={reset} disabled={!filled}>
          Reset
        </Button>
      </Stack>
    </>
  );
}
