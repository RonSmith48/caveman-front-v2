import useImage from 'use-image';
import { Image as KonvaImage } from 'react-konva';

// Reusable North Arrow component
const NorthArrow = ({ canvasSize, padding = 10, size = 40, src = '/images/graphics/north-arrow.png' }) => {
  const [img] = useImage(src);
  if (!img) return null;
  return <KonvaImage image={img} x={canvasSize - size - padding} y={padding} width={size} height={size} listening={false} />;
};
export default NorthArrow;
