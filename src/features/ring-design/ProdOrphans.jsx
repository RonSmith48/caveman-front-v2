import PropTypes from 'prop-types';

import { useEffect, useMemo, useState } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Chip, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack } from '@mui/material';

// third-party
import { flexRender, useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';

// project import
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import TablePagination from 'components/third-party/react-table/TablePagination';
import CSVExport from 'components/third-party/react-table/CSVExport';
import SelectColumnVisibility from 'components/third-party/react-table/SelectColumnVisibility';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';

import { fetcher } from 'utils/axios';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data }) {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [columnVisibility, setColumnVisibility] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true
  });

  useEffect(
    () =>
      setColumnVisibility({
        id: false,
        // alias: true,
        area_rehab: false,
        azimuth: false,
        blastsolids_volume: false,
        bog_complete: false,
        bogged_tonnes: false,
        burden: false,
        cable_bolted: false,
        charge_date: false,
        comment: false,
        concept_ring: false,
        description: false,
        design_date: false,
        designed_emulsion_kg: false,
        designed_to_suit: false,
        designed_tonnes: false,
        detonator_actual: false,
        detonator_designed: false,
        diameters: false,
        dist_to_eop: false,
        dist_to_wop: false,
        draw_deviation: false,
        draw_percentage: false,
        drill_complete_date: false,
        drill_look_direction: false,
        drill_meters: false,
        drilled_meters: false,
        dump: false,
        fault: false,
        fireby_date: false,
        fired_shift: false,
        has_bg_report: false,
        has_blocked_holes: false,
        has_geo_dome_entry: false,
        has_pyrite: false,
        has_ungrouted_ddh: false,
        hole_data: false,
        holes: false,
        in_flow: false,
        in_overdraw_zone: false,
        in_water_zone: false,
        is_active: false,
        is_making_water: false,
        is_prox_to_void: false,
        is_redrilled: false,
        level: false,
        location_id: false,
        markup_date: false,
        markup_for: false,
        mineral3: false,
        mineral4: false,
        multi_fire_group: false,
        num_recharged_holes: false,
        oredrive: false,
        overdraw_amount: false,
        prod_dev_code: false,
        ring_number_txt: false,
        //status: false,
        x: false,
        y: false,
        z: false
      }),
    []
  );

  let headers = [];
  table.getVisibleLeafColumns().map((columns) =>
    headers.push({
      label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
      // @ts-ignore
      key: columns.columnDef.accessorKey
    })
  );

  return (
    <MainCard
      content={false}
      title={matchDownSM ? 'Column' : 'Orphaned Production Rings'}
      secondary={
        <Stack direction="row" alignItems="center" pl={1} spacing={{ xs: 1, sm: 2 }}>
          <SelectColumnVisibility
            {...{
              getVisibleLeafColumns: table.getVisibleLeafColumns,
              getIsAllColumnsVisible: table.getIsAllColumnsVisible,
              getToggleAllColumnsVisibilityHandler: table.getToggleAllColumnsVisibilityHandler,
              getAllColumns: table.getAllColumns
            }}
          />
          <CSVExport {...{ data, headers, filename: 'Orphaned production rings.csv' }} />
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
            {...{
              setPageSize: table.setPageSize,
              setPageIndex: table.setPageIndex,
              getState: table.getState,
              getPageCount: table.getPageCount
            }}
          />
        </Box>
      </ScrollX>
    </MainCard>
  );
}

// ==============================|| REACT TABLE - VISIBILITY ||============================== //

