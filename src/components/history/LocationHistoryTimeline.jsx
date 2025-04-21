import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { fetcher } from 'utils/axios';
import TimelineFilterMenu from './TimelineFilterMenu';
import ProductionTimeline from './ProductionTimeline';

export default function LocationHistoryTimeline({ location_id, defaultSources = ['state', 'comments'], showMenu = true, filter = {} }) {
  const [timelineData, setTimelineData] = useState([]);
  const [prodDevCode, setProdDevCode] = useState(null);
  const [visibleSources, setVisibleSources] = useState(defaultSources);
  const [departmentFilter, setDepartmentFilter] = useState(filter.department || 'All');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const departmentLocked = !!filter.department;
  const showDeptDropdown = filter.showDepartmentDropdown && !departmentLocked;

  useEffect(() => {
    if (!location_id) return;

    setLoading(true);
    fetcher(`/report/location-history/${location_id}/`).then((res) => {
      const timeline = res.data.timeline || [];
      setTimelineData(timeline);
      setProdDevCode(res.data.prod_dev_code || null);

      const deptSet = new Set(timeline.filter((entry) => entry.source === 'comments' && entry.department).map((entry) => entry.department));
      setDepartments(['All', ...Array.from(deptSet).sort()]);
      setLoading(false);
    });
  }, [location_id]);

  const toggleSource = (source) => {
    setVisibleSources((prev) => (prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]));
  };

  const filteredTimeline = timelineData.filter((entry) => {
    if (!visibleSources.includes(entry.source)) return false;

    if (entry.source === 'comments') {
      return departmentFilter === 'All' || entry.department === departmentFilter;
    }

    return true;
  });

  const renderTimeline = () => {
    switch (prodDevCode) {
      case 'p':
        return <ProductionTimeline entries={filteredTimeline} departmentLocked={departmentLocked} />;
      case 'd':
      case 'c':
      case 'i':
        return (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Timeline view not yet implemented for this location type.
          </Typography>
        );
      default:
        return (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Unknown location type.
          </Typography>
        );
    }
  };

  if (!location_id) return null;
  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Location History
      </Typography>

      {showMenu && (
        <TimelineFilterMenu
          visibleSources={visibleSources}
          toggleSource={toggleSource}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          departments={departments}
          departmentLocked={departmentLocked}
        />
      )}

      {renderTimeline()}
    </Box>
  );
}
