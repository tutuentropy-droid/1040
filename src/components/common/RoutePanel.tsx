import { motion } from 'framer-motion';
import { Play, RefreshCw, MapPin, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { philosophyNodes } from '@/data/nodes';
import { cn } from '@/lib/utils';

// 标签颜色配置
const tagColors: Record<string, string> = {
  freedom: '#E74C3C',
  individual: '#C0392B',
  will: '#8E44AD',
  collective: '#27AE60',
  security: '#16A085',
  order: '#2980B9',
  balance: '#F39C12',
  rational: '#3498DB',
  rationalism: '#3498DB',
  empiricism: '#27AE60',
  critical: '#9B59B6',
  existential: '#E74C3C',
  happiness: '#F1C40F',
  wisdom: '#E67E22',
  truth: '#2980B9',
  power: '#C0392B',
};

// 获取标签颜色
const getTagColor = (tag: string): string => {
  return tagColors[tag] || '#c9a962';
};

export default function RoutePanel() {
  const navigate = useNavigate();
  const unlockedNodes = useAppStore((s) => s.unlockedNodes);
  const routeTags = useAppStore((s) => s.routeTags);
  const answeredQuestions = useAppStore((s) => s.answeredQuestions);
  const resetExploration = useAppStore((s) => s.resetExploration);

  // 是否有进行中的探索
  const hasProgress = answeredQuestions.length > 0;

  // 已解锁的节点信息
  const visitedNodes = unlockedNodes
    .map((id) => philosophyNodes.find((n) => n.id === id))
    .filter(Boolean)
    .slice(0, 8);

  // 标签排序（按分数从高到低）
  const sortedTags = Object.entries(routeTags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // 标签最高分数（用于计算大小）
  const maxTagScore = sortedTags.length > 0 ? sortedTags[0][1] : 1;

  // 开始/继续探索
  const handleExplore = () => {
    navigate('/explore');
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      className="fixed left-4 md:left-6 top-24 md:top-28 z-30 w-72 lg:w-80"
    >
      {/* 精致半透明面板 */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(15,22,36,0.85) 0%, rgba(15,22,36,0.7) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(201,169,98,0.25)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* 顶部光晕装饰 */}
        <div
          className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(201,169,98,0.12) 0%, transparent 70%)',
          }}
        />

        {/* 面板标题 */}
        <div className="relative p-4 md:p-5 border-b border-[rgba(201,169,98,0.2)]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(201,169,98,0.2) 0%, rgba(201,169,98,0.08) 100%)',
                border: '1px solid rgba(201,169,98,0.35)',
              }}
            >
              <Compass size={16} className="text-[#c9a962]" />
            </div>
            <div>
              <h2
                className="text-base font-bold text-[#e8e4d9]"
                style={{ fontFamily: '"Noto Serif SC", "Songti SC", Georgia, serif' }}
              >
                探索之路
              </h2>
              <p className="text-[11px] text-[#e8e4d9]/50 tracking-wider">
                YOUR PHILOSOPHY JOURNEY
              </p>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-4 md:p-5 space-y-5 max-h-[calc(100vh-240px)] overflow-y-auto custom-scrollbar">
          {/* 已访问节点列表 */}
          <section>
            <h3 className="flex items-center gap-1.5 text-xs font-semibold text-[#c9a962]/90 mb-3 tracking-wider uppercase">
              <MapPin size={12} />
              已探索思想
            </h3>

            {visitedNodes.length > 0 ? (
              <div className="space-y-2">
                {visitedNodes.map((node, idx) => (
                  <motion.div
                    key={node!.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer group"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                    whileHover={{
                      background: 'rgba(201,169,98,0.08)',
                      borderColor: 'rgba(201,169,98,0.25)',
                    }}
                  >
                    {/* 颜色圆点 */}
                    <div
                      className="flex-shrink-0 w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: node!.color,
                        boxShadow: `0 0 8px ${node!.color}80`,
                      }}
                    />
                    {/* 节点名称 */}
                    <span
                      className="flex-1 text-sm font-medium text-[#e8e4d9]/90 group-hover:text-[#e8e4d9] transition-colors truncate"
                      style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                    >
                      {node!.name}
                    </span>
                    {/* 分类标签 */}
                    <span className="text-[10px] text-[#e8e4d9]/40 flex-shrink-0">
                      {node!.era.split('-')[0]}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div
                className="text-center py-6 rounded-xl text-[#e8e4d9]/40"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px dashed rgba(201,169,98,0.15)',
                }}
              >
                <MapPin size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-xs">尚未探索任何思想</p>
                <p className="text-[11px] mt-1 text-[#e8e4d9]/30">开始探索以点亮节点</p>
              </div>
            )}
          </section>

          {/* 思想倾向标签云 */}
          <section>
            <h3 className="flex items-center gap-1.5 text-xs font-semibold text-[#c9a962]/90 mb-3 tracking-wider uppercase">
              <span className="w-3 h-3 rounded-full border border-[#c9a962]/60 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a962]" />
              </span>
              思想倾向
            </h3>

            {sortedTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {sortedTags.map(([tag, score], idx) => {
                  const color = getTagColor(tag);
                  const size = 10 + (score / maxTagScore) * 6;
                  const opacity = 0.5 + (score / maxTagScore) * 0.5;
                  return (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity, scale: 1 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      className="px-2.5 py-1 rounded-full font-medium"
                      style={{
                        fontSize: `${size}px`,
                        background: `${color}15`,
                        border: `1px solid ${color}40`,
                        color,
                        textShadow: `0 0 8px ${color}30`,
                      }}
                    >
                      {tag}
                    </motion.span>
                  );
                })}
              </div>
            ) : (
              <div
                className="text-center py-5 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px dashed rgba(201,169,98,0.15)',
                }}
              >
                <p className="text-xs text-[#e8e4d9]/40">探索后将显示你的思想倾向</p>
              </div>
            )}
          </section>

          {/* 操作按钮区 */}
          <section className="space-y-2.5 pt-2">
            {/* 开始/继续探索按钮 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExplore}
              className="w-full relative overflow-hidden group"
            >
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #c9a962 0%, #e8c987 50%, #c9a962 100%)',
                  boxShadow: '0 4px 20px rgba(201,169,98,0.4)',
                }}
              />
              {/* 按钮光泽 */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                }}
              />
              <div className="relative flex items-center justify-center gap-2 py-3.5 px-4">
                {hasProgress ? (
                  <>
                    <RefreshCw size={18} className="text-[#2c1810]" />
                    <span
                      className="font-bold text-[#2c1810]"
                      style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                    >
                      继续探索
                    </span>
                    <span className="text-xs text-[#2c1810]/70 ml-1">
                      （{answeredQuestions.length} 问）
                    </span>
                  </>
                ) : (
                  <>
                    <Play size={18} className="text-[#2c1810]" />
                    <span
                      className="font-bold text-[#2c1810]"
                      style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                    >
                      开始探索
                    </span>
                  </>
                )}
              </div>
            </motion.button>

            {/* 重新开始按钮 */}
            {hasProgress && (
              <motion.button
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                whileHover={{ backgroundColor: 'rgba(201,169,98,0.08)' }}
                whileTap={{ scale: 0.98 }}
                onClick={resetExploration}
                className={cn(
                  'w-full py-2.5 rounded-xl text-sm transition-all',
                  'border border-[rgba(201,169,98,0.25)]',
                  'text-[#c9a962]/80 hover:text-[#c9a962]',
                )}
                style={{ background: 'rgba(201,169,98,0.05)' }}
              >
                重新开始
              </motion.button>
            )}
          </section>
        </div>

        {/* 底部渐变遮罩（防止内容贴边） */}
        <div
          className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(15,22,36,0.9))',
          }}
        />
      </div>
    </motion.aside>
  );
}