export default function ProdOrphans({ data }) {
  const columns = useMemo(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
        title: 'Id',
        meta: {
          className: 'cell-center'
        }
      },
      {
        header: 'Alias',
        accessorKey: 'alias'
      },
      {
        header: 'Area Rehab',
        accessorKey: 'area_rehab'
      },
      {
        header: 'Azimuth',
        accessorKey: 'azimuth'
      },
      {
        header: 'Blastsolids Volume',
        accessorKey: 'blastsolids_volume'
      },
      {
        header: 'Bog Complete',
        accessorKey: 'bog_complete'
      },
      {
        header: 'Bogged Tonnes',
        accessorKey: 'bogged_tonnes'
      },
      {
        header: 'Burden',
        accessorKey: 'burden'
      },
      {
        header: 'Cable Bolted',
        accessorKey: 'cable_bolted'
      },
      {
        header: 'Charge Date',
        accessorKey: 'charge_date'
      },
      {
        header: 'Comment',
        accessorKey: 'comment'
      },
      {
        header: 'Concept Ring',
        accessorKey: 'concept_ring'
      },
      {
        header: 'Description',
        accessorKey: 'description'
      },
      {
        header: 'Design Date',
        accessorKey: 'design_date'
      },
      {
        header: 'Designed Emulsion Kg',
        accessorKey: 'designed_emulsion_kg'
      },
      {
        header: 'Designed To Suit',
        accessorKey: 'designed_to_suit'
      },
      {
        header: 'Designed Tonnes',
        accessorKey: 'designed_tonnes'
      },
      {
        header: 'Detonator Actual',
        accessorKey: 'detonator_actual'
      },
      {
        header: 'Detonator Designed',
        accessorKey: 'detonator_designed'
      },
      {
        header: 'Diameters',
        accessorKey: 'diameters'
      },
      {
        header: 'Dist To Eop',
        accessorKey: 'dist_to_eop'
      },
      {
        header: 'Dist To Wop',
        accessorKey: 'dist_to_wop'
      },
      {
        header: 'Draw Deviation',
        accessorKey: 'draw_deviation'
      },
      {
        header: 'Draw Percentage',
        accessorKey: 'draw_percentage'
      },
      {
        header: 'Drill Complete Date',
        accessorKey: 'drill_complete_date'
      },
      {
        header: 'Drill Look Direction',
        accessorKey: 'drill_look_direction'
      },
      {
        header: 'Drill Meters',
        accessorKey: 'drill_meters'
      },
      {
        header: 'Drilled Meters',
        accessorKey: 'drilled_meters'
      },
      {
        header: 'Dump',
        accessorKey: 'dump'
      },
      {
        header: 'Fault',
        accessorKey: 'fault'
      },
      {
        header: 'Fireby Date',
        accessorKey: 'fireby_date'
      },
      {
        header: 'Fired Shift',
        accessorKey: 'fired_shift'
      },
      {
        header: 'Has Bg Report',
        accessorKey: 'has_bg_report'
      },
      {
        header: 'Has Blocked Holes',
        accessorKey: 'has_blocked_holes'
      },
      {
        header: 'Has Geo Dome Entry',
        accessorKey: 'has_geo_dome_entry'
      },
      {
        header: 'Has Pyrite',
        accessorKey: 'has_pyrite'
      },
      {
        header: 'Has Ungrouted Ddh',
        accessorKey: 'has_ungrouted_ddh'
      },
      {
        header: 'Hole Data',
        accessorKey: 'hole_data'
      },
      {
        header: 'Holes',
        accessorKey: 'holes'
      },
      {
        header: 'In Flow',
        accessorKey: 'in_flow'
      },
      {
        header: 'In Overdraw Zone',
        accessorKey: 'in_overdraw_zone'
      },
      {
        header: 'In Water Zone',
        accessorKey: 'in_water_zone'
      },
      {
        header: 'Is Active',
        accessorKey: 'is_active'
      },
      {
        header: 'Is Making Water',
        accessorKey: 'is_making_water'
      },
      {
        header: 'Is Prox To Void',
        accessorKey: 'is_prox_to_void'
      },
      {
        header: 'Is Redrilled',
        accessorKey: 'is_redrilled'
      },
      {
        header: 'Level',
        accessorKey: 'level'
      },
      {
        header: 'Location Id',
        accessorKey: 'location_id'
      },
      {
        header: 'Markup Date',
        accessorKey: 'markup_date'
      },
      {
        header: 'Markup For',
        accessorKey: 'markup_for'
      },
      {
        header: 'Mineral3',
        accessorKey: 'mineral3'
      },
      {
        header: 'Mineral4',
        accessorKey: 'mineral4'
      },
      {
        header: 'Multi Fire Group',
        accessorKey: 'multi_fire_group'
      },
      {
        header: 'Num Recharged Holes',
        accessorKey: 'num_recharged_holes'
      },
      {
        header: 'Oredrive',
        accessorKey: 'oredrive'
      },
      {
        header: 'Overdraw Amount',
        accessorKey: 'overdraw_amount'
      },
      {
        header: 'Prod Dev Code',
        accessorKey: 'prod_dev_code'
      },
      {
        header: 'Ring Number Txt',
        accessorKey: 'ring_number_txt'
      },
      {
        header: 'Status',
        accessorKey: 'status'
      },
      {
        header: 'X',
        accessorKey: 'x'
      },
      {
        header: 'Y',
        accessorKey: 'y'
      },
      {
        header: 'Z',
        accessorKey: 'z'
      }
    ],
    []
  );

  return <ReactTable {...{ columns, data }} />;
}

ReactTable.propTypes = { columns: PropTypes.array, data: PropTypes.array };
