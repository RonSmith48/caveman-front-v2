import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// third-party
import { flexRender, useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';

// project import
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import TablePagination from 'components/third-party/react-table/TablePagination';
import CSVExport from 'components/third-party/react-table/CSVExport';
import SelectColumnVisibility from 'components/third-party/react-table/SelectColumnVisibility';
import RingInspectModal from 'features/cave-manager/ring-inspector/RingInspectModalVersion';

export default function ProdOrphans({ data }) {
  // Dialog state
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  // Handlers (memoized)
  const handleOpen = useCallback((locationId) => {
    setSelectedLocation(locationId);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSelectedLocation(null);
  }, []);

  // Column definitions
  const columns = useMemo(
    () => [
      {
        header: 'ID',
        accessorKey: 'location_id',
        meta: { className: 'cell-center' }
      },
      {
        header: 'Alias',
        accessorKey: 'alias',
        cell: ({ row }) => {
          const id = row.original.location_id;
          return (
            <Link component="button" underline="hover" onClick={() => handleOpen(id)}>
              {row.original.alias}
            </Link>
          );
        }
      },
      // ...other columns here, following the same pattern (only define columns you need)
      {
        header: 'Status',
        accessorKey: 'status'
      }
    ],
    [handleOpen]
  );

  // Setup table
  const [columnVisibility, setColumnVisibility] = useState({});
  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  // Initialize default visibility once
  useEffect(() => {
    setColumnVisibility({
      location_id: false
      /* hide default columns, show only needed ones */
      // e.g. prod_dev_code: false, is_active: false, etc.
    });
  }, []);

  // Build CSV headers
  const headers = table.getVisibleLeafColumns().map((col) => ({
    label: typeof col.columnDef.header === 'string' ? col.columnDef.header : '#',
    key: col.columnDef.accessorKey || ''
  }));

  return (
    <>
      <MainCard
        content={false}
        title={matchDownSM ? 'Orphans' : 'Orphaned Production Rings'}
        secondary={
          <Stack direction="row" alignItems="center" pl={1} spacing={{ xs: 1, sm: 2 }}>
            <SelectColumnVisibility
              getVisibleLeafColumns={table.getVisibleLeafColumns}
              getIsAllColumnsVisible={table.getIsAllColumnsVisible}
              getToggleAllColumnsVisibilityHandler={table.getToggleAllColumnsVisibilityHandler}
              getAllColumns={table.getAllColumns}
            />
            <CSVExport data={data} headers={headers} filename="Orphaned production rings.csv" />
          </Stack>
        }
      >
        <ScrollX>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableCell key={header.id} {...header.column.columnDef.meta}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider />
          <Box sx={{ p: 2 }}>
            <TablePagination
              setPageSize={table.setPageSize}
              setPageIndex={table.setPageIndex}
              getState={table.getState}
              getPageCount={table.getPageCount}
            />
          </Box>
        </ScrollX>
      </MainCard>

      {/* Dialog moved to parent for clearer state handling */}
      <Dialog fullScreen scroll="paper" open={open} onClose={handleClose}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              Ring Inspector
            </Typography>
            <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent dividers sx={{ p: 0 }}>
          {selectedLocation && <RingInspectModal location_id={selectedLocation} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

ProdOrphans.propTypes = {
  data: PropTypes.array.isRequired
};
