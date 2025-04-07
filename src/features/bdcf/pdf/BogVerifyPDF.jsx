// components/LevelStatusPDF.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image, pdf } from '@react-pdf/renderer';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';

// styles
import pdfStyles from 'assets/PDFReportStyles';

const formatDate = (date) => date.format('DD/MM/YYYY');
const formatDateTime = (date) => date.format('DD/MM/YYYY h:mm A');

const ReportPage = ({ data, reportDate, shift, generatedAt }) => (
  <Page size="A4" orientation="portrait" style={pdfStyles.page}>
    <View style={pdfStyles.headerRow}>
      <View style={pdfStyles.titleContainer}>
        <Text style={pdfStyles.title}>Bogging Verification Report</Text>
        <Text style={pdfStyles.subTitle}>
          for {formatDate(reportDate)} {shift}shift
        </Text>
      </View>
      <Image style={pdfStyles.logo} src="/assets/images/branding/evn-logo-grey.png" />
    </View>

    <View style={pdfStyles.tableHeader}>
      <Text style={pdfStyles.cellRing}>Ring</Text>
      <Text style={pdfStyles.cell}>Quantity</Text>
    </View>

    {data.map((ring, index) => (
      <View key={index} style={pdfStyles.row}>
        <Text style={pdfStyles.cellRing}>{ring.alias}</Text>
        <Text style={pdfStyles.cell}>{ring.quantity}</Text>
      </View>
    ))}

    <View style={pdfStyles.footer} fixed>
      <Text>Report Produced: {formatDateTime(generatedAt)}</Text>
      <Text>Author: Auto-generated</Text>
      <Text>Page 1 of 1</Text>
    </View>
  </Page>
);

export const ReportPDF = ({ data, date, shift }) => {
  const now = dayjs(); // Current timestamp
  return (
    <Document>
      <ReportPage data={data} reportDate={date} shift={shift} generatedAt={now} />
    </Document>
  );
};

export const DownloadReportButton = ({ data, date, shift, disabled }) => {
  const handlePrint = async () => {
    if (disabled) return;
    const blob = await pdf(<ReportPDF data={data} date={date} shift={shift} />).toBlob();
    const blobUrl = URL.createObjectURL(blob);
    const printWindow = window.open(blobUrl);
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    }
  };

  const iconButtonStyles = {
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? 'none' : 'auto'
  };

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <PDFDownloadLink
        document={<ReportPDF data={data} date={date} shift={shift} />}
        fileName={`Bogging Verification Report ${date.format('YYYYMMDD')}.pdf`}
        style={iconButtonStyles}
      >
        {({ loading }) => (
          <IconButton title={loading ? 'Generating PDF...' : 'Download PDF'} disabled={disabled}>
            <PictureAsPdfIcon color="primary" sx={{ fontSize: 28 }} />
          </IconButton>
        )}
      </PDFDownloadLink>
      <IconButton onClick={handlePrint} title="Print PDF" disabled={disabled} sx={iconButtonStyles}>
        <PrintIcon color="primary" sx={{ fontSize: 28 }} />
      </IconButton>
    </Box>
  );
};
