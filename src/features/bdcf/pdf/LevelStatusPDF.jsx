// components/LevelStatusPDF.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image, pdf } from '@react-pdf/renderer';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

// styles
import pdfStyles from 'assets/PDFReportStyles';

const LevelPage = ({ levelData, reportDate, author, pageIndex, totalPages }) => (
  <Page size="A4" orientation="landscape" style={pdfStyles.landscapePage} wrap>
    <View>
      <View style={pdfStyles.landscapeHeader}>
        <Text style={pdfStyles.title}>Level {levelData.level}</Text>
        <Image style={pdfStyles.logo} src="/assets/images/branding/evn-logo-grey.png" />
      </View>
      <View style={pdfStyles.tableHeader}>
        <Text style={pdfStyles.cell}>Ore Drive</Text>
        <Text style={pdfStyles.cell}>Bogging</Text>
        <Text style={pdfStyles.cellNarrow}>Avail Tonnes</Text>
        <Text style={pdfStyles.cellWide}>Bogging Comments</Text>
        <Text style={pdfStyles.cellNarrow}>Last Drilled</Text>
        <Text style={pdfStyles.cell}>Charged Rings</Text>
      </View>
      {levelData.ore_drives.map((od) => (
        <View key={od.name} style={pdfStyles.row}>
          <Text style={pdfStyles.cell}>{od.name}</Text>
          <Text style={pdfStyles.cell}>{od.bogging.ring_txt}</Text>
          <Text style={[pdfStyles.cellNarrow, parseFloat(od.bogging.avail_tonnes) < 0 ? pdfStyles.negative : null]}>
            {parseInt(od.bogging.avail_tonnes, 10)}
          </Text>
          <View style={[pdfStyles.cellWide, { flexDirection: 'row', flexWrap: 'wrap' }]}>
            {(od.bogging.conditions || []).map((condition, index) => (
              <View key={index} style={pdfStyles.chip}>
                <Text>{condition}</Text>
              </View>
            ))}
            {od.bogging.comment && <Text style={pdfStyles.commentText}>{od.bogging.comment}</Text>}
          </View>

          <Text style={pdfStyles.cellNarrow}>
            {(() => {
              const drilled = od.drilled || {};
              const last = drilled.last_drilled;
              const problemRings = drilled.problem_rings || [];

              if (!last && problemRings.length === 0) {
                return '—';
              }

              const problemSet = new Set(problemRings.map((p) => p.ring_number_txt));
              const combinedRings = new Set(problemSet);
              if (last) combinedRings.add(last);

              const ringList = Array.from(combinedRings);
              return ringList.map((ring, index) => {
                const isProblem = problemSet.has(ring);
                const isLast = index === ringList.length - 1;
                return (
                  <Text key={index} style={isProblem ? pdfStyles.overslept : null}>
                    {ring}
                    {!isLast && <Text style={pdfStyles.comma}>, </Text>}
                  </Text>
                );
              });
            })()}
          </Text>

          <Text style={pdfStyles.cell}>
            {(() => {
              const charged = od.charged || [];
              if (charged.length === 0) {
                return '—';
              }

              return charged.map((c, i) => {
                const ring = `${c.ring}${c.detonator ? c.detonator[0] : ''}`;
                const isLast = i === charged.length - 1;

                return (
                  <React.Fragment key={i}>
                    <Text style={c.is_overslept ? pdfStyles.overslept : null}>{ring}</Text>
                    {!isLast && <Text style={pdfStyles.comma}>, </Text>}
                  </React.Fragment>
                );
              });
            })()}
          </Text>
        </View>
      ))}
      <View style={[pdfStyles.totalsRow]}>
        <Text style={pdfStyles.cell}>Totals</Text>
        <Text style={pdfStyles.cell}></Text>
        <Text style={pdfStyles.cellNarrow}></Text>
        <Text style={pdfStyles.cellWide} />
        <Text style={pdfStyles.cellNarrow}></Text>
        <Text style={pdfStyles.cell}></Text>
      </View>
    </View>

    <View style={pdfStyles.footer} fixed>
      <Text>
        <Text>Report Date:</Text> <Text style={{ fontSize: 8 }}>{reportDate}</Text>
      </Text>
      <Text>Author: {author}</Text>
      <Text>
        Page {pageIndex + 1} of {totalPages}
      </Text>
    </View>
  </Page>
);

export const ReportPDF = ({ data, author, date, shift }) => {
  const reportDate = `${date}  For: ${shift.toUpperCase()}`;
  const totalPages = data.length;

  return (
    <Document>
      {data.map((levelData, index) => (
        <LevelPage
          key={levelData.level}
          levelData={levelData}
          reportDate={reportDate}
          author={author}
          pageIndex={index}
          totalPages={totalPages}
        />
      ))}
    </Document>
  );
};

export const DownloadReportButton = ({ data, author, date, shift }) => {
  const handlePrint = async () => {
    const blob = await pdf(<ReportPDF data={data} author={author} date={date} shift={shift} />).toBlob();
    const blobUrl = URL.createObjectURL(blob);
    const printWindow = window.open(blobUrl);
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <PDFDownloadLink document={<ReportPDF data={data} author={author} date={date} shift={shift} />} fileName="Level Status Report.pdf">
        {({ loading }) => (
          <IconButton title={loading ? 'Generating PDF...' : 'Download PDF'}>
            <PictureAsPdfIcon color="primary" sx={{ fontSize: 28 }} />
          </IconButton>
        )}
      </PDFDownloadLink>
      <IconButton onClick={handlePrint} title="Print PDF">
        <PrintIcon color="primary" sx={{ fontSize: 28 }} />
      </IconButton>
    </Box>
  );
};
