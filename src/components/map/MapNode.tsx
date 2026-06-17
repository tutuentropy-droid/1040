import { motion } from 'framer-motion';
import type { PhilosophyNode } from '@/types';
import { getCategoryColor } from '@/utils/colors';

interface MapNodeProps {
  node: PhilosophyNode;
  isUnlocked: boolean;
  isSelected: boolean;
  onClick: (nodeId: string) => void;
  onHover: (node: PhilosophyNode | null) => void;
  virtualWidth: number;
  virtualHeight: number;
}

const GOLD_COLOR = '#c9a962';
const NODE_RADIUS = 28;

export default function MapNode({
  node,
  isUnlocked,
  isSelected,
  onClick,
  onHover,
  virtualWidth,
  virtualHeight,
}: MapNodeProps) {
  const cx = node.x * virtualWidth;
  const cy = node.y * virtualHeight;

  // 使用统一的分类颜色，确保与图例完全对应
  const categoryColor = getCategoryColor(node.category);
  const baseColor = isUnlocked ? categoryColor : '#6b7280';
  const glowColor = isUnlocked ? GOLD_COLOR : 'transparent';

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: isUnlocked ? 1 : 0.35, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ cursor: isUnlocked ? 'pointer' : 'not-allowed' }}
      onMouseEnter={() => isUnlocked && onHover(node)}
      onMouseLeave={() => onHover(null)}
      onClick={() => isUnlocked && onClick(node.id)}
    >
      {isSelected && (
        <motion.circle
          cx={cx}
          cy={cy}
          r={NODE_RADIUS + 10}
          fill="none"
          stroke={GOLD_COLOR}
          strokeWidth={3}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {isUnlocked && (
        <motion.circle
          cx={cx}
          cy={cy}
          r={NODE_RADIUS + 5}
          fill="none"
          stroke={glowColor}
          strokeWidth={2}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <motion.circle
        cx={cx}
        cy={cy}
        r={NODE_RADIUS}
        fill={baseColor}
        stroke={isSelected ? GOLD_COLOR : isUnlocked ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}
        strokeWidth={isSelected ? 3 : 2}
        whileHover={isUnlocked ? { scale: 1.15 } : {}}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      <motion.text
        x={cx}
        y={cy + NODE_RADIUS + 18}
        textAnchor="middle"
        fill={isUnlocked ? '#e5e7eb' : '#4b5563'}
        fontSize={14}
        fontWeight={isSelected ? 700 : 500}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          textShadow: isSelected ? `0 0 10px ${GOLD_COLOR}` : 'none',
        }}
      >
        {node.name}
      </motion.text>

      {isUnlocked && (
        <motion.circle
          cx={cx}
          cy={cy}
          r={NODE_RADIUS - 8}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={1}
          animate={{
            r: [NODE_RADIUS - 8, NODE_RADIUS - 4, NODE_RADIUS - 8],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.g>
  );
}
