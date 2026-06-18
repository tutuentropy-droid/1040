import { useEffect } from 'react';
import { motion } from 'framer-motion';
import NavHeader from '@/components/common/NavHeader';
import ThoughtGrowthPath from '@/components/growth/ThoughtGrowthPath';
import { useAppStore } from '@/store/useAppStore';
import { TrendingUp, Sparkles } from 'lucide-react';

export default function GrowthPath() {
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
            radial-gradient(circle at 20% 10%, rgba(39,174,96,0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 90%, rgba(201,169,98,0.05) 0%, transparent 50%)
          `,
        }}
      />

      {/* 点阵纹理 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #c9a962 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      {/* 顶部导航 */}
      <NavHeader />

      {/* 主内容区 */}
      <main className="relative z-10 pt-24 md:pt-28 pb-10 md:pb-14 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* 页面标题 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 md:mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(39,174,96,0.2) 0%, rgba(201,169,98,0.1) 100%)',
                  border: '1px solid rgba(39,174,96,0.35)',
                }}
              >
                <TrendingUp size={20} className="text-green-400" />
              </div>
              <div>
                <h1
                  className="text-2xl md:text-3xl font-bold text-[#e8e4d9]"
                  style={{
                    fontFamily: '"Noto Serif SC", "Songti SC", Georgia, serif',
                  }}
                >
                  思想成长路径
                </h1>
                <p className="text-xs text-[#e8e4d9]/50 tracking-wider mt-0.5">
                  THOUGHT GROWTH PATH
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-2 max-w-2xl"
            >
              <Sparkles size={14} className="text-[#c9a962] mt-0.5 flex-shrink-0" />
              <p
                className="text-sm text-[#e8e4d9]/55 leading-relaxed"
                style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
              >
                记录每一次哲学探索的足迹，见证你的思想如何在与伟大心灵的对话中逐渐成长、丰满。
                这里是属于你的思想成长档案。
              </p>
            </motion.div>
          </motion.div>

          {/* 成长路径内容 */}
          <ThoughtGrowthPath />
        </div>
      </main>
    </div>
  );
}
