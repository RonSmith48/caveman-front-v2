import React from 'react';
import { FormControl, Grid2, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Box } from '@mui/material';

const SOURCE_OPTIONS = {
  state: 'Status Changes',
  comments: 'Comments'
};

export default function TimelineFilterMenu({
  visibleSources,
  toggleSource,
  departmentFilter,
  setDepartmentFilter,
  departments,
  departmentLocked
}) {
  return (
    <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
      {Object.entries(SOURCE_OPTIONS).map(([key, label]) => (
        <FormControlLabel
          key={key}
          control={<Checkbox checked={visibleSources.includes(key)} onChange={() => toggleSource(key)} />}
          label={label}
        />
      ))}

      {!departmentLocked && (
        <FormControl sx={{ minWidth: 260 }} size="small">
          <InputLabel id="dept-filter-label">Department</InputLabel>
          <Select
            labelId="dept-filter-label"
            value={departmentFilter}
            label="Department"
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
}
