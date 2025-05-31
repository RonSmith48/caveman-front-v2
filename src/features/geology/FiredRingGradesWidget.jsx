import { useState, useEffect } from 'react';

// material UI
import {
  Card,
  CardContent,
  Box,
  Divider,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import PrintIcon from '@mui/icons-material/Print';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { ReportPDF } from 'features/geology/pdf/FiredRingGradesPDF';

import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// project
import { fetcherPost } from 'utils/axios';

// third party
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';

function FiredRingGradesWidget() {
  const [loading, setLoading] = useState(false);
  const [firedRings, setFiredRings] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null); // Menu anchor state

  const yesterday = dayjs().subtract(1, 'day');

  const formik = useFormik({
    initialValues: {
      pickerDate: yesterday
    },
    onSubmit: (values) => {
      fetchFiredRings(values.pickerDate);
    }
  });

  // Fetch on load
  useEffect(() => {
    fetchFiredRings(yesterday);
  }, []);

  const fetchFiredRings = async (date) => {
    try {
      setLoading(true);
      const formattedDate = date.format('YYYY-MM-DD');
      const response = await fetcherPost('report/geo/fired-ring-grade/', {
        date: formattedDate
      });
      setFiredRings(response.data || []);
    } catch (error) {
      enqueueSnackbar('Error fetching fired rings', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePDFDownload = () => {
    const blob = pdf(<ReportPDF data={firedRings} date={formik.values.pickerDate} />).toBlob();
    blob.then((b) => {
      const url = URL.createObjectURL(b);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Grade Report ${formik.values.pickerDate.format('YYYYMMDD')}.pdf`;
      link.click();
    });
  };

  const handlePrint = async () => {
    const blob = await pdf(<ReportPDF data={firedRings} date={formik.values.pickerDate} />).toBlob();
    const blobUrl = URL.createObjectURL(blob);
    const printWindow = window.open(blobUrl);
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    }
  };

  const handleCSVDownload = () => {
    const csv = [
      ['Ring', 'Shift', 'Copper (%)', 'Gold (g/t)', 'Density'],
      ...firedRings.map((r) => [r.alias, r.shift, r.copper.toFixed(3), r.gold.toFixed(3), r.density.toFixed(3)])
    ];
    const csvContent = `data:text/csv;charset=utf-8,${csv.map((e) => e.join(',')).join('\n')}`;
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `Grade Report ${formik.values.pickerDate.format('YYYYMMDD')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadActions = [
    { icon: <PrintIcon />, name: 'Print', onClick: handlePrint },
    { icon: <PictureAsPdfIcon />, name: 'PDF', onClick: handlePDFDownload },
    { icon: <TableChartIcon />, name: 'CSV', onClick: handleCSVDownload }
  ];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card elevation={1}>
      {/* Top Bar: Title + Picker + Menu */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          pt: 2
        }}
      >
        <Typography variant="h5">Fired Ring Grade Report</Typography>
        {/* Title + Date Picker */}
        <Box sx={{ display: 'flex', alignItems: 'right', gap: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Firing Date"
              format="DD/MM/YYYY"
              disableFuture
              value={formik.values.pickerDate}
              onChange={(date) => {
                formik.setFieldValue('pickerDate', date);
                fetchFiredRings(date);
              }}
              slotProps={{
                textField: {
                  sx: { width: '10rem' }
                }
              }}
            />
          </LocalizationProvider>

          {/* Menu Button with 3 Vertical Dots */}
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            {downloadActions.map((action) => (
              <MenuItem
                key={action.name}
                onClick={() => {
                  action.onClick();
                  handleMenuClose();
                }}
                disabled={firedRings.length === 0}
              >
                {action.icon}
                <Typography sx={{ ml: 1 }}>{action.name}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      {/* Divider under header */}
      <Divider sx={{ mt: 2 }} />

      {/* Main Content */}
      <CardContent sx={{ px: 0, pt: 1, pb: 0 }}>
        {loading ? (
          <Typography sx={{ px: 2 }}>Loading...</Typography>
        ) : firedRings.length ? (
          <TableContainer>
            <Table size="small" sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Ring</TableCell>
                  <TableCell>Shift</TableCell>
                  <TableCell>Copper (%)</TableCell>
                  <TableCell>Gold (g/t)</TableCell>
                  <TableCell>Density</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {firedRings.map((ring, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{ring.alias}</TableCell>
                    <TableCell>{ring.shift}</TableCell>
                    <TableCell>{parseFloat(ring.copper).toFixed(3)}</TableCell>
                    <TableCell>{parseFloat(ring.gold).toFixed(3)}</TableCell>
                    <TableCell>{parseFloat(ring.density).toFixed(3)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography sx={{ pt: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>No data</Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default FiredRingGradesWidget;
