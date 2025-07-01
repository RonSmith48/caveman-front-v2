import React from 'react';
import { Stage, Layer, Circle, Line, Text } from 'react-konva';

const DEG_TO_RAD = Math.PI / 180;

function rotatePoint(x, y, centerX, centerY, azimuthDeg) {
  const theta = -azimuthDeg * DEG_TO_RAD;
  const dx = x - centerX;
  const dy = y - centerY;
  const xPrime = Math.cos(theta) * dx + Math.sin(theta) * dy;
  const yPrime = -Math.sin(theta) * dx + Math.cos(theta) * dy;
  return { x: xPrime, y: yPrime };
}

function RingPlot({ holeData, azimuth }) {
  if (!holeData || !holeData.length) return null;

  const centerX = holeData.reduce((sum, h) => sum + parseFloat(h.CollarX), 0) / holeData.length;
  const centerY = holeData.reduce((sum, h) => sum + parseFloat(h.CollarY), 0) / holeData.length;

  const rotated = holeData.map((hole) => {
    const collarX = parseFloat(hole.CollarX);
    const collarY = parseFloat(hole.CollarY);
    const collarZ = parseFloat(hole.CollarZ);
    const toeX = parseFloat(hole.ToeX);
    const toeY = parseFloat(hole.ToeY);
    const toeZ = parseFloat(hole.ToeZ);

    const collarRot = rotatePoint(collarX, collarY, centerX, centerY, azimuth);
    const toeRot = rotatePoint(toeX, toeY, centerX, centerY, azimuth);

    const dx = toeX - collarX;
    const dy = toeY - collarY;
    const dz = toeZ - collarZ;

    const lengthCollarToToe = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const lengthPivotToToe = parseFloat(hole['Length from pivot to toe']);
    const stepBack = lengthPivotToToe - lengthCollarToToe;

    const unitVector = {
      x: dx / lengthCollarToToe,
      y: dy / lengthCollarToToe,
      z: dz / lengthCollarToToe
    };

    const pivotX = collarX - unitVector.x * stepBack;
    const pivotY = collarY - unitVector.y * stepBack;
    const pivotRot = rotatePoint(pivotX, pivotY, centerX, centerY, azimuth);

    return {
      holeId: hole.HoleID,
      collar: { x: collarRot.x, y: collarZ },
      toe: { x: toeRot.x, y: toeZ },
      pivot: { x: pivotRot.x, y: pivotRot.y },
      collarOffsetVertical: parseFloat(hole['CollarOffset Vertical']),
      leftWallDist: parseFloat(hole['Distance from left wall to pivot']),
      rightWallDist: parseFloat(hole['Distance from right wall to pivot'])
    };
  });

  const pivotX = rotated[0].pivot.x;
  const floorZ = Math.min(...rotated.map((h) => h.collar.y - h.collarOffsetVertical));

  const leftWallX = pivotX - rotated[0].leftWallDist;
  const rightWallX = pivotX + rotated[0].rightWallDist;

  const firstCollar = rotated[0];
  const lastCollar = rotated[rotated.length - 1];
  const wallOffset = 0.8; // 800mm reduction
  const leftWallZ = firstCollar.collar.y - wallOffset;
  const rightWallZ = lastCollar.collar.y - wallOffset;

  const allX = rotated.flatMap((h) => [h.collar.x, h.toe.x, leftWallX, rightWallX]);
  const allY = rotated.flatMap((h) => [h.collar.y, h.toe.y, floorZ, leftWallZ, rightWallZ]);

  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);

  const padding = 50;
  const canvasWidth = 800;
  const canvasHeight = 600;
  const scaleX = (canvasWidth - padding * 2) / (maxX - minX || 1);
  const scaleY = (canvasHeight - padding * 2) / (maxY - minY || 1);
  const scale = Math.min(scaleX, scaleY);

  const transformX = (x) => padding + (x - minX) * scale;
  const transformY = (y) => canvasHeight - padding - (y - minY) * scale;

  return (
    <Stage width={canvasWidth} height={canvasHeight}>
      <Layer>
        {/* Left Wall to Collar */}
        <Line
          points={[
            transformX(leftWallX),
            transformY(floorZ),
            transformX(leftWallX),
            transformY(leftWallZ),
            transformX(firstCollar.collar.x),
            transformY(firstCollar.collar.y)
          ]}
          stroke="green"
          strokeWidth={1}
          dash={[2, 3]}
        />

        {/* Right Wall to Collar */}
        <Line
          points={[
            transformX(rightWallX),
            transformY(floorZ),
            transformX(rightWallX),
            transformY(rightWallZ),
            transformX(lastCollar.collar.x),
            transformY(lastCollar.collar.y)
          ]}
          stroke="green"
          strokeWidth={1}
          dash={[2, 3]}
        />

        {/* Floor Line */}
        <Line
          points={[transformX(leftWallX), transformY(floorZ), transformX(rightWallX), transformY(floorZ)]}
          stroke="green"
          strokeWidth={1}
          dash={[2, 3]}
        />

        {/* Connect collars */}
        <Line points={rotated.map((h) => [transformX(h.collar.x), transformY(h.collar.y)]).flat()} stroke="green" strokeWidth={0.5} />

        {/* Holes and labels */}
        {rotated.map((hole, idx) => (
          <React.Fragment key={idx}>
            <Line
              points={[transformX(hole.collar.x), transformY(hole.collar.y), transformX(hole.toe.x), transformY(hole.toe.y)]}
              stroke="black"
              strokeWidth={1}
            />
            <Circle x={transformX(hole.collar.x)} y={transformY(hole.collar.y)} radius={2} fill="black" />
            <Text text={hole.holeId} x={transformX(hole.toe.x) + 4} y={transformY(hole.toe.y) - 6} fontSize={12} fill="black" />
          </React.Fragment>
        ))}
      </Layer>
    </Stage>
  );
}

export default RingPlot;
