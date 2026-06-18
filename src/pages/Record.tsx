import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavHeader from '@/components/common/NavHeader';
import RecordList from '@/components/record/RecordList';
import ThoughtGrowthPath from '@/components/growth/ThoughtGrowthPath';
import { useAppStore } from '@/store/useAppStore';
import { BookOpen, TrendingUp } from 'lucide-react';

type Tab = 'records' | 'growth';

export default function Record() {
  const hydrate = useAppStore((s) => s.hydrate);
  const [activeTab, setActiveTab] = useState<Tab>('records');

  // 初始化时从本地存储恢复数据
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const tabs: Array<{ key: Tab; label: string; icon: typeof BookOpen }> = [
    { key: 'records', label: '探索记录', icon: BookOpen },
    { key: 'growth', label: '成长路径', icon: TrendingUp },
  ];

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
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          {/* Tab 切换器 */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <div
              className="inline-flex items-center gap-1 p-1 rounded-xl"
              style={{
                background: 'rgba(15,22,36,0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(201,169,98,0.2)',
              }}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <motion.button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    whileTap={{ scale: 0.97 }}
                    className="relative flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      color: isActive ? '#c9a962' : 'rgba(232,228,217,0.55)',
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(201,169,98,0.18), rgba(201,169,98,0.05))'
                        : 'transparent',
                      border: isActive
                        ? '1px solid rgba(201,169,98,0.45)'
                        : '1px solid transparent',
                    }}
                  >
                    <Icon size={15} />
                    <span>{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="record-tab-underline"
                        className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                        style={{
                          background:
                            'linear-gradient(90deg, transparent, #c9a962, transparent)',
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Tab 内容 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'records' ? <RecordList /> : <ThoughtGrowthPath />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
