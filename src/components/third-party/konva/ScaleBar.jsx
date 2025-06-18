import React from 'react';
import { Group, Line, Text } from 'react-konva';

// Reusable ScaleBar component (draws a simple line + label with end ticks)
const ScaleBar = ({ canvasSize, padding = 10, scale, meters = 10, tickHeight = 10 }) => {
  // Compute pixel length of the bar based on scale
  const lengthPx = scale * meters;
  // Y position for the bar (above bottom padding)
  const y = canvasSize - padding - 20;
  // X positions for start and end of the bar
  const startX = canvasSize - padding - lengthPx;
  const endX = canvasSize - padding;

  return (
    <Group>
      {/* Horizontal scale line */}
      <Line points={[startX, y, endX, y]} stroke="black" strokeWidth={2} listening={false} />

      {/* End ticks */}
      <Line points={[startX, y, startX, y - tickHeight]} stroke="black" strokeWidth={2} listening={false} />
      <Line points={[endX, y, endX, y - tickHeight]} stroke="black" strokeWidth={2} listening={false} />

      {/* Label at left end */}
      <Text text={`${meters} m`} x={startX} y={y + 4} fontSize={12} fill="black" listening={false} />
    </Group>
  );
};

export default ScaleBar;
