import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Box, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Alert } from '@mui/material';
import { CheckCircleOutline, CancelOutlined } from '@mui/icons-material';
import PlaceholderContent from 'components/third-party/dropzone/PlaceholderContent';

// Hardcoded required headers
const requiredHeaders = [
  'Ring',
  'Azimuth',
  'Dump',
  'BurdenValue',
  'Holes',
  'HoleID', // only required in holes file
  'Hole Depth',
  'Hole Angle'
];

const isColumnEmpty = (columnValues) => columnValues.every((val) => val === '' || val === null || val === undefined);

export default function RingDesignDrop() {
  const [files, setFiles] = useState([]);
  const [headersFound, setHeadersFound] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [startRing, setStartRing] = useState(null);
  const [isValid, setIsValid] = useState(false);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length < 2 || acceptedFiles.length > 3) {
      setErrorMsg('Please upload between 2 and 3 CSV files.');
      return;
    }

    setErrorMsg('');
    setFiles(acceptedFiles);
    const headersMap = {};
    const startingRings = new Set();
    let allHeadersWithValues = new Set();

    let completed = 0;

    acceptedFiles.forEach((file) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const rows = result.data;
          const headers = result.meta.fields || [];

          // Detect start ring
          const ringCol = headers.find((h) => h.toLowerCase().includes('ring'));
          const firstRingValue = rows[0]?.[ringCol]?.toString().trim();
          if (firstRingValue) startingRings.add(firstRingValue);

          // Only include headers with at least 1 value
          headers.forEach((header) => {
            const values = rows.map((row) => row[header]?.toString().trim());
            if (!isColumnEmpty(values)) {
              allHeadersWithValues.add(header);
            }
          });

          completed += 1;

          if (completed === acceptedFiles.length) {
            // Check all files start with same ring
            if (startingRings.size > 1) {
              setErrorMsg(`All files must start with the same ring number. Detected: ${[...startingRings].join(', ')}`);
              setIsValid(false);
              return;
            }

            const holesFileDetected = [...allHeadersWithValues].includes('HoleID');

            // Mark headers as found/missing
            const results = {};
            requiredHeaders.forEach((h) => {
              if (h === 'HoleID' || h === 'Hole Depth' || h === 'Hole Angle') {
                results[h] = holesFileDetected && allHeadersWithValues.has(h);
              } else {
                results[h] = allHeadersWithValues.has(h);
              }
            });

            const allGood = Object.values(results).every(Boolean);
            setStartRing([...startingRings][0]);
            setHeadersFound(results);
            setIsValid(allGood);
          }
        },
        error: (err) => {
          console.error('CSV parse error:', err);
          setErrorMsg('Error reading one of the CSV files.');
          setIsValid(false);
        }
      });
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/csv': ['.csv']
    },
    multiple: true,
    onDrop
  });

  const handleSubmit = () => {
    alert('Ready to submit! (hook up your API here)');
  };

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #888',
          p: 4,
          textAlign: 'center',
          bgcolor: '#f5f5f5',
          mb: 2,
          cursor: 'pointer'
        }}
      >
        <input {...getInputProps()} />
        <Typography>
          <PlaceholderContent />
        </Typography>
      </Box>

      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      {Object.keys(headersFound).length > 0 && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Required Headers Checklist (Ring {startRing})
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Header</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requiredHeaders.map((header) => (
                <TableRow key={header}>
                  <TableCell>{header}</TableCell>
                  <TableCell>{headersFound[header] ? <CheckCircleOutline color="success" /> : <CancelOutlined color="error" />}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Button variant="contained" disabled={!isValid} onClick={handleSubmit}>
        Submit Ring Design
      </Button>
    </Box>
  );
}
