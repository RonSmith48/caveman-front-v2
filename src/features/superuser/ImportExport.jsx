import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import MainCard from 'components/MainCard';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

const ImportExportPage = () => {
  const [openHelp, setOpenHelp] = useState(false);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [extraFields, setExtraFields] = useState([]);

  // Optionally store additional state for dynamic selections

  useEffect(() => {
    // Fetch exportable tables from backend
    // Example API response: [{ id: 'prod_ring', label: 'Production Ring', requiresLevel: true }, ...]
    fetch('/common/exportable-tables/')
      .then((res) => res.json())
      .then(setTables);
  }, []);

  const handleTableChange = (e) => {
    const table = e.target.value;
    setSelectedTable(table);
    // Optionally update extraFields based on table selection
    // e.g., setExtraFields(tables.find(t => t.id === table)?.fields || []);
  };

  const handleImport = (file) => {
    // Upload to backend for this table
  };

  const handleExport = () => {
    // Trigger download for selectedTable with any extra params
  };

  return (
    <MainCard
      title="Import/Export Table Data"
      secondary={
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={handleExport} disabled={!selectedTable} size="small">
            <FileDownloadOutlinedIcon fontSize="small" />
          </IconButton>
          <Tooltip title="Help">
            <IconButton onClick={() => setOpenHelp(true)} size="small">
              <HelpOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      }
      sx={{ '& .MuiCardHeader-root': { padding: '16px 16px' } }}
    >
      <Stack spacing={3}>
        <FormControl fullWidth>
          <InputLabel id="table-select-label">Select Table</InputLabel>
          <Select labelId="table-select-label" value={selectedTable} label="Select Table" onChange={handleTableChange}>
            {tables.map((table) => (
              <MenuItem key={table.id} value={table.id}>
                {table.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Render extra selects/fields if required for this table */}
        {/* {extraFields.map(...)} */}

        <Box>
          {/* Dropzone for import */}
          <Button variant="contained" component="label" disabled={!selectedTable}>
            Import File
            <input type="file" hidden onChange={(e) => handleImport(e.target.files[0])} />
          </Button>
        </Box>
      </Stack>
      {/* Help Dialog */}
      <Dialog open={openHelp} onClose={() => setOpenHelp(false)} fullWidth>
        <DialogTitle>How it Works</DialogTitle>
        <DialogContent>
          <p>How it works goes here</p>
        </DialogContent>
      </Dialog>
    </MainCard>
  );
};

export default ImportExportPage;
