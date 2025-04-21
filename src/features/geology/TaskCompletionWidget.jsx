import React, { useState, useEffect } from 'react';
import { Box, Avatar, Tooltip, IconButton, Typography, Dialog, DialogTitle, DialogContent, Card, CardContent } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TodayIcon from '@mui/icons-material/Today';
import dayjs from 'dayjs';

const TaskCompletionWidget = () => {
  const [currentOffset, setCurrentOffset] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getDaysToShow = () => {
    const today = dayjs().subtract(currentOffset, 'day');
    return [today.subtract(2, 'day'), today.subtract(1, 'day'), today];
  };

  const daysToShow = getDaysToShow();

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <IconButton onClick={() => setCurrentOffset((prev) => prev + 1)}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="subtitle1" sx={{ flex: 1, textAlign: 'left' }}>
            Dome Entries Task
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => setCurrentOffset(0)}>
              <TodayIcon />
            </IconButton>
            <IconButton onClick={() => setDialogOpen(true)}>
              <CalendarMonthIcon />
            </IconButton>
          </Box>

          <IconButton onClick={() => setCurrentOffset((prev) => Math.max(prev - 1, 0))} disabled={currentOffset === 0}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          {daysToShow.map((day) => {
            const dateStr = day.format('YYYY-MM-DD');
            const user = mockData[dateStr]?.user || null;
            return (
              <Box
                key={dateStr}
                sx={{
                  flex: 1,
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  padding: 2,
                  textAlign: 'center',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  {day.format('MMM D (ddd)')}
                </Typography>
                {user ? (
                  <Tooltip title={user}>
                    <Avatar sx={{ width: 48, height: 48, mx: 'auto' }}>{user[0]}</Avatar>
                  </Tooltip>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Not Completed
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
      </CardContent>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Task Completion - Full Month</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Array.from({ length: dayjs().daysInMonth() }, (_, i) => {
              const date = dayjs().startOf('month').add(i, 'day');
              const dateStr = date.format('YYYY-MM-DD');
              const user = mockData[dateStr]?.user || null;
              return (
                <Box
                  key={dateStr}
                  sx={{
                    width: 'calc(33.33% - 8px)',
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    p: 1,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="caption">{date.format('MMM D')}</Typography>
                  {user ? (
                    <Tooltip title={user}>
                      <Avatar sx={{ width: 32, height: 32, mx: 'auto', mt: 1 }}>{user[0]}</Avatar>
                    </Tooltip>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      ❌
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const mockData = {
  '2025-04-17': { user: 'Alice' },
  '2025-04-19': { user: 'Ron' },
  '2025-04-01': { user: 'Ron' },
  '2025-04-05': { user: 'Alice' },
  '2025-04-10': { user: 'Bob' },
  '2025-04-11': { user: 'Ron' },
  '2025-04-12': { user: 'Ron' },
  '2025-04-14': { user: 'Alice' }
};

export default TaskCompletionWidget;
