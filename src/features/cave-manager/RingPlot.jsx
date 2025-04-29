import React from 'react';
import { Stage, Layer, Circle, Line, Text } from 'react-konva';

const DEG_TO_RAD = Math.PI / 180;

function rotatePoint(x, y, centerX, centerY, azimuthDeg) {
  const theta = -azimuthDeg * DEG_TO_RAD; // Negative for object rotation
  const dx = x - centerX;
  const dy = y - centerY;
  const xPrime = Math.cos(theta) * dx + Math.sin(theta) * dy;
  const yPrime = -Math.sin(theta) * dx + Math.cos(theta) * dy;
  return { x: xPrime, y: yPrime };
}

function RingPlot({ holeData, azimuth }) {
  if (!holeData || !holeData.length) return null;

  // Find center of collars
  const centerX = holeData.reduce((sum, h) => sum + parseFloat(h.CollarX), 0) / holeData.length;
  const centerY = holeData.reduce((sum, h) => sum + parseFloat(h.CollarY), 0) / holeData.length;

  // Rotate collars and toes
  const rotated = holeData.map(hole => {
    const collarRot = rotatePoint(parseFloat(hole.CollarX), parseFloat(hole.CollarY), centerX, centerY, azimuth);
    const toeRot = rotatePoint(parseFloat(hole.ToeX), parseFloat(hole.ToeY), centerX, centerY, azimuth);
    return {
      holeId: hole.HoleID,
      collar: { x: collarRot.x, y: parseFloat(hole.CollarZ) },
      toe: { x: toeRot.x, y: parseFloat(hole.ToeZ) },
    };
  });

  // Find bounds
  const allX = rotated.flatMap(h => [h.collar.x, h.toe.x]);
  const allY = rotated.flatMap(h => [h.collar.y, h.toe.y]);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);

  // Canvas settings
  const padding = 50;
  const canvasWidth = 800;
  const canvasHeight = 600;
  const scaleX = (canvasWidth - padding * 2) / (maxX - minX || 1);
  const scaleY = (canvasHeight - padding * 2) / (maxY - minY || 1);
  const scale = Math.min(scaleX, scaleY);

  const transformX = x => padding + (x - minX) * scale;
  const transformY = y => canvasHeight - padding - (y - minY) * scale; // Invert Y to match screen coordinates

  return (
    <Stage width={canvasWidth} height={canvasHeight}>
      <Layer>
        {/* Draw holes */}
        {rotated.map((hole, idx) => (
          <React.Fragment key={idx}>
            <Line
              points={[
                transformX(hole.collar.x), transformY(hole.collar.y),
                transformX(hole.toe.x), transformY(hole.toe.y)
              ]}
              stroke="black"
              strokeWidth={1.5}
            />
            <Circle
              x={transformX(hole.collar.x)}
              y={transformY(hole.collar.y)}
              radius={3}
              fill="black"
            />
            {/* Label Hole ID */}
            <Text
              text={hole.holeId}
              x={transformX(hole.toe.x) + 5}
              y={transformY(hole.toe.y) - 5}
              fontSize={12}
              fill="black"
            />
          </React.Fragment>
        ))}
      </Layer>
    </Stage>
  );
}

export default RingPlot;
