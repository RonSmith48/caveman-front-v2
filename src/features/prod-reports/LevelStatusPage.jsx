import { useEffect, useState } from 'react';
import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import LevelTables from 'features/prod-reports/ProdStatusTables';
import LevelStatusMenu from 'features/prod-reports/LevelStatusMenu';
import { fetcher } from 'utils/axios';
import { enqueueSnackbar } from 'notistack';

export default function ProdLevelStatus() {
  const [data, setData] = useState([]);
  const [author, setAuthor] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLevelStatus = async () => {
      try {
        const response = await fetcher('/report/prod/level-status/');
        if (response?.data?.msg) {
          enqueueSnackbar(response.data.msg.body, { variant: response.data.msg.type });
        }
        setAuthor(response.data);
        setData(JSON.parse(response.data.report));
      } catch (error) {
        console.error('Error fetching level status report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevelStatus();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid',
          borderColor: 'grey.300' // or 'divider' for theme-consistent borders
        }}
      >
        <Box>
          <Typography variant="subtitle1">
            Report Date: {author.report_date} For: {author.shift}
          </Typography>
          <Typography variant="subtitle2">Author: {author.author.full_name}</Typography>
        </Box>
        <LevelStatusMenu data={data} author={author.author.full_name} date={author.report_date} shift={author.shift} />
      </Paper>

      <LevelTables data={data} />
    </Box>
  );
}
