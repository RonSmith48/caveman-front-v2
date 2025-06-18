import React, { useState, useEffect } from 'react';
import { Stack, FormControl, InputLabel, Select, MenuItem, Button, Box, IconButton } from '@mui/material';
import MainCard from 'components/MainCard';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import HelpDialog from 'components/HelpDialog';
import fetcher from 'utils/axios';

const ImportExportPage = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');

  useEffect(() => {
    // Fetch exportable tables from backend
    // Example API response: [{ id: 'prod_ring', label: 'Production Ring', requiresLevel: true }, ...]
    fetcher('/api/common/export/tables/')
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
          <HelpDialog id={15} />
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
    </MainCard>
  );
};

export default ImportExportPage;
