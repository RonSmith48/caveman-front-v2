'use client';
import { useState, useEffect } from 'react';

// material UI
import {
  Card,
  CardContent,
  Chip,
  Box,
  Divider,
  Paper,
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
import { ReportPDF } from 'features/bdcf/pdf/DCFPDF';

import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// project
import { fetcherPost } from 'utils/axiosBack';

// third party
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';

function DCFWidget() {
  const [loading, setLoading] = useState(false);
  const [DCFRings, setDCFRings] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null); // Menu anchor state

  const yesterday = dayjs().subtract(1, 'day');

  const formik = useFormik({
    initialValues: {
      pickerDate: yesterday
    },
    onSubmit: (values) => {
      fetchDCFdata(values.pickerDate);
    }
  });

  // Fetch on load
  useEffect(() => {
    fetchDCFdata(yesterday);
  }, []);

  const fetchDCFdata = async (date) => {
    try {
      setLoading(true);
      const formattedDate = date.format('YYYY-MM-DD');
      const response = await fetcherPost('api/report/prod/dcf/', {
        date: formattedDate
      });
      setDCFRings(response.data || []);
    } catch (error) {
      enqueueSnackbar('Error fetching fired rings', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePDFDownload = () => {
    const blob = pdf(<ReportPDF data={DCFRings} date={formik.values.pickerDate} />).toBlob();
    blob.then((b) => {
      const url = URL.createObjectURL(b);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DCF Report ${formik.values.pickerDate.format('YYYYMMDD')}.pdf`;
      link.click();
    });
  };

  const handlePrint = async () => {
    const blob = await pdf(<ReportPDF data={DCFRings} date={formik.values.pickerDate} />).toBlob();
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
    const csv = [['Ring', 'Shift', 'Status'], ...DCFRings.map((r) => [r.alias, r.shift, r.activity])];
    const csvContent = `data:text/csv;charset=utf-8,${csv.map((e) => e.join(',')).join('\n')}`;
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `DCF Report ${formik.values.pickerDate.format('YYYYMMDD')}.csv`);
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
        <Typography variant="h5">DCF Report</Typography>
        {/* Title + Date Picker */}
        <Box sx={{ display: 'flex', alignItems: 'right', gap: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Date"
              format="DD/MM/YYYY"
              disableFuture
              value={formik.values.pickerDate}
              onChange={(date) => {
                formik.setFieldValue('pickerDate', date);
                fetchDCFdata(date);
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
                disabled={DCFRings.length === 0}
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
        ) : DCFRings.length ? (
          <TableContainer>
            <Table size="small" sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Ring</TableCell>
                  <TableCell>Shift</TableCell>
                  <TableCell sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {DCFRings.map((ring, idx) => {
                  let chipColor;
                  switch (ring.activity) {
                    case 'Drilled':
                      chipColor = 'warning';
                      break;
                    case 'Charged':
                      chipColor = 'success';
                      break;
                    case 'Fired':
                      chipColor = 'secondary';
                      break;
                    default:
                      chipColor = 'default';
                  }

                  return (
                    <TableRow key={idx}>
                      <TableCell>{ring.alias}</TableCell>
                      <TableCell>{ring.shift}</TableCell>
                      <TableCell sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Chip label={ring.activity} color={chipColor} size="small" />
                      </TableCell>
                    </TableRow>
                  );
                })}
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

export default DCFWidget;
