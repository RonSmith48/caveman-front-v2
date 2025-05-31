import React from 'react';
import { Box, Menu, MenuItem, IconButton, CircularProgress } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import TableChartIcon from '@mui/icons-material/TableChart';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { ReportPDF } from 'features/prod-reports/pdf/LevelStatusPDF';
import { fetcher } from 'utils/axios';
import dayjs from 'dayjs';

export default function LevelStatusMenu({ data, author, date, shift, isDraft }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handlePrint = async () => {
    const blob = await pdf(<ReportPDF data={data} author={author} date={date} shift={shift} isDraft={isDraft} />).toBlob();
    const blobUrl = URL.createObjectURL(blob);
    const printWindow = window.open(blobUrl);
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    }
    handleClose();
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await fetcher('/report/prod/dupe/');
      const data = response.data;

      if (!Array.isArray(data) || data.length === 0) {
        console.warn('No data received or data is not an array.');
        return;
      }

      const keys = Object.keys(data[0]);
      const csvRows = [];

      // Header
      csvRows.push(keys.join(','));

      // Rows
      data.forEach((row) => {
        const values = keys.map((k) => JSON.stringify(row[k] ?? ''));
        csvRows.push(values.join(','));
      });

      // Download
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'DataDupe.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading CSV:', err);
    }

    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handlePrint}>
          <PrintIcon sx={{ mr: 1 }} /> Print
        </MenuItem>
        <MenuItem>
          <Box component="span" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <PDFDownloadLink
              document={<ReportPDF data={data} author={author} date={date} shift={shift} isDraft={isDraft} />}
              fileName={`Level Status Report ${dayjs(date).format('YYYYMMDD')}${shift[0].toUpperCase()}.pdf`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}
            >
              {({ loading }) =>
                loading ? (
                  <CircularProgress size={20} sx={{ mr: 2 }} />
                ) : (
                  <>
                    <PictureAsPdfIcon sx={{ mr: 1 }} /> PDF
                  </>
                )
              }
            </PDFDownloadLink>
          </Box>
        </MenuItem>

        <MenuItem onClick={handleDownloadCSV}>
          <TableChartIcon sx={{ mr: 1 }} /> Dupe
        </MenuItem>
      </Menu>
    </>
  );
}
