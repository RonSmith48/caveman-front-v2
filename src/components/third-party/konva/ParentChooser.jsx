import React, { useState, useEffect } from 'react';
import useImage from 'use-image';
import { Stage, Layer, Rect, Circle, Label, Tag, Text, Image as KonvaImage, Line } from 'react-konva';
import { fetcher } from 'utils/axiosBack';
import NorthArrow from 'components/third-party/konva/NorthArrow';
import ScaleBar from 'components/third-party/konva/ScaleBar';

const ParentChooser = ({ orphanLocationId, onSelect, viewRadius = 15 }) => {
  const [orphan, setOrphan] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [canvasSize, setCanvasSize] = useState(0);

  // Load candidate/orphan data
  useEffect(() => {
    if (!orphanLocationId) return;
    (async () => {
      try {
        const { data } = await fetcher(`/api/prod-concept/choose-parent/${orphanLocationId}/`);
        setOrphan(data.orphan);
        setCandidates(data.candidates);
      } catch (err) {
        console.error('Error fetching candidate rings', err);
      }
    })();
  }, [orphanLocationId]);

  // Responsive canvas sizing
  useEffect(() => {
    const resize = () => {
      const availH = window.innerHeight - 64;
      const availW = window.innerWidth;
      setCanvasSize(Math.min(availW, availH));
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  if (!orphan || canvasSize === 0) {
    return <div className="text-center p-4">Loading rings…</div>;
  }

  // world-to-canvas scale (px per meter)
  const scale = canvasSize / (2 * viewRadius);
  const center = canvasSize / 2;
  const padding = 10;

  const toCanvas = (x, y) => ({
    x: center + (x - orphan.x) * scale,
    y: center - (y - orphan.y) * scale
  });

  const handleSelect = (id) => {
    setSelectedId(id);
    onSelect?.(id);
  };

  return (
    <Stage
      width={canvasSize}
      height={canvasSize}
      style={{
        width: canvasSize,
        height: canvasSize,
        border: '1px solid #bbb',
        float: 'left',
        marginRight: '16px'
      }}
    >
      <Layer>
        {/* canvas background */}
        <Rect x={0} y={0} width={canvasSize} height={canvasSize} fill="#f5f5f5" listening={false} />

        {/* boundary */}
        <Rect x={0} y={0} width={canvasSize} height={canvasSize} stroke="#333" strokeWidth={2} listening={false} />

        {/* North arrow */}
        <NorthArrow canvasSize={canvasSize} padding={padding} />

        {/* Scale bar (e.g., 10m) */}
        <ScaleBar canvasSize={canvasSize} padding={padding} scale={scale} meters={10} />

        {/* candidate concept rings */}
        {candidates.map((ring) => {
          const pos = toCanvas(ring.x, ring.y);
          const isSelected = selectedId === ring.id;
          const isHovered = hoveredId === ring.id;
          const color = 'gray';
          const radius = scale * 1; // 1m radius

          return (
            <React.Fragment key={ring.id}>
              <Circle
                x={pos.x}
                y={pos.y}
                radius={radius}
                fill={color}
                stroke={isSelected ? 'gold' : 'black'}
                strokeWidth={isSelected ? 3 : 1}
                onClick={() => handleSelect(ring.id)}
                onMouseEnter={() => setHoveredId(ring.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ cursor: 'pointer' }}
              />
              {isHovered && (
                <Label x={pos.x + radius + 5} y={pos.y - radius - 5}>
                  <Tag fill="white" opacity={0.75} cornerRadius={4} />
                  <Text text={ring.name} fontSize={12} padding={4} />
                </Label>
              )}
            </React.Fragment>
          );
        })}

        {/* orphan marker on top */}
        <Circle x={center} y={center} radius={scale * 0.5} fill="red" stroke="black" strokeWidth={2} listening={false} />
      </Layer>
    </Stage>
  );
};

export default ParentChooser;
