import { useEffect } from 'react';
import { motion } from 'framer-motion';
import NavHeader from '@/components/common/NavHeader';
import PhilosopherRelationGraph from '@/components/relation/PhilosopherRelationGraph';
import { useAppStore } from '@/store/useAppStore';
import { Users, GitBranch } from 'lucide-react';

export default function RelationGraph() {
  const hydrate = useAppStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: '#0f1624' }}
    >
      {/* 背景装饰 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 20%, rgba(155,89,182,0.05) 0%, transparent 50%),
            radial-gradient(circle at 85% 80%, rgba(52,152,219,0.04) 0%, transparent 50%)
          `,
        }}
      />

      {/* 点阵纹理 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #c9a962 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* 顶部导航 */}
      <NavHeader />

      {/* 主内容区 */}
      <main className="relative z-10 pt-24 md:pt-28 pb-6 md:pb-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* 页面标题 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(155,89,182,0.2) 0%, rgba(52,152,219,0.1) 100%)',
                  border: '1px solid rgba(155,89,182,0.35)',
                }}
              >
                <GitBranch size={20} className="text-purple-400" />
              </div>
              <div>
                <h1
                  className="text-2xl md:text-3xl font-bold text-[#e8e4d9]"
                  style={{
                    fontFamily: '"Noto Serif SC", "Songti SC", Georgia, serif',
                  }}
                >
                  哲人关系图谱
                </h1>
                <p className="text-xs text-[#e8e4d9]/50 tracking-wider mt-0.5">
                  PHILOSOPHER RELATIONSHIP GRAPH
                </p>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-[#e8e4d9]/55 leading-relaxed max-w-2xl"
              style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
            >
              穿越两千年的思想史，看哲学家们如何师承、批判、继承与发展。
              每一条连线都承载着伟大心灵之间的对话与交锋。
            </motion.p>
          </motion.div>

          {/* 图谱容器 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="h-[calc(100vh-12rem)] md:h-[calc(100vh-13rem)]"
          >
            <PhilosopherRelationGraph />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
