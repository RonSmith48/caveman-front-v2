import React, { useState, useEffect } from 'react';
import { useNotifier } from 'contexts/NotifierContext';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  IconButton,
  Button,
  Paper,
  Table,
  Tooltip,
  TableBody,
  TableRow,
  TableCell,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  OutlinedInput
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import FormatIndentDecreaseIcon from '@mui/icons-material/FormatIndentDecrease';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import TableChartIcon from '@mui/icons-material/TableChart';
import { Formik, Form } from 'formik';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';

import StopeSummaryPDF from 'features/ring-design/StopeSummaryPDF';
import { exportAegisCsv } from 'features/ring-design/ExportAegisFile';
import MainCard from 'components/MainCard';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { fetcher } from 'utils/axios';

const WidgetStopeSummary = () => {
  const [selectedRings, setSelectedRings] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showFullNames, setShowFullNames] = useState(true);
  const [openHelp, setOpenHelp] = useState(false);

  const [loading, setLoading] = useState(true);
  const [ringData, setRingData] = useState([]);
  const [levels, setLevels] = useState([]);
  const [oredrives, setOredrives] = useState([]);
  const [rings, setRings] = useState([]);
  const { subscribe } = useNotifier();

  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const fetchDesignedDrives = async () => {
    try {
      const response = await fetcher('/prod-actual/drill-blast/designed-rings/');
      const data = response.data;

      setRingData(data);

      // Extract unique levels
      const levelSet = [...new Set(data.map((r) => r.level))];
      setLevels(levelSet);
    } catch (error) {
      console.error('Error fetching active rings list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignedDrives();
    const unsub = subscribe('summary/refresh', fetchDesignedDrives);
    return unsub;
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(selectedRings);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setSelectedRings(items);
  };

  const handlePrintPdf = async () => {
    const blob = await pdf(<StopeSummaryPDF rings={selectedRings} />).toBlob();
    const blobUrl = URL.createObjectURL(blob);

    const printWindow = window.open(blobUrl);
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    } else {
      console.error('Popup blocked — allow popups to print PDF.');
    }
  };

  return (
    <>
      <MainCard
        title="Stope Summary Generator"
        secondary={
          <Tooltip title="Help">
            <IconButton onClick={() => setOpenHelp(true)} size="small">
              <HelpOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
      >
        <Formik
          initialValues={{ level: '', oredrive: '', rings: [] }}
          onSubmit={(values) => {
            const { level, oredrive, rings } = values;
            const taggedRings = ringData.filter((r) => r.level === level && r.oredrive === oredrive && rings.includes(r.ring_number_txt));
            setSelectedRings(taggedRings);
          }}
        >
          {({ values, handleChange, handleSubmit, setFieldValue }) => {
            const handleLevelChange = (e) => {
              const level = e.target.value;
              const filtered = ringData.filter((r) => r.level === level);
              const odSet = [...new Set(filtered.map((r) => r.oredrive))];
              setOredrives(odSet);
              setRings([]);
              setFieldValue('level', level);
              setFieldValue('oredrive', '');
              setFieldValue('rings', []);
            };

            const handleOreDriveChange = (e) => {
              const oredrive = e.target.value;
              const filtered = ringData.filter((r) => r.level === values.level && r.oredrive === oredrive);
              const ringList = filtered.map((r) => r.ring_number_txt);
              setRings(ringList);
              setFieldValue('oredrive', oredrive);
              setFieldValue('rings', []);
            };
            return (
              <Form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Level</InputLabel>
                  <Select name="level" value={values.level} onChange={handleLevelChange} fullWidth>
                    {levels.map((lvl) => (
                      <MenuItem key={lvl} value={lvl}>
                        {lvl}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Ore Drive</InputLabel>
                  <Select name="oredrive" value={values.oredrive} onChange={handleOreDriveChange} fullWidth>
                    {oredrives.map((od) => (
                      <MenuItem key={od} value={od}>
                        {od}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Rings</InputLabel>
                  <Button
                    size="small"
                    onClick={() => setFieldValue('rings', values.rings.length === rings.length ? [] : [...rings])}
                    sx={{ mb: 1 }}
                  >
                    {values.rings.length === rings.length ? 'Deselect All' : 'Select All'}
                  </Button>
                  <Select
                    multiple
                    name="rings"
                    value={values.rings}
                    onChange={handleChange}
                    input={<OutlinedInput label="Rings" />}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {rings.map((ring) => (
                      <MenuItem key={ring} value={ring}>
                        <Checkbox checked={values.rings.includes(ring)} />
                        <ListItemText primary={ring} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                  Add Rings
                </Button>
              </Form>
            );
          }}
        </Formik>
        {/* Help Dialog */}
        <Dialog open={openHelp} onClose={() => setOpenHelp(false)} fullWidth>
          <DialogTitle>How it Works</DialogTitle>
          <DialogContent>
            <p>How it works goes here</p>
          </DialogContent>
        </Dialog>
      </MainCard>
      {selectedRings.length > 0 && (
        <>
          <MainCard
            title="Ring Order for Print"
            secondary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title={showFullNames ? 'Show Short Ring Names' : 'Show Full Ring Names'}>
                  <IconButton onClick={() => setShowFullNames((prev) => !prev)}>
                    {showFullNames ? <FormatIndentDecreaseIcon /> : <FormatIndentIncreaseIcon />}
                  </IconButton>
                </Tooltip>

                <IconButton onClick={handleMenuClick}>
                  <MoreVertIcon />
                </IconButton>
              </Box>
            }
          >
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              <MenuItem disabled={selectedRings.length === 0} onClick={handlePrintPdf}>
                <PrintIcon fontSize="small" sx={{ mr: 1 }} />
                Print
              </MenuItem>

              <MenuItem disabled={selectedRings.length === 0}>
                <PDFDownloadLink
                  document={<StopeSummaryPDF rings={selectedRings} />}
                  fileName="stope-summary.pdf"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}
                >
                  {({ loading }) => (
                    <>
                      <PictureAsPdfIcon fontSize="small" sx={{ mr: 1 }} />
                      {loading ? 'Wait' : 'PDF'}
                    </>
                  )}
                </PDFDownloadLink>
              </MenuItem>

              <MenuItem disabled={selectedRings.length === 0} onClick={() => exportAegisCsv(selectedRings)}>
                <TableChartIcon fontSize="small" sx={{ mr: 1 }} />
                <span>CSV</span>
              </MenuItem>
            </Menu>
            <Paper sx={{ mt: 1 }}>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="ringTable">
                  {(provided) => (
                    <Table size="small">
                      <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                        {selectedRings.map((ring, idx) => (
                          <Draggable key={ring.location_id} draggableId={ring.location_id.toString()} index={idx}>
                            {(provided, snapshot) => (
                              <TableRow
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  backgroundColor: snapshot.isDragging ? '#f5f5f5' : 'inherit',
                                  cursor: 'grab'
                                }}
                              >
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>⠿</span>
                                    {showFullNames ? `${ring.level}_${ring.oredrive}_${ring.ring_number_txt}` : ring.ring_number_txt}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            )}
                          </Draggable>
                        ))}

                        {provided.placeholder}
                      </TableBody>
                    </Table>
                  )}
                </Droppable>
              </DragDropContext>
            </Paper>
          </MainCard>
        </>
      )}
    </>
  );
};

export default WidgetStopeSummary;
