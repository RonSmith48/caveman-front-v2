'use client';
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
import { fetcher, fetcherPut, fetcherPost } from 'utils/axiosBack';
import ProfileAvatar from 'components/ProfileAvatar';
import { formatToShift } from 'utils/shkey';
import FireEditModal from 'features/bdcf/FireEditModal';

// assets
import EditTwoTone from '@ant-design/icons/EditTwoTone';

function EditAction({ location_id, handleSelectLevel, level }) {
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
      <FireEditModal
        open={openModal}
        onClose={handleClose}
        location_id={selectedLocationId}
        handleSelectLevel={handleSelectLevel}
        level={level}
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

export default function BDCFFireTable({ level, ringData, handleSelectLevel, isFiring }) {
  const [data, setData] = useState(ringData);
  const [firing, setFiring] = useState(isFiring);
  const [loading, setLoading] = useState(true);
  const SM_AVATAR_SIZE = 32;

  useEffect(() => {
    setData(ringData); // Update table data when ringData changes
    setFiring(isFiring);
    setLoading(false);
    console.log(ringData);
  }, [ringData]);

  // Memoize columns outside of any conditional statement
  const columns = useMemo(
    () => [
      {
        header: 'Fired',
        accessorKey: 'fired_shift', // Key from your data source
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
        header: 'Alias',
        accessorKey: 'alias',
        cell: (info) => info.getValue()
      },
      {
        header: 'Remaining',
        accessorKey: 'remaining',
        cell: (info) => {
          const value = info.getValue();
          let bgColor = '';

          if (value >= -250 && value <= 250) {
            bgColor = '#d3f8d3'; // Green for values between -250 and 250
          } else if (value < -250 || (value > 250 && firing)) {
            bgColor = '#ffcccc'; // Red for values < -250 OR > 250 when isFiring is true
          }

          return <div style={{ backgroundColor: bgColor, padding: '8px', textAlign: 'right' }}>{value}</div>;
        },
        meta: {
          className: 'cell-right'
        }
      },

      {
        header: 'Contributor',
        accessorKey: 'contributor',
        cell: (info) => {
          const contributor = info.getValue();
          return contributor ? (
            <Tooltip title={contributor.full_name}>
              <div
                style={{
                  width: SM_AVATAR_SIZE,
                  height: SM_AVATAR_SIZE,
                  backgroundColor: contributor?.bg_colour,
                  borderRadius: '50%', // Makes the background a circle
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden' // Ensures the avatar stays inside the circle
                }}
              >
                <ProfileAvatar user={contributor} size={SM_AVATAR_SIZE} />
              </div>
            </Tooltip>
          ) : (
            <Tooltip title="Legacy PMD">
              <div>
                <AssistWalkerOutlinedIcon fontSize="large" />
              </div>
            </Tooltip>
          );
        },
        meta: {
          className: 'cell-center'
        }
      },
      {
        header: 'Actions',
        id: 'location_id',
        cell: (info) => (
          <EditAction
            location_id={info.row.original.location_id} // Explicitly pass location_id
            handleSelectLevel={handleSelectLevel}
            level={level}
          />
        ),
        meta: {
          className: 'cell-center'
        }
      }
    ],
    [handleSelectLevel, firing]
  );

  if (loading) return <p>Loading...</p>;

  return (
    <MainCard title={level} content={false} secondary={'Fired Rings'}>
      <ReactTable columns={columns} data={data} currentOredrive={level} />
    </MainCard>
  );
}

EditAction.propTypes = { row: PropTypes.object, table: PropTypes.object };
ReactTable.propTypes = { columns: PropTypes.array, data: PropTypes.array, setData: PropTypes.any };
