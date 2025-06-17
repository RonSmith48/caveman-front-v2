// ParentChooser.jsx
import React, { useState, useEffect } from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import { fetcher } from 'utils/axiosBack';
import NorthArrow from 'components/third-party/konva/NorthArrow';
import ScaleBar from 'components/third-party/konva/ScaleBar';

const ParentChooser = ({
  orphanLocationId,
  onSelect,
  viewRadius = 15,
  showCandidates = true,
  showNearby = false,
  displayMode = 'none', // 'none' | 'cu' | 'au' | 'density'
  onHover = () => {}
}) => {
  const [orphan, setOrphan] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [nearbyRings, setNearbyRings] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [canvasSize, setCanvasSize] = useState(0);

  useEffect(() => {
    console.log('Fetching rings data for orphanLocationId:', orphanLocationId);
    if (!orphanLocationId) return;
    (async () => {
      try {
        const { data } = await fetcher(`/api/prod-concept/choose-parent/${orphanLocationId}/`);
        const o = data.orphan;
        setOrphan(o);
        const cands = data.candidates.map((r) => ({
          ...r,
          dist: Math.sqrt((r.x - o.x) ** 2 + (r.y - o.y) ** 2)
        }));
        setCandidates(cands);
        setNearbyRings(data.nearby_rings);
      } catch (err) {
        console.error('Error fetching rings data', err);
      }
    })();
  }, [orphanLocationId]);

  useEffect(() => {
    const resize = () => {
      const availH = window.innerHeight - 100;
      const availW = window.innerWidth;
      setCanvasSize(Math.min(availW, availH));
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  if (!orphan || canvasSize === 0) return <div className="text-center p-4">Loading…</div>;

  const scale = canvasSize / (2 * viewRadius);
  const center = canvasSize / 2;

  // Precompute min/max for color scales
  const values = candidates.map((r) => r[displayMode]);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);

  const toCanvas = (x, y) => ({ x: center + (x - orphan.x) * scale, y: center - (y - orphan.y) * scale });

  const handleSelect = (ring) => {
    setSelectedId(ring.id);
    onSelect?.(ring);
  };

  const hoveredNearby = nearbyRings.find((r) => r.id === hoveredId);

  return (
    <Stage width={canvasSize} height={canvasSize} style={{ width: canvasSize, height: canvasSize, border: '1px solid #bbb' }}>
      <Layer>
        <Rect x={0} y={0} width={canvasSize} height={canvasSize} fill="#f5f5f5" listening={false} />
        <Rect x={0} y={0} width={canvasSize} height={canvasSize} stroke="#333" strokeWidth={2} listening={false} />

        {/* Candidates */}
        {showCandidates &&
          candidates.map((ring) => {
            const pos = toCanvas(ring.x, ring.y);
            const isSelected = selectedId === ring.id;
            const isHovered = hoveredId === ring.id;

            let fillColor = 'gray';
            let opacity = 1;

            if (displayMode === 'none') {
              const isParent = ring.name === orphan.parent || (hoveredNearby && ring.name === hoveredNearby.parent);
              fillColor = isParent ? 'blue' : 'gray';
            } else {
              const val = ring[displayMode];
              const norm = maxVal > minVal ? (val - minVal) / (maxVal - minVal) : 1;
              opacity = 0.2 + 0.8 * norm;
              if (displayMode === 'density') fillColor = 'gray';
              if (displayMode === 'cu') fillColor = '#cd7f32'; // bronze
              if (displayMode === 'au') fillColor = '#ffd700'; // gold
            }

            return (
              <Circle
                key={ring.id}
                x={pos.x}
                y={pos.y}
                radius={scale * 1.3}
                fill={fillColor}
                opacity={opacity}
                stroke={isSelected ? 'gold' : isHovered ? 'black' : 'white'}
                strokeWidth={isSelected || isHovered ? 3 : 1}
                onClick={() => handleSelect(ring)}
                onMouseEnter={() => {
                  setHoveredId(ring.id);
                  onHover(ring);
                }}
                onMouseLeave={() => {
                  setHoveredId(null);
                  onHover(null);
                }}
                style={{ cursor: 'pointer' }}
              />
            );
          })}

        {/* Nearby rings */}
        {showNearby &&
          nearbyRings.map((ring) => {
            const pos = toCanvas(ring.x, ring.y);
            const isHovered = hoveredId === ring.id;
            const fillColor = isHovered && ring.parent ? 'blue' : 'white';

            return (
              <Circle
                key={ring.id}
                x={pos.x}
                y={pos.y}
                radius={scale * 0.5}
                fill={fillColor}
                stroke="black"
                strokeWidth={isHovered ? 3 : 1}
                onMouseEnter={() => {
                  setHoveredId(ring.id);
                  onHover(ring);
                }}
                onMouseLeave={() => {
                  setHoveredId(null);
                  onHover(null);
                }}
                listening
                style={{ cursor: 'pointer' }}
              />
            );
          })}

        {/* Orphan */}
        <Circle
          x={center}
          y={center}
          radius={scale * 0.5}
          fill={orphan.parent ? 'blue' : 'red'}
          stroke="black"
          strokeWidth={2}
          listening={false}
        />
        <NorthArrow canvasSize={canvasSize} padding={10} />
        <ScaleBar canvasSize={canvasSize} padding={10} scale={scale} meters={10} />
      </Layer>
    </Stage>
  );
};

export default ParentChooser;
