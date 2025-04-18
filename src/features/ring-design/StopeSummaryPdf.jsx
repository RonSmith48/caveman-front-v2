// components/pdf/StopeSummaryPDF.jsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 8,
    flexDirection: 'column'
  },
  title: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5
  },
  groupHeader: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    textAlign: 'center',
    fontWeight: 'bold',
    paddingVertical: 2
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    textAlign: 'center'
  },
  cell: {
    border: '0.5pt solid #000',
    paddingVertical: 2,
    paddingHorizontal: 2,
    flexGrow: 1
  },
  widths: [
    90,
    35,
    50,
    40,
    45,
    45,
    60,
    40,
    40,
    40,
    60,
    55,
    50,
    55 // in px
  ]
});

const headers = [
  'Drive ID',
  'No. Holes',
  'Design Metre',
  'Azimuth',
  'Dump Angle',
  'Burden',
  'Hole Diameter',
  'Cu, %',
  'Au, g/t',
  'Density',
  'Volume, m3',
  'Insitu Tonnes',
  'Cu, t',
  'Draw Ratio'
];

const StopeSummaryPDF = ({ rings }) => {
  // Optional: total metres
  const sumDrillMetres = rings.reduce((acc, r) => acc + parseFloat(r.drill_meters || 0), 0).toFixed(1);

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.title}>Stope Summary</Text>

        {/* Group Header */}
        <View style={styles.groupHeader}>
          <Text style={[styles.cell, { width: 371 }]}>Ring Information</Text>
          <Text style={[styles.cell, { width: 489 }]}>Evaluation</Text>
        </View>

        {/* Column Headers */}
        <View style={styles.headerRow}>
          {headers.map((header, i) => (
            <Text key={i} style={[styles.cell, { width: styles.widths[i] }]}>
              {header}
            </Text>
          ))}
        </View>

        {/* Data Rows */}
        {rings.map((r, i) => {
          const cu_pct = parseFloat(r.cu_pct || 0);
          const tonnes = parseFloat(r.designed_tonnes || 0);
          const cu_tonnes = ((cu_pct * tonnes) / 100).toFixed(1);
          console.log(r);

          return (
            <View key={i} style={styles.row}>
              {[
                `${r.level}_${r.oredrive}_${r.ring_number_txt}`,
                r.holes,
                parseFloat(r.drill_meters || 0).toFixed(1),
                r.azimuth ?? '',
                r.dump ?? '',
                r.burden ?? '',
                r.diameters ?? '',
                cu_pct.toFixed(2),
                parseFloat(r.au_gram_per_tonne || 0).toFixed(2),
                parseFloat(r.density || 0).toFixed(2),
                parseFloat(r.blastsolids_volume || 0).toFixed(1),
                tonnes.toFixed(1),
                cu_tonnes,
                parseFloat(r.draw_percentage || 0).toFixed(3)
              ].map((value, j) => (
                <Text key={j} style={[styles.cell, { width: styles.widths[j] }]}>
                  {value}
                </Text>
              ))}
            </View>
          );
        })}

        {/* Total row */}
        <View style={styles.row}>
          <Text style={[styles.cell, { width: styles.widths[0] }]}>Total</Text>
          <Text style={[styles.cell, { width: styles.widths[1] }]}></Text>
          <Text style={[styles.cell, { width: styles.widths[2] }]}>{sumDrillMetres}</Text>
          {styles.widths.slice(3).map((w, i) => (
            <Text key={i} style={[styles.cell, { width: w }]}></Text>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default StopeSummaryPDF;
