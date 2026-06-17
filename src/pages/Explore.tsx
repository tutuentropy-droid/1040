import { useEffect } from 'react';
import NavHeader from '@/components/common/NavHeader';
import ExploreFlow from '@/components/explore/ExploreFlow';
import { useAppStore } from '@/store/useAppStore';

export default function Explore() {
  const hydrate = useAppStore((s) => s.hydrate);

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
      <NavHeader />

      {/* 主内容区 */}
      <main className="relative z-10">
        <ExploreFlow />
      </main>
    </div>
  );
}
