import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { philosophyNodes, getNodeById } from '@/data/nodes';
import { philosophyEdges } from '@/data/edges';
import MapNode from '@/components/map/MapNode';
import { getCategoryLegend, getEdgeColor, getCategoryColor } from '@/utils/colors';
import type { PhilosophyNode } from '@/types';

// 分类标签配置 - 从统一颜色工具获取，确保与实际节点颜色完全一致
const categoryLabels = getCategoryLegend();

const GOLD_COLOR = '#c9a962';

// 背景星点
const stars = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  delay: Math.random() * 5,
  duration: Math.random() * 3 + 2,
}));

export default function PhilosophyMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const unlockedNodes = useAppStore((s) => s.unlockedNodes);
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useAppStore((s) => s.setSelectedNodeId);

  const [hoveredNode, setHoveredNode] = useState<PhilosophyNode | null>(null);

  // 虚拟坐标空间
  const virtualWidth = 1200;
  const virtualHeight = 900;

  // 处理节点点击
  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  // 绘制边
  const renderEdges = () => {
    return philosophyEdges.map((edge) => {
      const source = getNodeById(edge.source);
      const target = getNodeById(edge.target);
      if (!source || !target) return null;

      const x1 = source.x * virtualWidth;
      const y1 = source.y * virtualHeight;
      const x2 = target.x * virtualWidth;
      const y2 = target.y * virtualHeight;

      // 检查两端是否有至少一个解锁
      const sourceUnlocked = unlockedNodes.includes(source.id);
      const targetUnlocked = unlockedNodes.includes(target.id);
      const anyUnlocked = sourceUnlocked || targetUnlocked;
      const bothUnlocked = sourceUnlocked && targetUnlocked;

      // 使用统一的边颜色映射
      const edgeBaseColor = getEdgeColor(edge.relation);
      const opacity = bothUnlocked ? 0.7 : anyUnlocked ? 0.3 : 0.1;
      const isHighlighted =
        (selectedNodeId === source.id || selectedNodeId === target.id) && bothUnlocked;

      // 中间点（用于曲线）
      const midX = (x1 + x2) / 2 + (y2 - y1) * 0.1;
      const midY = (y1 + y2) / 2 - (x2 - x1) * 0.1;
      const path = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;

      return (
        <g key={edge.id}>
          <motion.path
            d={path}
            fill="none"
            stroke={isHighlighted ? GOLD_COLOR : edgeBaseColor}
            strokeWidth={isHighlighted ? 3 : 1.8}
            strokeOpacity={isHighlighted ? 0.95 : opacity}
            strokeDasharray={bothUnlocked ? 'none' : '4 4'}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          />
          {/* 关系标签 */}
          {bothUnlocked && (
            <motion.text
              x={midX}
              y={midY - 6}
              textAnchor="middle"
              fill={GOLD_COLOR}
              fontSize={11}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHighlighted ? 0.8 : 0 }}
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {edge.relation}
            </motion.text>
          )}
        </g>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden rounded-2xl"
      style={{
        background:
          'radial-gradient(ellipse at 30% 20%, rgba(201,169,98,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(52,152,219,0.06) 0%, transparent 50%)',
        border: '1px solid rgba(201,169,98,0.15)',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.3)',
      }}
    >
      {/* 背景星点 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* 分类图例 */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 p-3 rounded-xl"
        style={{
          background: 'rgba(15,22,36,0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(201,169,98,0.2)',
        }}
      >
        <span className="text-[10px] text-[#c9a962]/70 tracking-wider mb-1 px-1">思想流派</span>
        {categoryLabels.map((cat) => (
          <div key={cat.key} className="flex items-center gap-2 px-2 py-0.5">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-[0_0_6px_rgba(0,0,0,0.3)]"
              style={{
                backgroundColor: cat.color,
                boxShadow: `0 0 8px ${cat.color}50`,
              }}
            />
            <span className="text-[11px] text-[#e8e4d9]/75">{cat.label}</span>
          </div>
        ))}
      </div>

      {/* 主 SVG 图 */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${virtualWidth} ${virtualHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
      >
        {/* 网格背景 */}
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="rgba(201,169,98,0.04)"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(201,169,98,0.06)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={virtualWidth} height={virtualHeight} fill="url(#grid)" />
        <rect width={virtualWidth} height={virtualHeight} fill="url(#centerGlow)" />

        {/* 边 */}
        <g>{renderEdges()}</g>

        {/* 节点 */}
        <g>
          {philosophyNodes.map((node) => (
            <MapNode
              key={node.id}
              node={node}
              isUnlocked={unlockedNodes.includes(node.id)}
              isSelected={selectedNodeId === node.id}
              onClick={handleNodeClick}
              onHover={setHoveredNode}
              virtualWidth={virtualWidth}
              virtualHeight={virtualHeight}
            />
          ))}
        </g>
      </svg>

      {/* 悬浮提示 */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            key={hoveredNode.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 max-w-md px-5 py-4 rounded-xl pointer-events-none"
            style={{
              background: 'rgba(15,22,36,0.95)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(201,169,98,0.35)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: `${getCategoryColor(hoveredNode.category)}25`,
                  border: `1px solid ${getCategoryColor(hoveredNode.category)}50`,
                  color: getCategoryColor(hoveredNode.category),
                }}
              >
                {hoveredNode.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h4
                  className="text-base font-bold text-[#e8e4d9] mb-1"
                  style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                >
                  {hoveredNode.name}
                  <span className="ml-2 text-xs font-normal text-[#c9a962]/70">
                    {hoveredNode.era}
                  </span>
                </h4>
                <p className="text-xs text-[#e8e4d9]/70 leading-relaxed line-clamp-2">
                  {hoveredNode.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 空状态提示（未解锁任何节点时） */}
      {unlockedNodes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center pointer-events-none"
        >
          <p
            className="text-xl md:text-2xl font-bold text-[#e8e4d9]/40 mb-3"
            style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
          >
            思想的迷宫等待你的探索
          </p>
          <p className="text-sm text-[#e8e4d9]/25">
            点击左侧"开始探索"以点亮节点
          </p>
        </motion.div>
      )}
    </div>
  );
}
