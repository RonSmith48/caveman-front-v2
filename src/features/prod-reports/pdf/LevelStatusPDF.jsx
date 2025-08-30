// components/LevelStatusPDF.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image, pdf } from '@react-pdf/renderer';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

// styles
import pdfStyles from 'assets/PDFReportStyles';

const LevelPage = ({ levelData, reportDate, date, shift, author, pageIndex, totalPages, isDraft }) => (
  <Page size="A4" orientation="landscape" style={pdfStyles.landscapePage} wrap>
    {isDraft && <Text style={pdfStyles.watermarkText}>DRAFT</Text>}
    <View>
      <View style={pdfStyles.landscapeHeader}>
        <Text style={pdfStyles.title}>
          Level {levelData.level} - {shift.toUpperCase()} {date}
        </Text>
        <Image style={pdfStyles.logo} src="/images/branding/evn-logo-grey.png" />
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
              const charges = [...(od.charged || [])];
              // sort by ring + detonator initial lowercase
              charges.sort((a, b) => {
                const aKey = `${a.ring}${a.detonator ? a.detonator[0].toLowerCase() : ''}`;
                const bKey = `${b.ring}${b.detonator ? b.detonator[0].toLowerCase() : ''}`;
                return aKey.localeCompare(bKey);
              });
              if (charges.length === 0) {
                return '—';
              }
              return charges.map((c, i) => {
                const initial = c.detonator ? c.detonator[0].toLowerCase() : '';
                const key = `${c.ring}${initial}`;
                const isLast = i === charges.length - 1;
                let text = key;
                if (c.is_overslept && c.fireby_date) {
                  const d = new Date(c.fireby_date);
                  const day = String(d.getDate()).padStart(2, '0');
                  const month = String(d.getMonth() + 1).padStart(2, '0');
                  text = `${key} (${day}/${month})`;
                }
                return (
                  <React.Fragment key={key}>
                    <Text style={c.is_overslept ? pdfStyles.overslept : null}>{text}</Text>
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
        <Text style={pdfStyles.cellNarrow}>{parseInt(levelData.broken_stock ?? 0, 10)}</Text>
        <Text style={pdfStyles.cellWide}></Text>
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

export const ReportPDF = ({ data, author, date, shift, isDraft }) => {
  const reportDate = `${date}  For: ${shift.toUpperCase()}`;
  const totalPages = data.length;
  const dateOnly = date.split(' ')[0];

  return (
    <Document>
      {data.map((levelData, index) => (
        <LevelPage
          key={levelData.level}
          levelData={levelData}
          reportDate={reportDate}
          date={dateOnly}
          shift={shift}
          author={author}
          pageIndex={index}
          totalPages={totalPages}
          isDraft={isDraft}
        />
      ))}
    </Document>
  );
};

export const DownloadReportButton = ({ data, author, date, shift, isDraft }) => {
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
  };

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <PDFDownloadLink
        document={<ReportPDF data={data} author={author} date={date} shift={shift} isDraft={isDraft} />}
        fileName="Level Status Report.pdf"
      >
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
