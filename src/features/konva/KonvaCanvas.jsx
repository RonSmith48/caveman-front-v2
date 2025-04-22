import { Stage, Layer, Text } from 'react-konva';

export default function KonvaCanvas({ viewerEnabled }) {
  // Force small dimensions to confirm resize takes effect
  const width = 800;
  const height = 200;

  return (
    <Stage width={width} height={height} style={{ background: '#f0f0f0' }}>
      <Layer>
        {!viewerEnabled && (
          <Text text="Map Viewer Disabled" fontSize={24} fill="#aaa" x={width / 2} y={height / 2} offsetX={320} offsetY={12} />
        )}
      </Layer>
    </Stage>
  );
}
