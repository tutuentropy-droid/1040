import { motion, AnimatePresence } from 'framer-motion';
import { getCategoryColor } from '@/utils/colors';
import type { PhilosophyNode } from '@/types';

const GOLD_COLOR = '#c9a962';

interface SelectedNodePanelProps {
  node: PhilosophyNode | null;
  onClose: () => void;
}

export default function SelectedNodePanel({ node, onClose }: SelectedNodePanelProps) {
  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute left-6 top-6 w-72 rounded-2xl p-5 shadow-2xl"
          style={{
            backgroundColor: 'rgba(15, 22, 36, 0.92)',
            border: `1px solid ${GOLD_COLOR}60`,
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full shadow-lg"
                style={{
                  backgroundColor: getCategoryColor(node.category),
                  boxShadow: `0 0 12px ${getCategoryColor(node.category)}80`,
                }}
              />
              <h2 className="text-xl font-bold" style={{ color: GOLD_COLOR }}>
                {node.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              ×
            </button>
          </div>

          <p className="mb-3 text-xs text-gray-400">{node.era}</p>
          <p className="mb-4 text-sm leading-relaxed text-gray-300">
            {node.description}
          </p>

          <div className="mb-4">
            <p
              className="mb-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: `${GOLD_COLOR}aa` }}
            >
              核心思想
            </p>
            <div className="flex flex-wrap gap-1.5">
              {node.coreIdeas.map((idea) => (
                <span
                  key={idea}
                  className="rounded-lg px-2.5 py-1 text-xs"
                  style={{
                    backgroundColor: `${GOLD_COLOR}12`,
                    color: '#e5e7eb',
                    border: `1px solid ${GOLD_COLOR}25`,
                  }}
                >
                  {idea}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p
              className="mb-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: `${GOLD_COLOR}aa` }}
            >
              代表人物
            </p>
            <p className="text-sm text-gray-300">
              {node.keyFigures.join('、')}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
