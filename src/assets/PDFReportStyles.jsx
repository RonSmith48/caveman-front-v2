// pdf-reports.js
import { StyleSheet } from '@react-pdf/renderer';

const pdfStyles = StyleSheet.create({
  cell: { flex: 1, paddingRight: 4 },
  cellNarrow: { flex: 0.7 },
  cellRing: { flex: 2, paddingRight: 6 },
  cellStatus: {
    flex: 1,
    paddingRight: 4,
    textAlign: 'center',
    justifyContent: 'center',
    textTransform: 'capitalize'
  },
  cellWide: { flex: 3 },
  chip: {
    fontSize: 9,
    backgroundColor: '#cce5ff',
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  comma: { color: 'black' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    borderTop: '1pt solid #999',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    paddingTop: 6
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  landscapeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  landscapePage: {
    padding: 20,
    fontSize: 10,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  logo: { width: 60 },
  negative: { color: 'red' },
  overslept: { color: 'red', fontWeight: 'bold' },
  page: {
    padding: 30,
    fontSize: 10,
    position: 'relative'
  },
  row: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid #ccc',
    paddingVertical: 3
  },
  statusSecondary: { backgroundColor: '#e0e0f8' },
  statusSuccess: { backgroundColor: '#d0f0d0' },
  statusWarning: { backgroundColor: '#fff4cc' },
  subTitle: { fontSize: 10, marginTop: 2 },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1pt solid black',
    fontWeight: 'bold',
    paddingBottom: 5,
    marginBottom: 4
  },
  title: { fontSize: 14, fontWeight: 'bold' },
  titleContainer: { flexDirection: 'column' },
  totalsRow: {
    flexDirection: 'row',
    borderTopWidth: 0.8,
    borderTopColor: '#999', // darker than #ccc but not black
    borderTopStyle: 'solid',
    marginTop: 4,
    paddingTop: 2,
    color: '#666', // medium gray text
    fontSize: 10
  }
});

export default pdfStyles;
