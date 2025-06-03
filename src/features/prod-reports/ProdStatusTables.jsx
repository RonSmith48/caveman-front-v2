import React from 'react';
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

// project imports
import MainCard from 'components/MainCard';
import CSVExport from 'components/third-party/react-table/CSVExport';
import { fetcher } from 'utils/axiosBack';

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
  return (
    <>
      {data.map((levelData) => (
        <Box key={levelData.level} mb={2}>
          <MainCard key={levelData.level} content={false} title={`Level ${levelData.level}`}>
            <TableContainer>
              <Table sx={{ minWidth: 350 }} aria-label={`Level ${levelData.level} table`}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ pl: 3 }}>Ore Drive</TableCell>
                    <TableCell align="right">P</TableCell>
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
                      <TableCell></TableCell>
                      <TableCell align="right">{oredrive.bogging.ring_txt}</TableCell>
                      <TableCell align="right" sx={oredrive.bogging.is_overbogged ? { fontWeight: 'bold', color: 'error.main' } : {}}>
                        {parseInt(oredrive.bogging.avail_tonnes, 10)}
                      </TableCell>
                      <TableCell align="left">
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center', gap: 0.5 }}>
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

                          // Nothing to display
                          if (!last && problemRings.length === 0) {
                            return (
                              <Typography component="span" sx={{ color: 'grey.500', fontStyle: 'italic' }}>
                                —
                              </Typography>
                            );
                          }
                          // Build a lookup for conditions
                          const conditionLookup = {};
                          for (const p of problemRings) {
                            conditionLookup[p.ring_number_txt] = p.condition;
                          }

                          const problemSet = new Set(Object.keys(conditionLookup));
                          // Create a unique list of ring numbers to show (avoid duplicates)
                          const ringSet = new Set(problemRings.map((p) => p.ring_number_txt));
                          if (last) ringSet.add(last);

                          const ringList = Array.from(ringSet);

                          return ringList.map((ring, index) => {
                            const isProblem = problemSet.has(ring);
                            const content = isProblem ? (
                              <Tooltip title={conditionLookup[ring]} arrow>
                                <Badge badgeContent={ring} overlap="circular" sx={{ mx: 0.8 }} color="#000">
                                  <WarningAmberIcon fontSize="small" color="warning" />
                                </Badge>
                              </Tooltip>
                            ) : (
                              <Typography component="span">{ring}</Typography>
                            );

                            return (
                              <React.Fragment key={ring}>
                                {content}
                                {index < ringList.length - 1 && ', '}
                              </React.Fragment>
                            );
                          });
                        })()}
                      </TableCell>
                      <TableCell align="right">
                        {(oredrive.charged || []).length > 0 ? (
                          oredrive.charged.map((charge, index) => {
                            const detonatorInitial = charge.detonator ? charge.detonator.charAt(0).toLowerCase() : '';
                            const ringWithDetonator = `${charge.ring}${detonatorInitial}`;

                            const styles = charge.is_overslept ? { fontWeight: 'bold', color: 'error.main' } : {};

                            return (
                              <React.Fragment key={index}>
                                <Typography component="span" sx={styles}>
                                  {ringWithDetonator}
                                </Typography>
                                {index < oredrive.charged.length - 1 && (
                                  <Typography component="span" sx={{ color: 'black', fontWeight: 'normal' }}>
                                    {', '}
                                  </Typography>
                                )}
                              </React.Fragment>
                            );
                          })
                        ) : (
                          <Typography component="span" sx={{ color: 'grey.500', fontStyle: 'italic' }}>
                            —
                          </Typography>
                        )}
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
