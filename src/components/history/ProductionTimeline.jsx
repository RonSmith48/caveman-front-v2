import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import { Chip, Typography } from '@mui/material';

const getDotProps = (state) => {
  switch (state) {
    case 'Designed':
      return { color: 'primary' };
    case 'Drilled':
      return { color: 'warning' };
    case 'Charged':
      return { color: 'success' };
    case 'Fired':
      return { color: 'error' };
    case 'Bogging':
      return { color: 'secondary' };
    default:
      return { variant: 'outlined' };
  }
};

export default function ProductionTimeline({ entries, departmentLocked }) {
  if (!entries.length) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        No entries to show.
      </Typography>
    );
  }

  return (
    <Timeline position="right">
      {entries.map((entry, idx) => (
        <TimelineItem key={idx}>
          <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.15, minWidth: 110 }}>
            {entry.shift || 'Unknown'}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot {...(entry.source === 'state' ? getDotProps(entry.state) : { color: 'grey', variant: 'outlined' })} />
            {idx !== entries.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            {entry.source === 'state' ? (
              <>
                {entry.condition && entry.condition !== 'None' ? (
                  <Chip
                    label={entry.condition}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 0.5 }}
                    color={getDotProps(entry.state).color || 'default'}
                  />
                ) : (
                  <Typography variant="body2">{entry.state}</Typography>
                )}
                {!!entry.comment && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                    “{entry.comment}”
                  </Typography>
                )}
                {entry.user && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: !!entry.comment ? 0.5 : 1 }}>
                    {entry.user}
                  </Typography>
                )}
              </>
            ) : (
              <>
                {!!entry.comment && (
                  <Typography variant="caption" sx={{ fontStyle: 'italic', display: 'block', whiteSpace: 'pre-line' }}>
                    “{entry.comment}”
                  </Typography>
                )}
                {!departmentLocked && entry.department && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: !!entry.comment ? 0.5 : 1 }}>
                    {entry.user || ''}, {entry.department}
                  </Typography>
                )}
              </>
            )}
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
