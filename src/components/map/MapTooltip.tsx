import { motion, AnimatePresence } from 'framer-motion';
import { getCategoryColor } from '@/utils/colors';
import type { PhilosophyNode } from '@/types';

const GOLD_COLOR = '#c9a962';

interface MapTooltipProps {
  hoveredNode: PhilosophyNode | null;
  tooltipPos: { x: number; y: number };
}

export default function MapTooltip({ hoveredNode, tooltipPos }: MapTooltipProps) {
  return (
    <AnimatePresence>
      {hoveredNode && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 5, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none fixed z-50 w-64 rounded-xl p-4 shadow-2xl"
          style={{
            left: Math.min(tooltipPos.x + 16, window.innerWidth - 280),
            top: Math.min(tooltipPos.y + 16, window.innerHeight - 220),
            backgroundColor: 'rgba(15, 22, 36, 0.95)',
            border: `1px solid ${GOLD_COLOR}50`,
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="mb-2 flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: getCategoryColor(hoveredNode.category) }}
            />
            <h3 className="text-lg font-bold" style={{ color: GOLD_COLOR }}>
              {hoveredNode.name}
            </h3>
          </div>
          <p className="mb-2 text-xs text-gray-400">{hoveredNode.era}</p>
          <p className="mb-3 text-sm leading-relaxed text-gray-300">
            {hoveredNode.description}
          </p>
          <div className="flex flex-wrap gap-1">
            {hoveredNode.coreIdeas.slice(0, 3).map((idea) => (
              <span
                key={idea}
                className="rounded-full px-2 py-0.5 text-[10px]"
                style={{
                  backgroundColor: `${GOLD_COLOR}15`,
                  color: GOLD_COLOR,
                  border: `1px solid ${GOLD_COLOR}30`,
                }}
              >
                {idea}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
