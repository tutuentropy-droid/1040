import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Filter, Users, ArrowRight, Circle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { philosophyNodes, getNodeById } from '@/data/nodes';
import {
  philosopherRelations,
  getRelationColor,
  getRelationDescription,
} from '@/data/philosopherRelations';
import { getCategoryColor, getCategoryLabel } from '@/utils/colors';
import type { PhilosopherRelation, PhilosopherRelationType, PhilosophyNode } from '@/types';

// 关系类型列表
const RELATION_TYPES: PhilosopherRelationType[] = [
  '师承',
  '继承',
  '批判',
  '发展',
  '影响',
  '对立',
  '融合',
];

// 为图谱计算节点布局位置
const computeGraphLayout = () => {
  const positions: Record<string, { x: number; y: number }> = {};
  const involvedNodes = new Set<string>();

  philosopherRelations.forEach((r) => {
    involvedNodes.add(r.source);
    involvedNodes.add(r.target);
  });

  // 按分类分组
  const groups: Record<string, string[]> = {
    ancient: [],
    rationalism: [],
    empiricism: [],
    german: [],
    modern: [],
  };

  involvedNodes.forEach((id) => {
    const node = getNodeById(id);
    if (node) {
      groups[node.category]?.push(id);
    }
  });

  // 布局参数
  const centerX = 600;
  const centerY = 450;
  const radiusX = 480;
  const radiusY = 340;
  const categoryAngles: Record<string, number> = {
    ancient: -135,
    rationalism: -45,
    empiricism: 45,
    german: 135,
    modern: 180,
  };

  Object.entries(groups).forEach(([cat, nodeIds]) => {
    const baseAngle = (categoryAngles[cat] * Math.PI) / 180;
    const count = nodeIds.length;
    nodeIds.forEach((id, idx) => {
      const offset = count > 1 ? ((idx - (count - 1) / 2) * 30 * Math.PI) / 180 : 0;
      const angle = baseAngle + offset * 0.5;
      const rX = radiusX * (0.65 + (idx % 2) * 0.25);
      const rY = radiusY * (0.65 + (idx % 2) * 0.25);
      positions[id] = {
        x: centerX + Math.cos(angle) * rX,
        y: centerY + Math.sin(angle) * rY,
      };
    });
  });

  return positions;
};

const GOLD_COLOR = '#c9a962';

// 背景装饰点
const bgDots = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  opacity: Math.random() * 0.4 + 0.1,
}));

