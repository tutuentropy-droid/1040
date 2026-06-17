import { motion } from 'framer-motion';
import type { PhilosophyEdge, EdgeRelation, PhilosophyNode } from '@/types';

interface MapEdgeProps {
  edge: PhilosophyEdge;
  sourceNode: PhilosophyNode;
  targetNode: PhilosophyNode;
  isExplored: boolean;
  isHighlighted: boolean;
  virtualWidth: number;
  virtualHeight: number;
  index: number;
}

const GOLD_COLOR = '#c9a962';

const getStrokeStyle = (relation: EdgeRelation): string => {
  switch (relation) {
    case '批判':
      return '10,6';
    case '对立':
      return '10,6';
    case '发展':
      return 'none';
    case '融合':
      return '4,4';
    default:
      return 'none';
  }
};

const getEdgeColor = (relation: EdgeRelation): string => {
  switch (relation) {
    case '继承':
      return '#4ade80';
    case '批判':
      return '#f87171';
    case '发展':
      return '#60a5fa';
    case '影响':
      return '#a78bfa';
    case '对立':
      return '#fb923c';
    case '融合':
      return '#34d399';
    default:
      return '#9ca3af';
  }
};

export default function MapEdge({
  edge,
  sourceNode,
  targetNode,
  isExplored,
  isHighlighted,
  virtualWidth,
  virtualHeight,
  index,
}: MapEdgeProps) {
  const sx = sourceNode.x * virtualWidth;
  const sy = sourceNode.y * virtualHeight;
  const tx = targetNode.x * virtualWidth;
  const ty = targetNode.y * virtualHeight;

  const dx = tx - sx;
  const dy = ty - sy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const offset = 30;
  const unitX = dx / dist;
  const unitY = dy / dist;

  const startX = sx + unitX * offset;
  const startY = sy + unitY * offset;
  const endX = tx - unitX * offset;
  const endY = ty - unitY * offset;

  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  const controlOffset = dist * 0.15;
  const perpX = -unitY * controlOffset;
  const perpY = unitX * controlOffset;
  const ctrlX = midX + perpX;
  const ctrlY = midY + perpY;

  const pathD = `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`;

  const edgeColor = isExplored ? getEdgeColor(edge.relation) : '#4b5563';
  const strokeDasharray = getStrokeStyle(edge.relation);
  const opacity = isExplored ? (isHighlighted ? 1 : 0.7) : 0.25;
  const strokeWidth = isHighlighted ? 3 : 2;
  const glowId = `glow-${edge.id}`;

  const labelX = (startX + 2 * ctrlX + endX) / 4;
  const labelY = (startY + 2 * ctrlY + endY) / 4;

  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
  const adjustedAngle = angle > 90 || angle < -90 ? angle + 180 : angle;

  return (
    <g style={{ pointerEvents: 'none' }}>
      {isExplored && (
        <defs>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}

      <motion.path
        d={pathD}
        fill="none"
        stroke={edgeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
        opacity={opacity}
        markerEnd={isExplored ? `url(#arrow-${edge.relation})` : undefined}
        filter={isExplored && isHighlighted ? `url(#${glowId})` : undefined}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 1,
          delay: index * 0.03,
          ease: 'easeInOut',
        }}
        style={isHighlighted ? { filter: `drop-shadow(0 0 6px ${GOLD_COLOR})` } : {}}
      />

      {isExplored && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: isHighlighted ? 1 : 0.85 }}
          transition={{ delay: index * 0.03 + 0.5 }}
        >
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={11}
            fill={isHighlighted ? GOLD_COLOR : '#d1d5db'}
            fontWeight={isHighlighted ? 700 : 500}
            transform={`rotate(${adjustedAngle}, ${labelX}, ${labelY})`}
            style={{
              userSelect: 'none',
            }}
          >
            <tspan
              fill="none"
              stroke="#0f1624"
              strokeWidth={3}
              strokeLinejoin="round"
            >
              {edge.relation}
            </tspan>
            <tspan>{edge.relation}</tspan>
          </text>
        </motion.g>
      )}
    </g>
  );
}
