import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import NavHeader from '@/components/common/NavHeader';
import ExploreFlow from '@/components/explore/ExploreFlow';
import PhilosopherEncounter from '@/components/philosopher/PhilosopherEncounter';
import PhilosopherProfilePanel from '@/components/philosopher/PhilosopherProfilePanel';
import { useAppStore } from '@/store/useAppStore';

export default function Explore() {
  const hydrate = useAppStore((s) => s.hydrate);
  const [showProfiles, setShowProfiles] = useState(false);

  // 初始化时从本地存储恢复数据
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: '#0f1624' }}
    >
      {/* 背景纹理 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 20%, rgba(155,89,182,0.06) 0%, transparent 45%),
            radial-gradient(circle at 85% 80%, rgba(52,152,219,0.06) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(201,169,98,0.03) 0%, transparent 60%)
          `,
        }}
      />

      {/* 点阵纹理 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #e8e4d9 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* 顶部导航 */}
      <NavHeader onOpenProfiles={() => setShowProfiles(true)} />

      {/* 主内容区 */}
      <main className="relative z-10">
        <ExploreFlow />
      </main>

      {/* 哲学家遭遇弹窗 */}
      <PhilosopherEncounter />

      {/* 人物档案面板 */}
      <AnimatePresence>
        {showProfiles && (
          <PhilosopherProfilePanel onClose={() => setShowProfiles(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