export default function PhilosopherRelationGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const unlockedNodes = useAppStore((s) => s.unlockedNodes);
  const completedChallenges = useAppStore((s) => s.completedChallenges);

  const [activeFilters, setActiveFilters] = useState<Set<PhilosopherRelationType>>(
    new Set(RELATION_TYPES),
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredRelation, setHoveredRelation] = useState<PhilosopherRelation | null>(null);
  const [showLegend, setShowLegend] = useState(true);

  const positions = useMemo(() => computeGraphLayout(), []);

  const virtualWidth = 1200;
  const virtualHeight = 900;

  // 过滤后的关系
  const filteredRelations = useMemo(() => {
    return philosopherRelations.filter((r) => activeFilters.has(r.type));
  }, [activeFilters]);

  // 获取相关的节点
  const involvedNodeIds = useMemo(() => {
    const ids = new Set<string>();
    filteredRelations.forEach((r) => {
      ids.add(r.source);
      ids.add(r.target);
    });
    return ids;
  }, [filteredRelations]);

  const selectedNode = selectedNodeId ? getNodeById(selectedNodeId) : null;

  // 获取某个节点的相关关系
  const getNodeRelations = (nodeId: string) => {
    return filteredRelations.filter(
      (r) => r.source === nodeId || r.target === nodeId,
    );
  };

  // 切换过滤器
  const toggleFilter = (type: PhilosopherRelationType) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  // 渲染关系连线
  const renderRelations = () => {
    return filteredRelations.map((relation) => {
      const sourcePos = positions[relation.source];
      const targetPos = positions[relation.target];
      if (!sourcePos || !targetPos) return null;

      const sourceNode = getNodeById(relation.source);
      const targetNode = getNodeById(relation.target);
      if (!sourceNode || !targetNode) return null;

      const sourceUnlocked = unlockedNodes.includes(relation.source);
      const targetUnlocked = unlockedNodes.includes(relation.target);
      const isHighlighted =
        selectedNodeId === relation.source || selectedNodeId === relation.target;

      const color = getRelationColor(relation.type);
      const baseOpacity = sourceUnlocked && targetUnlocked ? 0.75 : sourceUnlocked || targetUnlocked ? 0.3 : 0.12;
      const opacity = isHighlighted ? 1 : baseOpacity;

      // 计算贝塞尔曲线控制点
      const dx = targetPos.x - sourcePos.x;
      const dy = targetPos.y - sourcePos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const offset = dist * 0.15;

      const nx = -dy / dist;
      const ny = dx / dist;
      const midX = (sourcePos.x + targetPos.x) / 2 + nx * offset;
      const midY = (sourcePos.y + targetPos.y) / 2 + ny * offset;

      const path = `M ${sourcePos.x} ${sourcePos.y} Q ${midX} ${midY} ${targetPos.x} ${targetPos.y}`;

      // 箭头位置
      const arrowX = targetPos.x - nx * 28;
      const arrowY = targetPos.y - ny * 28;

      return (
        <g
          key={relation.id}
          onMouseEnter={() => setHoveredRelation(relation)}
          onMouseLeave={() => setHoveredRelation(null)}
          style={{ cursor: 'pointer' }}
        >
          {/* 光晕效果线 */}
          <motion.path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth={isHighlighted ? 8 : 5}
            strokeOpacity={isHighlighted ? 0.2 : opacity * 0.3}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
          {/* 主线 */}
          <motion.path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth={isHighlighted ? 2.5 : 1.8}
            strokeOpacity={opacity}
            strokeLinecap="round"
            strokeDasharray={sourceUnlocked && targetUnlocked ? 'none' : '6 6'}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
          />
          {/* 箭头标记 */}
          {sourceUnlocked && targetUnlocked && (
            <motion.circle
              cx={arrowX}
              cy={arrowY}
              r={isHighlighted ? 5 : 3.5}
              fill={color}
              opacity={opacity}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            />
          )}
        </g>
      );
    });
  };

  // 渲染节点
  const renderNodes = () => {
    return Array.from(involvedNodeIds).map((nodeId) => {
      const pos = positions[nodeId];
      const node = getNodeById(nodeId);
      if (!pos || !node) return null;

      const isUnlocked = unlockedNodes.includes(nodeId);
      const isSelected = selectedNodeId === nodeId;
      const color = getCategoryColor(node.category);
      const nodeRelations = getNodeRelations(nodeId);
      const hasActiveRelations = nodeRelations.length > 0;

      const size = isUnlocked ? 26 : 18;

      return (
        <g
          key={nodeId}
          transform={`translate(${pos.x}, ${pos.y})`}
          onClick={() => isUnlocked && setSelectedNodeId(isSelected ? null : nodeId)}
          style={{ cursor: isUnlocked ? 'pointer' : 'default' }}
        >
          {/* 光晕 */}
          {isSelected && (
            <motion.circle
              r={size + 18}
              fill={color}
              opacity={0.1}
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          {/* 外圈 */}
          <motion.circle
            r={size + 4}
            fill="none"
            stroke={isSelected ? GOLD_COLOR : color}
            strokeOpacity={isUnlocked ? (isSelected ? 1 : 0.5) : 0.2}
            strokeWidth={isSelected ? 2 : 1}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          />
          {/* 主圆 */}
          <motion.circle
            r={size}
            fill={isUnlocked ? `${color}25` : 'rgba(255,255,255,0.03)'}
            stroke={isUnlocked ? color : 'rgba(255,255,255,0.1)'}
            strokeWidth={isUnlocked ? 2 : 1}
            whileHover={isUnlocked ? { scale: 1.1 } : undefined}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 250, damping: 20, delay: 0.2 }}
          />
          {/* 名字首字 */}
          <motion.text
            textAnchor="middle"
            dominantBaseline="central"
            fill={isUnlocked ? color : 'rgba(255,255,255,0.25)'}
            fontSize={isUnlocked ? 14 : 10}
            fontWeight="bold"
            style={{
              fontFamily: '"Noto Serif SC", Georgia, serif',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isUnlocked ? node.name.charAt(0) : '?'}
          </motion.text>
          {/* 完整名称标签 */}
          {isUnlocked && (
            <motion.text
              y={size + 18}
              textAnchor="middle"
              fill={hasActiveRelations ? '#e8e4d9' : 'rgba(232,228,217,0.4)'}
              fontSize={12}
              fontWeight={500}
              style={{
                fontFamily: '"Noto Serif SC", Georgia, serif',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {node.name}
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
          'radial-gradient(ellipse at 30% 30%, rgba(201,169,98,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(155,89,182,0.05) 0%, transparent 50%)',
        border: '1px solid rgba(201,169,98,0.15)',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.3)',
      }}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {bgDots.map((dot) => (
          <motion.div
            key={dot.id}
            className="absolute rounded-full bg-[#c9a962]"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              opacity: dot.opacity,
            }}
            animate={{
              opacity: [dot.opacity * 0.5, dot.opacity, dot.opacity * 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* 过滤器面板 */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <motion.div
          className="p-3 rounded-xl"
          style={{
            background: 'rgba(15,22,36,0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(201,169,98,0.2)',
          }}
        >
          <div className="flex items-center gap-2 mb-2.5">
            <Filter size={13} className="text-[#c9a962]" />
            <span className="text-[11px] font-medium text-[#c9a962]/90 tracking-wider">
              关系类型
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {RELATION_TYPES.map((type) => {
              const active = activeFilters.has(type);
              const color = getRelationColor(type);
              return (
                <motion.button
                  key={type}
                  onClick={() => toggleFilter(type)}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-all"
                  style={{
                    background: active ? `${color}15` : 'rgba(255,255,255,0.03)',
                    border: active ? `1px solid ${color}50` : '1px solid rgba(255,255,255,0.08)',
                    color: active ? color : 'rgba(232,228,217,0.5)',
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: color,
                      opacity: active ? 1 : 0.3,
                      boxShadow: active ? `0 0 6px ${color}60` : 'none',
                    }}
                  />
                  {type}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* 图例开关 */}
      <motion.button
        onClick={() => setShowLegend(!showLegend)}
        whileTap={{ scale: 0.95 }}
        className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px]"
        style={{
          background: 'rgba(15,22,36,0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(201,169,98,0.2)',
          color: '#c9a962',
        }}
      >
        <Info size={12} />
        图例
      </motion.button>

      {/* 图例面板 */}
      <AnimatePresence>
        {showLegend && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-14 right-4 z-10 p-3 rounded-xl"
            style={{
              background: 'rgba(15,22,36,0.92)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(201,169,98,0.2)',
            }}
          >
            <div className="space-y-1.5">
              {RELATION_TYPES.map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 w-16">
                    <span
                      className="w-3 h-0.5 rounded-full"
                      style={{ backgroundColor: getRelationColor(type) }}
                    />
                    <span className="text-[11px]" style={{ color: getRelationColor(type) }}>
                      {type}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#e8e4d9]/45">
                    {getRelationDescription(type)}
                  </span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <Circle size={10} className="text-[#c9a962] fill-[#c9a962]/20" />
                  <span className="text-[10px] text-[#e8e4d9]/45">
                    实线 = 两端已解锁 · 虚线 = 部分解锁
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 悬浮提示 - 关系 */}
      <AnimatePresence>
        {hoveredRelation && !selectedNodeId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 max-w-sm px-4 py-3 rounded-xl pointer-events-none"
            style={{
              background: 'rgba(15,22,36,0.95)',
              backdropFilter: 'blur(15px)',
              border: `1px solid ${getRelationColor(hoveredRelation.type)}50`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${getRelationColor(hoveredRelation.type)}15`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{
                  background: `${getRelationColor(hoveredRelation.type)}20`,
                  color: getRelationColor(hoveredRelation.type),
                  border: `1px solid ${getRelationColor(hoveredRelation.type)}40`,
                }}
              >
                {hoveredRelation.type}
              </span>
              <div className="flex items-center gap-1.5 text-[12px] text-[#e8e4d9]/80">
                <span style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}>
                  {getNodeById(hoveredRelation.source)?.name || '???'}
                </span>
                <ArrowRight size={12} className="text-[#c9a962]/50" />
                <span style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}>
                  {getNodeById(hoveredRelation.target)?.name || '???'}
                </span>
              </div>
            </div>
            <p className="text-xs text-[#e8e4d9]/70 leading-relaxed">
              {hoveredRelation.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主 SVG */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${virtualWidth} ${virtualHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <pattern id="relGrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="rgba(201,169,98,0.035)"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="relGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(201,169,98,0.05)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        <rect width={virtualWidth} height={virtualHeight} fill="url(#relGrid)" />
        <rect width={virtualWidth} height={virtualHeight} fill="url(#relGlow)" />

        {/* 关系连线 */}
        <g>{renderRelations()}</g>

        {/* 节点 */}
        <g>{renderNodes()}</g>
      </svg>

      {/* 节点详情面板 */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-4 top-14 bottom-4 z-20 w-72 md:w-80 p-4 rounded-2xl overflow-y-auto"
            style={{
              background: 'rgba(15,22,36,0.95)',
              backdropFilter: 'blur(15px)',
              border: `1px solid ${getCategoryColor(selectedNode.category)}40`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 30px ${getCategoryColor(selectedNode.category)}15`,
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${getCategoryColor(selectedNode.category)}30, ${getCategoryColor(selectedNode.category)}10)`,
                    border: `1px solid ${getCategoryColor(selectedNode.category)}50`,
                  }}
                >
                  <span
                    className="text-lg font-bold"
                    style={{
                      color: getCategoryColor(selectedNode.category),
                      fontFamily: '"Noto Serif SC", Georgia, serif',
                    }}
                  >
                    {selectedNode.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3
                    className="text-base font-bold text-[#e8e4d9]"
                    style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                  >
                    {selectedNode.name}
                  </h3>
                  <p className="text-[10px] text-[#e8e4d9]/50">
                    {getCategoryLabel(selectedNode.category)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <X size={13} className="text-[#e8e4d9]/50" />
              </button>
            </div>

            <p className="text-xs text-[#e8e4d9]/70 leading-relaxed mb-4">
              {selectedNode.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-1.5">
                <Users size={12} className="text-[#c9a962]/70" />
                <span className="text-[11px] font-medium text-[#c9a962]/80 tracking-wider">
                  思想关系 ({getNodeRelations(selectedNode.id).length})
                </span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {getNodeRelations(selectedNode.id).map((rel) => {
                  const isSource = rel.source === selectedNode.id;
                  const otherId = isSource ? rel.target : rel.source;
                  const other = getNodeById(otherId);
                  if (!other) return null;
                  const color = getRelationColor(rel.type);

                  return (
                    <motion.div
                      key={rel.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-2.5 rounded-lg"
                      style={{
                        background: `${color}08`,
                        border: `1px solid ${color}20`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
                          style={{
                            background: `${color}20`,
                            color: color,
                          }}
                        >
                          {isSource ? '→' : '←'} {rel.type}
                        </span>
                        <span
                          className="text-xs font-medium text-[#e8e4d9]/85"
                          style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                        >
                          {other.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#e8e4d9]/50 leading-relaxed">
                        {rel.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* 核心思想 */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Info size={12} className="text-[#c9a962]/70" />
                <span className="text-[11px] font-medium text-[#c9a962]/80 tracking-wider">
                  核心思想
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.coreIdeas.slice(0, 5).map((idea, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-full text-[10px]"
                    style={{
                      background: `${getCategoryColor(selectedNode.category)}12`,
                      border: `1px solid ${getCategoryColor(selectedNode.category)}30`,
                      color: getCategoryColor(selectedNode.category),
                    }}
                  >
                    {idea}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 空状态提示 */}
      {completedChallenges.length === 0 && unlockedNodes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center pointer-events-none max-w-xs px-4"
        >
          <Users size={48} className="mx-auto mb-3 text-[#c9a962]/30" />
          <p
            className="text-lg md:text-xl font-bold text-[#e8e4d9]/40 mb-2"
            style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
          >
            哲学家的关系网络等待你的探索
          </p>
          <p className="text-xs text-[#e8e4d9]/25 leading-relaxed">
            完成哲学挑战，解锁思想家，
            <br />
            见证两千年思想史的传承与交锋
          </p>
        </motion.div>
      )}
    </div>
  );
}
