import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Box, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Alert } from '@mui/material';
import { CheckCircleOutline, CancelOutlined } from '@mui/icons-material';
import PlaceholderContent from 'components/third-party/dropzone/PlaceholderContent';
import { fetcherPost } from 'utils/axios';
import { enqueueSnackbar } from 'notistack';

const ringDataHeaders = [
  'Ring',
  'Dump',
  'Azimuth',
  'BurdenValue',
  'Holes',
  'Diameters',
  'Total Drill',
  'LookDirection',
  'Configuration',
  'Rig',
  'AVG_BROW_X',
  'AVG_BROW_Y',
  'AVG_BROW_Z',
  'BlastSolidsVolume',
  'draw'
];
const holeDataHeaders = [
  'RingID',
  'HoleID',
  'Length',
  'Total Length',
  'Dip',
  'Dump',
  'BT',
  'Uphole',
  'Offset',
  'CollarOffset',
  'CollarOffset Vertical',
  'Diameter',
  'CollarX',
  'CollarY',
  'CollarZ',
  'ToeX',
  'ToeY',
  'ToeZ',
  'Pivot',
  'PivotHeight',
  'PivotHeightVertical',
  'NoOfRods',
  'NoOfRodsReal',
  'TrueAzimuth',
  'TrueDip',
  'Offset to left wall',
  'Offset to right wall',
  'Distance to left wall marker',
  'Distance to right wall marker',
  'Dump direction',
  'Distance from left wall to pivot',
  'Distance from right wall to pivot',
  'Toe space to next',
  'Toe space to previous',
  'Length from pivot to toe'
];

const isColumnEmpty = (columnValues) => columnValues.every((val) => val === '' || val === null || val === undefined);

export default function RingDesignDrop() {
  const [files, setFiles] = useState([]);
  const [headerChecklist, setHeaderChecklist] = useState({ survey: {}, holes: {} });
  const [errorMsg, setErrorMsg] = useState('');
  const [startRing, setStartRing] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [namedFiles, setNamedFiles] = useState({ ringFile: null, holeFile: null });

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length !== 2) {
      setErrorMsg('Ring Data and Hole Data files must be uploaded together.');
      setIsValid(false);
      return;
    }

    setErrorMsg('');
    setFiles(acceptedFiles);

    let surveyRingFile = null;
    let holeFile = null;
    const startingRings = [];

    let completed = 0;

    acceptedFiles.forEach((file) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const rows = result.data;
          const headers = result.meta.fields || [];

          const ringCol = headers.find((h) => h.toLowerCase().includes('ring'));
          const firstRingValue = rows[0]?.[ringCol]?.toString().trim();
          if (firstRingValue) startingRings.push(firstRingValue);

          const headersWithValues = headers.filter((header) => {
            const values = rows.map((row) => row[header]?.toString().trim());
            return !isColumnEmpty(values);
          });

          const isHoleFile = headersWithValues.includes('HoleID');

          if (isHoleFile) {
            holeFile = { file, headers: headersWithValues, rows };
          } else {
            surveyRingFile = { file, headers: headersWithValues, rows };
          }

          completed += 1;

          if (completed === 2) {
            if (startingRings.length !== 2 || startingRings[0] !== startingRings[1]) {
              setErrorMsg(`Both files must start with the same ring number. Detected: ${startingRings.join(', ')}`);
              setIsValid(false);
              return;
            }

            setNamedFiles({
              ringFile: surveyRingFile?.file || null,
              holeFile: holeFile?.file || null
            });

            const surveyChecklist = {};
            ringDataHeaders.forEach((h) => {
              surveyChecklist[h] = surveyRingFile?.headers.includes(h);
            });

            const holeChecklist = {};
            holeDataHeaders.forEach((h) => {
              holeChecklist[h] = holeFile?.headers.includes(h);
            });

            const allSurveyValid = Object.values(surveyChecklist).every(Boolean);
            const allHoleValid = Object.values(holeChecklist).every(Boolean);

            setHeaderChecklist({ survey: surveyChecklist, holes: holeChecklist });
            setStartRing(startingRings[0]);
            setIsValid(allSurveyValid && allHoleValid);
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
    accept: { 'text/csv': ['.csv'] },
    multiple: true,
    onDrop
  });

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('ring_file', namedFiles.ringFile);
    formData.append('hole_file', namedFiles.holeFile);

    try {
      const response = await fetcherPost('/prod-actual/drill-blast/design-upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      enqueueSnackbar(response.data.msg.body, { variant: response.data.msg.type });
      // Optionally show a success message or reset the state
    } catch (error) {
      console.error('Upload failed:', error);
      setErrorMsg('Upload failed. Please try again.');
    }
    setFiles([]);
    setHeaderChecklist({ survey: {}, holes: {} });
    setIsValid(false);
    setStartRing(null);
  };

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #888',
          p: 1,
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

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}

      {(Object.keys(headerChecklist.survey).length > 0 || Object.keys(headerChecklist.holes).length > 0) && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h5" gutterBottom>
            Required Headers Checklist
          </Typography>

          <Box display="flex" gap={2} flexWrap="wrap">
            {/* Ring Data Table */}
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="subtitle1" gutterBottom>
                <b>Ring Data File</b>
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '80%' }}>
                      <b>Header</b>
                    </TableCell>
                    <TableCell sx={{ width: '20%' }} align="center">
                      <b>Status</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ringDataHeaders.map((header) => (
                    <TableRow key={header}>
                      <TableCell>{header}</TableCell>
                      <TableCell align="center">
                        {headerChecklist.survey[header] ? <CheckCircleOutline color="success" /> : <CancelOutlined color="error" />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            {/* Hole Data Table */}
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="subtitle1" gutterBottom>
                <b>Hole Data File</b>
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '80%' }}>
                      <b>Header</b>
                    </TableCell>
                    <TableCell sx={{ width: '20%' }} align="center">
                      <b>Status</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {holeDataHeaders.map((header) => (
                    <TableRow key={header}>
                      <TableCell>{header}</TableCell>
                      <TableCell align="center">
                        {headerChecklist.holes[header] ? <CheckCircleOutline color="success" /> : <CancelOutlined color="error" />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Paper>
      )}

      <Button variant="contained" disabled={!isValid} onClick={handleSubmit}>
        Submit Ring Design
      </Button>
    </Box>
  );
}
