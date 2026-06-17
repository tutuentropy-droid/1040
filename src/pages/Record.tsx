import { useEffect } from 'react';
import NavHeader from '@/components/common/NavHeader';
import RecordList from '@/components/record/RecordList';
import { useAppStore } from '@/store/useAppStore';

export default function Record() {
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
      {/* 背景装饰 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 10%, rgba(201,169,98,0.05) 0%, transparent 50%),
            radial-gradient(circle at 90% 90%, rgba(155,89,182,0.04) 0%, transparent 50%)
          `,
        }}
      />

      {/* 点阵纹理 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #c9a962 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* 顶部导航 */}
      <NavHeader />

      {/* 主内容区 */}
      <main className="relative z-10 pt-24 md:pt-28">
        <RecordList />
      </main>
    </div>
  );
}
