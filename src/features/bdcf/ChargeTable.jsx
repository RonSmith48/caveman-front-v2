import PropTypes from 'prop-types';

import { useMemo, useState, useEffect } from 'react';

// material-ui
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';

import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import AssistWalkerOutlinedIcon from '@mui/icons-material/AssistWalkerOutlined';

// third-party
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { enqueueSnackbar } from 'notistack';

// project-import
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import CSVExport from 'components/third-party/react-table/CSVExport';
import RowEditable from 'features/bdcf/BogTableRowEditable';
import { fetcher, fetcherPut, fetcherPost } from 'utils/axios';
import { formatToShift } from 'utils/shkey';
import ChargeEditModal from 'features/bdcf/ChargeEditModal';

// assets
import EditTwoTone from '@ant-design/icons/EditTwoTone';

function EditAction({ location_id, handleSelectOredrive, od }) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState(null);

  const handleEdit = () => {
    setSelectedLocationId(location_id); // Set the location_id
    setOpenModal(true); // Open the modal
  };

  const handleClose = () => {
    setOpenModal(false); // Close the modal
  };

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <Tooltip title="Edit">
          <IconButton color="primary" onClick={handleEdit}>
            <EditTwoTone />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Pass location_id and handleSelectOredrive to the modal */}
      <ChargeEditModal
        open={openModal}
        onClose={handleClose}
        location_id={selectedLocationId}
        handleSelectOredrive={handleSelectOredrive}
        od={od}
      />
    </>
  );
}

EditAction.propTypes = {
  row: PropTypes.object,
  handleSelectOredrive: PropTypes.func.isRequired
};

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, currentOredrive }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  let headers = [];
  table.getAllColumns().map(
    (columns) =>
      columns.columnDef.accessorKey &&
      headers.push({
        label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
        key: columns.columnDef.accessorKey
      })
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <TableContainer>
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
                      {flexRender(cell.column.columnDef.cell, { ...cell.getContext() })}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ScrollX>
    </MainCard>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  currentOredrive: PropTypes.string
};

// ==============================|| REACT TABLE - EDITABLE ROW ||============================== //
// oredrive - Name of oredrive for title
// ringData - Table row data
// handleSelectOredrive - method for updating charged rings table and SelectRing dropdown if ring uncharged

export default function BDCFChargeTable1({ oredrive, ringData, handleSelectOredrive }) {
  const [data, setData] = useState(ringData);
  const [loading, setLoading] = useState(true);
  const SM_AVATAR_SIZE = 32;

  useEffect(() => {
    setData(ringData); // Update table data when ringData changes
    setLoading(false);
  }, [ringData]);

  // Memoize columns outside of any conditional statement
  const columns = useMemo(
    () => [
      {
        header: 'Completed',
        accessorKey: 'charge_shift', // Key from your data source
        cell: (info) => {
          const value = info.getValue();

          if (!value) {
            return ''; // Return an empty string if value is null/undefined
          }

          try {
            // Use the new formatToShift method to handle all formats
            return formatToShift(value);
          } catch (error) {
            console.error('Error formatting charge_shift:', value, error.message);
            return value; // Return the original value if formatting fails
          }
        }
      },

      {
        header: 'Ring',
        accessorKey: 'ring_number_txt',
        cell: (info) => info.getValue()
      },
      {
        header: 'Detonator',
        accessorKey: 'detonator',
        cell: (info) => info.getValue()
      },
      {
        header: 'Conditions',
        accessorKey: 'conditions',
        cell: (info) => {
          const row = info.row.original;

          // Determine currently selected conditions
          const selectedConditions = row.conditions || [];

          // Render chips for non-editable mode
          return (
            <Stack direction="row" flexWrap="wrap">
              {selectedConditions.map((cond, index) =>
                cond.state !== null ? (
                  <Chip
                    key={index}
                    label={`${cond.state}`}
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ margin: '0 4px 4px 0' }}
                  />
                ) : null
              )}
            </Stack>
          );
        }
      },
      {
        header: 'Actions',
        id: 'location_id',
        cell: (info) => (
          <EditAction
            location_id={info.row.original.location_id} // Explicitly pass location_id
            handleSelectOredrive={handleSelectOredrive}
            od={oredrive}
          />
        ),
        meta: {
          className: 'cell-center'
        }
      }
    ],
    [handleSelectOredrive]
  );

  if (loading) return <p>Loading...</p>;

  return (
    <MainCard title={oredrive} content={false} secondary={'Charged Rings'}>
      <ReactTable columns={columns} data={data} currentOredrive={oredrive} />
    </MainCard>
  );
}

EditAction.propTypes = { row: PropTypes.object, table: PropTypes.object };
ReactTable.propTypes = { columns: PropTypes.array, data: PropTypes.array, setData: PropTypes.any };
