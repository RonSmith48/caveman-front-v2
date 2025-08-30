import React, { useState } from 'react';
// material-ui
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// project imports
import MainCard from 'components/MainCard';
import CSVExport from 'components/third-party/react-table/CSVExport';
import { fetcher } from 'utils/axiosBack';
import RingInspectModal from 'features/cave-manager/ring-inspector/RingInspectModalVersion';

export const header = [
  { label: 'Ore Drive', key: 'name' },
  { label: 'Bogging', key: 'name' },
  { label: 'Avail Tonnes', key: 'avail_tonnes' },
  { label: 'Bogging Comments', key: 'comment' },
  { label: 'Drilled to', key: 'drilled' },
  { label: 'Charged Rings', key: 'charged' }
];

// ==============================|| MUI TABLE - CUSTOMIZED FOR LEVELS ||============================== //
export default function LevelTables({ data }) {
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleOpen = (locationId) => {
    setSelectedLocation(locationId);
    console.log('Opening Ring Inspector for location:', locationId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedLocation(null);
  };

  const formatDate = (isoDate) => {
    try {
      return new Date(isoDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
    } catch {
      return isoDate;
    }
  };

  return (
    <>
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

      {data.map((levelData) => (
        <Box key={levelData.level} mb={2}>
          <MainCard key={levelData.level} content={false} title={`Level ${levelData.level}`}>
            <TableContainer>
              <Table sx={{ minWidth: 350 }} aria-label={`Level ${levelData.level} table`}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ pl: 3 }}>Ore Drive</TableCell>
                    <TableCell align="right">Bogging</TableCell>
                    <TableCell align="right">Avail Tonnes</TableCell>
                    <TableCell align="center">Bogging Comments</TableCell>
                    <TableCell align="right">Drilled to</TableCell>
                    <TableCell align="right">Charged Rings</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {levelData.ore_drives.map((oredrive) => (
                    <TableRow hover key={oredrive.name}>
                      <TableCell sx={{ pl: 3 }} component="th" scope="row">
                        {oredrive.name}
                      </TableCell>
                      <TableCell align="right">
                        <Link component="button" underline="hover" onClick={() => handleOpen(oredrive.bogging.location_id)}>
                          {oredrive.bogging.ring_txt}
                        </Link>
                      </TableCell>
                      <TableCell align="right" sx={oredrive.bogging.is_overbogged ? { fontWeight: 'bold', color: 'error.main' } : {}}>
                        {parseInt(oredrive.bogging.avail_tonnes, 10)}
                      </TableCell>
                      <TableCell align="left">
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          {(oredrive.bogging.conditions || []).map((condition, index) => (
                            <Chip key={index} label={condition} variant="outlined" color="primary" size="small" />
                          ))}
                          {oredrive.bogging.comment && (
                            <Typography component="span" sx={{ ml: 1 }}>
                              {oredrive.bogging.comment}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>

                      <TableCell align="right">
                        {(() => {
                          const drilled = oredrive.drilled || {};
                          const last = drilled.last_drilled;
                          const problemRings = drilled.problem_rings || [];

                          if (!last && problemRings.length === 0) {
                            return (
                              <Typography component="span" sx={{ color: 'grey.500', fontStyle: 'italic' }}>
                                —
                              </Typography>
                            );
                          }

                          // Build list of items with text, problem flag, location, and condition
                          const items = [];
                          for (const p of problemRings) {
                            items.push({
                              text: p.ring_number_txt,
                              isProblem: true,
                              locationId: p.location_id,
                              condition: p.condition
                            });
                          }
                          if (last && !problemRings.some((p) => p.ring_number_txt === last)) {
                            items.push({ text: last, isProblem: false });
                          }

                          return items.map((item, index) => {
                            const content = item.isProblem ? (
                              <Tooltip key={item.text} title={item.condition} arrow>
                                <Badge
                                  badgeContent={
                                    <Link component="button" underline="hover" onClick={() => handleOpen(item.locationId)}>
                                      {item.text}
                                    </Link>
                                  }
                                  max={999}
                                  overlap="circular"
                                  sx={{ mx: 0.8 }}
                                  color="#000"
                                >
                                  <WarningAmberIcon fontSize="small" color="warning" />
                                </Badge>
                              </Tooltip>
                            ) : (
                              <Typography key={item.text} component="span">
                                {item.text}
                              </Typography>
                            );

                            return (
                              <React.Fragment key={item.text}>
                                {content}
                                {index < items.length - 1 && ', '}
                              </React.Fragment>
                            );
                          });
                        })()}
                      </TableCell>
                      <TableCell align="right">
                        {/* Charged rings A-Z, overslept with date */}
                        {(() => {
                          const charges = [...(oredrive.charged || [])];
                          charges.sort((a, b) =>
                            `${a.ring}${a.detonator ? a.detonator.charAt(0).toLowerCase() : ''}`.localeCompare(
                              `${b.ring}${b.detonator ? b.detonator.charAt(0).toLowerCase() : ''}`
                            )
                          );
                          if (charges.length === 0) return <Typography sx={{ color: 'grey.500', fontStyle: 'italic' }}>—</Typography>;

                          return (
                            <Typography component="span" sx={{ display: 'inline', whiteSpace: 'normal' }}>
                              {charges.map((c, i) => {
                                const key = `${c.ring}${c.detonator ? c.detonator.charAt(0).toLowerCase() : ''}`;
                                const overslept = c.is_overslept;
                                const text = overslept && c.fireby_date ? `${key} (${formatDate(c.fireby_date)})` : key;

                                return (
                                  <React.Fragment key={key}>
                                    <Box
                                      component="span"
                                      sx={{
                                        fontWeight: overslept ? 'bold' : 'normal',
                                        color: overslept ? 'error.main' : 'inherit',
                                        whiteSpace: 'nowrap'
                                      }}
                                    >
                                      {text}
                                    </Box>
                                    {i < charges.length - 1 && ', '}
                                  </React.Fragment>
                                );
                              })}
                            </Typography>
                          );
                        })()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MainCard>
        </Box>
      ))}
    </>
  );
}
