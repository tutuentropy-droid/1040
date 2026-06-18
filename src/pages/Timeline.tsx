import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import NavHeader from '@/components/common/NavHeader';
import ConceptModal from '@/components/common/ConceptModal';
import PhilosopherEncounter from '@/components/philosopher/PhilosopherEncounter';
import PhilosopherTimeline from '@/components/timeline/PhilosopherTimeline';
import { useAppStore } from '@/store/useAppStore';

export default function Timeline() {
  const hydrate = useAppStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: '#0f1624' }}
    >
      {/* 背景纹理层 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(201,169,98,0.04) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(52,152,219,0.04) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(139,92,246,0.03) 0%, transparent 60%)
          `,
        }}
      />

      {/* 纸张纹理点阵 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #c9a962 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* 装饰性边框 */}
      <div
        className="absolute top-4 left-4 w-20 h-20 border-l border-t pointer-events-none"
        style={{ borderColor: 'rgba(201,169,98,0.2)' }}
      />
      <div
        className="absolute top-4 right-4 w-20 h-20 border-r border-t pointer-events-none"
        style={{ borderColor: 'rgba(201,169,98,0.2)' }}
      />
      <div
        className="absolute bottom-4 left-4 w-20 h-20 border-l border-b pointer-events-none"
        style={{ borderColor: 'rgba(201,169,98,0.2)' }}
      />
      <div
        className="absolute bottom-4 right-4 w-20 h-20 border-r border-b pointer-events-none"
        style={{ borderColor: 'rgba(201,169,98,0.2)' }}
      />

      {/* 顶部导航 */}
      <NavHeader />

      {/* 主内容区 */}
      <main className="relative z-10 pt-24 md:pt-28 pb-6 md:pb-8 px-4 md:px-6 min-h-screen">
        <div className="max-w-7xl mx-auto h-full">
          <div className="h-[calc(100vh-12rem)] md:h-[calc(100vh-13rem)]">
            <PhilosopherTimeline />
          </div>
        </div>
      </main>

      {/* 概念详情弹窗 */}
      <ConceptModal />

      {/* 哲学家遭遇弹窗 */}
      <PhilosopherEncounter />
    </div>
  );
}
