import PropTypes from 'prop-types';

import { useMemo, useState, useEffect } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

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
import { fetcher, fetcherPut, fetcherDelete } from 'utils/axios';
import ProfileAvatar from 'components/ProfileAvatar';

// assets
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import EditTwoTone from '@ant-design/icons/EditTwoTone';
import SendOutlined from '@ant-design/icons/SendOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';

function EditAction({ row, table, fetchBoggingEntries }) {
  const meta = table?.options?.meta;

  const setSelectedRow = (e) => {
    meta?.setSelectedRow((old) => ({
      ...old,
      [row.id]: !old[row.id]
    }));

    // @ts-ignore
    meta?.revertData(row.index, e?.currentTarget.name === 'cancel');
  };

  const handleDelete = async () => {
    const rowId = row.original.id;
    try {
      const response = await fetcherDelete(`/prod-actual/bdcf/bog/${rowId}/`);
      if (response.status === 204) {
        enqueueSnackbar('Record deleted successfully', { variant: 'success' });
        fetchBoggingEntries();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.msg?.body || 'An unexpected error occurred';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    const rowId = row.original.id;
    const updatedTonnes = row.original.tonnes; // Assume tonnes is being edited

    try {
      const response = await fetcherPut(`/prod-actual/bdcf/bog/${rowId}/`, { tonnes: updatedTonnes });
      if (response.status === 200) {
        enqueueSnackbar('Record updated successfully', { variant: 'success' });
        fetchBoggingEntries(); // Refresh table after update
        setSelectedRow();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.msg?.body || 'An unexpected error occurred';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      console.log(error);
    }
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {meta?.selectedRow[row.id] && (
        <>
          {/* Cancel Button */}
          <Tooltip title="Cancel">
            <IconButton color="primary" name="cancel" onClick={setSelectedRow}>
              <CloseOutlined />
            </IconButton>
          </Tooltip>

          {/* Delete Button (Only visible in edit mode) */}
          <Tooltip title="Delete">
            <IconButton color="error" onClick={handleDelete}>
              <DeleteOutlined />
            </IconButton>
          </Tooltip>
        </>
      )}

      <Tooltip title={meta?.selectedRow[row.id] ? 'Save' : 'Edit'}>
        <IconButton
          color={meta?.selectedRow[row.id] ? 'success' : 'primary'}
          onClick={meta?.selectedRow[row.id] ? handleUpdate : setSelectedRow}
        >
          {meta?.selectedRow[row.id] ? <SendOutlined /> : <EditTwoTone />}
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, setData }) {
  const [originalData, setOriginalData] = useState(() => [...data]);
  const [selectedRow, setSelectedRow] = useState({});

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      cell: RowEditable
    },
    getCoreRowModel: getCoreRowModel(),
    meta: {
      selectedRow,
      setSelectedRow,
      revertData: (rowIndex, revert) => {
        if (revert) {
          setData((old) => old.map((row, index) => (index === rowIndex ? originalData[rowIndex] : row)));
        } else {
          setOriginalData((old) => old.map((row, index) => (index === rowIndex ? data[rowIndex] : row)));
        }
      },
      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value
              };
            }
            return row;
          })
        );
      }
    },
    debugTable: true
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
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    Nothing bogged yet
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </ScrollX>
    </MainCard>
  );
}

// ==============================|| REACT TABLE - EDITABLE ROW ||============================== //

export default function BDCFBogTable({ location_id, ringName, refreshKey }) {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const SM_AVATAR_SIZE = 32;

  const fetchBoggingEntries = async () => {
    if (!location_id) return; // Skip fetch if location_id is not available
    setLoading(true);
    try {
      const response = await fetcher(`/prod-actual/bdcf/bog/${location_id}`);
      setData(response.data.data);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching active rings list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoggingEntries();
  }, [location_id, refreshKey]);

  // Memoize columns outside of any conditional statement
  const columns = useMemo(
    () => [
      {
        header: 'Date',
        accessorKey: 'date',
        dataType: 'text',
        cell: ({ row }) => {
          return row.original.date;
        }
      },
      {
        header: 'Tonnes',
        accessorKey: 'tonnes',
        dataType: 'int',
        meta: {
          className: 'cell-right'
        }
      },
      {
        header: 'Entered (timestamp)',
        accessorKey: 'timestamp',
        dataType: 'text',
        cell: ({ row }) => {
          const date = new Date(row.original.timestamp);
          return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          }).format(date);
        }
      },
      {
        header: 'Contributor',
        accessorKey: 'contributor',
        dataType: 'text',
        cell: ({ row }) => {
          const contributor = row.original.contributor;
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
        id: 'edit',
        cell: (props) => <EditAction {...props} fetchBoggingEntries={fetchBoggingEntries} />,
        meta: {
          className: 'cell-center'
        }
      }
    ],
    [fetchBoggingEntries]
  );

  // Ensure consistent render order by checking loading status outside of the main return
  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <MainCard sx={{ mb: 2 }} content={false}>
        <CardContent>
          <Typography variant="h5">{ringName}</Typography>
          {/*           <Typography variant="body1" sx={{ textAlign: 'right', mt: 2 }}>
            Adding stats here.
          </Typography> */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">{stats.in_flow ? 'Flow' : 'Insitu'}</Typography>
              <Typography variant="h6">Tonnes</Typography>
              <Typography variant="body1">({stats.designed_tonnes}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', alignSelf: 'flex-end' }}>
              <Typography variant="body1">x</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">Draw</Typography>
              <Typography variant="h6">Ratio</Typography>
              <Typography variant="body1">{stats.draw_percentage})</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', alignSelf: 'flex-end' }}>
              <Typography variant="body1">+</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">Draw</Typography>
              <Typography variant="h6">Deviation</Typography>
              <Typography variant="body1">{stats.draw_deviation}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', alignSelf: 'flex-end' }}>
              <Typography variant="body1">+</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">Geology</Typography>
              <Typography variant="h6">Overdraw</Typography>
              <Typography variant="body1">{stats.overdraw_amount}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', alignSelf: 'flex-end' }}>
              <Typography variant="body1">-</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">Bogged</Typography>
              <Typography variant="h6">Tonnes</Typography>
              <Typography variant="body1">{stats.bogged_tonnes}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', alignSelf: 'flex-end' }}>
              <Typography variant="body1">=</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">Remaining</Typography>
              <Typography variant="h6">Tonnes</Typography>
              <Typography variant="h5">
                {/* {Math.round(
                  stats.designed_tonnes * stats.draw_percentage + stats.draw_deviation + stats.overdraw_amount - stats.bogged_tonnes
                )} */}
                {stats.remaining}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </MainCard>

      {/* Table */}
      <Box sx={{ mt: 2 }}>
        <ReactTable {...{ data, columns, setData }} />
      </Box>
    </div>
  );
}

EditAction.propTypes = { row: PropTypes.object, table: PropTypes.object };
ReactTable.propTypes = { columns: PropTypes.array, data: PropTypes.array, setData: PropTypes.any };
