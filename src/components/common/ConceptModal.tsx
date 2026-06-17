import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, Users, BookOpen, Lightbulb, Lock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getNodeById } from '@/data/nodes';
import { cn } from '@/lib/utils';

// 分类中文映射
const categoryLabels: Record<string, string> = {
  ancient: '古希腊哲学',
  rationalism: '理性主义',
  empiricism: '经验主义',
  german: '德国古典哲学',
  modern: '现代哲学',
};

export default function ConceptModal() {
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useAppStore((s) => s.setSelectedNodeId);
  const unlockedNodes = useAppStore((s) => s.unlockedNodes);

  const node = selectedNodeId ? getNodeById(selectedNodeId) : null;
  const isUnlocked = node ? unlockedNodes.includes(node.id) : false;

  // 关闭弹窗
  const handleClose = () => {
    setSelectedNodeId(null);
  };

  return (
    <AnimatePresence>
      {node && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* 抽屉容器 */}
          <motion.div
            key="drawer"
            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-lg md:max-w-xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* 羊皮纸质感背景 */}
            <div
              className="relative w-full h-full overflow-hidden"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(232, 228, 217, 0.98) 0%, 
                    rgba(223, 215, 195, 0.98) 50%, 
                    rgba(232, 228, 217, 0.98) 100%
                  )
                `,
                boxShadow: '-8px 0 40px rgba(0,0,0,0.4)',
              }}
            >
              {/* 纸张纹理层 */}
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 20% 30%, rgba(201,169,98,0.15) 0%, transparent 50%),
                    radial-gradient(circle at 80% 70%, rgba(160,82,45,0.1) 0%, transparent 50%),
                    radial-gradient(circle at 50% 50%, rgba(201,169,98,0.05) 0%, transparent 70%)
                  `,
                }}
              />

              {/* 羊皮纸边缘纹理 */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 100px rgba(139,90,43,0.15), inset 0 0 30px rgba(201,169,98,0.1)',
                }}
              />

              {/* 左侧装饰金边 */}
              <div
                className="absolute top-0 left-0 bottom-0 w-1"
                style={{
                  background: 'linear-gradient(180deg, transparent, rgba(201,169,98,0.6) 20%, rgba(201,169,98,0.8) 50%, rgba(201,169,98,0.6) 80%, transparent)',
                }}
              />

              {/* 内容区域 */}
              <div className="relative h-full flex flex-col">
                {/* 顶部栏 */}
                <div className="flex items-start justify-between p-6 md:p-8 border-b border-[rgba(201,169,98,0.3)]">
                  <div className="flex-1 pr-4">
                    {/* 分类标签 */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-3"
                      style={{
                        background: 'rgba(201,169,98,0.2)',
                        color: '#8B5A2B',
                        border: '1px solid rgba(201,169,98,0.4)',
                      }}
                    >
                      <Tag size={12} />
                      {categoryLabels[node.category] || node.category}
                    </motion.div>

                    {/* 节点名称 */}
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="text-2xl md:text-3xl font-bold text-[#2c1810] leading-tight"
                      style={{
                        fontFamily: '"Noto Serif SC", "Songti SC", Georgia, serif',
                        textShadow: '0 1px 2px rgba(139,90,43,0.2)',
                      }}
                    >
                      {node.name}
                    </motion.h2>

                    {/* 时期 */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-1.5 mt-2 text-sm text-[#8B5A2B]/80"
                    >
                      <Calendar size={14} />
                      <span>{node.era}</span>
                    </motion.div>
                  </div>

                  {/* 关闭按钮 */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: 'rgba(201,169,98,0.15)',
                      border: '1px solid rgba(201,169,98,0.4)',
                      color: '#8B5A2B',
                    }}
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                {/* 滚动内容区 */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                  {/* 未解锁状态遮罩 */}
                  <div className={cn('relative', !isUnlocked && 'blur-sm select-none pointer-events-none')}>
                    {/* 代表人物 */}
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="mb-6"
                    >
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-[#8B5A2B] mb-3 tracking-wider">
                        <Users size={16} />
                        代表人物
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {node.keyFigures.map((figure, idx) => (
                          <motion.span
                            key={figure}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + idx * 0.05 }}
                            className="px-3 py-1.5 rounded-lg text-sm"
                            style={{
                              background: 'linear-gradient(135deg, rgba(201,169,98,0.15) 0%, rgba(201,169,98,0.05) 100%)',
                              border: '1px solid rgba(201,169,98,0.3)',
                              color: '#5c3a1e',
                            }}
                          >
                            {figure}
                          </motion.span>
                        ))}
                      </div>
                    </motion.section>

                    {/* 简介 */}
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="mb-6"
                    >
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-[#8B5A2B] mb-3 tracking-wider">
                        <BookOpen size={16} />
                        简介
                      </h3>
                      <p
                        className="text-base leading-relaxed text-[#3d2817]"
                        style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                      >
                        {node.description}
                      </p>
                    </motion.section>

                    {/* 详细介绍 */}
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                      className="mb-6"
                    >
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-[#8B5A2B] mb-3 tracking-wider">
                        <BookOpen size={16} />
                        详细介绍
                      </h3>
                      <div
                        className="p-4 rounded-xl text-[#3d2817] leading-relaxed text-[15px]"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 100%)',
                          border: '1px solid rgba(201,169,98,0.2)',
                          fontFamily: '"Noto Serif SC", Georgia, serif',
                          lineHeight: 1.9,
                        }}
                      >
                        {node.detail}
                      </div>
                    </motion.section>

                    {/* 核心观点 */}
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 }}
                    >
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-[#8B5A2B] mb-3 tracking-wider">
                        <Lightbulb size={16} />
                        核心观点
                      </h3>
                      <ul className="space-y-2.5">
                        {node.coreIdeas.map((idea, idx) => (
                          <motion.li
                            key={idea}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + idx * 0.08 }}
                            className="flex items-start gap-3"
                          >
                            <span
                              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                              style={{
                                background: 'linear-gradient(135deg, #c9a962 0%, #e8c987 100%)',
                                color: '#fff',
                                boxShadow: '0 2px 6px rgba(201,169,98,0.4)',
                              }}
                            >
                              {idx + 1}
                            </span>
                            <span
                              className="text-[#3d2817] flex-1 pt-0.5"
                              style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                            >
                              {idea}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.section>
                  </div>

                  {/* 未解锁提示 */}
                  {!isUnlocked && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-auto"
                    >
                      <div
                        className="flex flex-col items-center gap-3 p-8 rounded-2xl text-center"
                        style={{
                          background: 'rgba(44, 24, 16, 0.85)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(201,169,98,0.3)',
                        }}
                      >
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <Lock size={36} className="text-[#c9a962]" />
                        </motion.div>
                        <p
                          className="text-lg font-medium text-[#e8e4d9]"
                          style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                        >
                          该思想尚未解锁
                        </p>
                        <p className="text-sm text-[#e8e4d9]/60">
                          请继续探索以发现更多智慧之光
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* 底部装饰线 */}
                <div
                  className="h-1"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(201,169,98,0.5) 50%, transparent 100%)',
                  }}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
