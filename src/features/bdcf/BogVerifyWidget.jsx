'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Box,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
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
import { useTheme } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import PrintIcon from '@mui/icons-material/Print';
import { pdf } from '@react-pdf/renderer';
import { ReportPDF } from 'features/bdcf/pdf/BogVerifyPDF';

import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { fetcherPost } from 'utils/axiosBack';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';
import { useDebouncedCallback } from 'use-debounce';

function BogVerifyWidget() {
  const [loading, setLoading] = useState(false);
  const [bogTonnes, setBogTonnes] = useState({ results: [], total: 0 });
  const [anchorEl, setAnchorEl] = useState(null);

  const theme = useTheme();
  const yesterday = dayjs().subtract(1, 'day');

  const formik = useFormik({
    initialValues: {
      pickerDate: yesterday,
      shift: ''
    },
    onSubmit: () => {}
  });

  const fetchBogData = async (date, shift) => {
    try {
      setLoading(true);
      const formattedDate = date.format('YYYY-MM-DD');
      const response = await fetcherPost('report/prod/bog-verify/', {
        date: formattedDate,
        shift
      });
      setBogTonnes({
        results: response.data.results || [],
        total: response.data.total || 0
      });

      if (response.data?.msg?.body) {
        enqueueSnackbar(response.data.msg.body, { variant: response.data.msg.type });
      }
    } catch (error) {
      enqueueSnackbar('Error fetching bog tonnes', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Debounced fetch function (500ms)
  const debouncedFetch = useDebouncedCallback((date, shift) => {
    if (date && shift) {
      fetchBogData(date, shift);
    }
  }, 500);

  useEffect(() => {
    // Initial fetch if shift already set (if desired)
    if (formik.values.shift) {
      debouncedFetch(formik.values.pickerDate, formik.values.shift);
    }
  }, []);

  const handlePDFDownload = () => {
    const blob = pdf(
      <ReportPDF data={bogTonnes.results} date={formik.values.pickerDate} shift={formik.values.shift} total={bogTonnes.total} />
    ).toBlob();
    blob.then((b) => {
      const url = URL.createObjectURL(b);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Bogging Verification Report ${formik.values.pickerDate.format('YYYYMMDD')}.pdf`;
      link.click();
    });
  };

  const handlePrint = async () => {
    const blob = await pdf(
      <ReportPDF data={bogTonnes.results} date={formik.values.pickerDate} shift={formik.values.shift} total={bogTonnes.total} />
    ).toBlob();
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
    const csv = [['Ring', 'Shift', 'Quantity'], ...bogTonnes.results.map((r) => [r.alias, r.shift, r.quantity])];
    csv.push(['Total', '', bogTonnes.total]);

    const csvContent = `data:text/csv;charset=utf-8,${csv.map((e) => e.join(',')).join('\n')}`;
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `Bogging Verification Report ${formik.values.pickerDate.format('YYYYMMDD')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadActions = [
    { icon: <PrintIcon />, name: 'Print', onClick: handlePrint },
    { icon: <PictureAsPdfIcon />, name: 'PDF', onClick: handlePDFDownload },
    { icon: <TableChartIcon />, name: 'CSV', onClick: handleCSVDownload }
  ];

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Card elevation={1}>
      <Box sx={{ paddingBottom: '10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pt: 2 }}>
          <Typography variant="h5">Bogging Verification Report</Typography>
          <Box sx={{ display: 'flex', alignItems: 'right', gap: 2 }}>
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
                  disabled={bogTonnes.length === 0}
                >
                  {action.icon}
                  <Typography sx={{ ml: 1 }}>{action.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pl: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Date"
              format="DD/MM/YYYY"
              disableFuture
              value={formik.values.pickerDate}
              onChange={(date) => {
                formik.setFieldValue('pickerDate', date);
                debouncedFetch(date, formik.values.shift);
              }}
              slotProps={{
                textField: { sx: { width: '10rem' } }
              }}
            />
          </LocalizationProvider>

          <RadioGroup
            row
            value={formik.values.shift}
            onChange={(event) => {
              const newShift = event.target.value;
              formik.setFieldValue('shift', newShift);
              debouncedFetch(formik.values.pickerDate, newShift);
            }}
          >
            <FormControlLabel value="Day" control={<Radio />} label="Day" />
            <FormControlLabel value="Night" control={<Radio />} label="Night" />
          </RadioGroup>
        </Box>
      </Box>

      <Divider sx={{ mt: 2 }} />

      <CardContent sx={{ px: 0, pt: 1, pb: 0 }}>
        {loading ? (
          <Typography sx={{ pt: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</Typography>
        ) : bogTonnes.results.length ? (
          <TableContainer>
            <Table size="small" sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Ring</TableCell>
                  <TableCell>Quantity (t)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bogTonnes.results.map((ring, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{ring.alias}</TableCell>
                    <TableCell>{ring.quantity}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      borderTop: `2px solid ${theme.palette.divider}`,
                      backgroundColor: theme.palette.action.hover
                    }}
                  >
                    Total
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      borderTop: `2px solid ${theme.palette.divider}`,
                      backgroundColor: theme.palette.action.hover
                    }}
                  >
                    {bogTonnes.total}
                  </TableCell>
                </TableRow>
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

export default BogVerifyWidget;
