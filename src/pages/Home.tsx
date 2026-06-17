import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import NavHeader from '@/components/common/NavHeader';
import RoutePanel from '@/components/common/RoutePanel';
import ConceptModal from '@/components/common/ConceptModal';
import PhilosophyMap from '@/components/map/PhilosophyMap';
import PhilosopherEncounter from '@/components/philosopher/PhilosopherEncounter';
import PhilosopherProfilePanel from '@/components/philosopher/PhilosopherProfilePanel';
import { useAppStore } from '@/store/useAppStore';

export default function Home() {
  const hydrate = useAppStore((s) => s.hydrate);
  const [showProfiles, setShowProfiles] = useState(false);

  // 初始化时从本地存储恢复数据
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: '#0f1624',
      }}
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
          backgroundImage:
            'radial-gradient(circle, #c9a962 1px, transparent 1px)',
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
      <NavHeader onOpenProfiles={() => setShowProfiles(true)} />

      {/* 主内容区 */}
      <main className="relative z-10 pt-24 md:pt-28 pb-6 md:pb-8 px-4 md:px-6 min-h-screen">
        <div className="max-w-7xl mx-auto h-full">
          <div className="flex gap-4 md:gap-6 h-[calc(100vh-12rem)] md:h-[calc(100vh-13rem)]">
            {/* 左侧悬浮面板 - 桌面端显示 */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <RoutePanel />
            </div>

            {/* 中间思想地图 */}
            <div className="flex-1 min-w-0">
              <PhilosophyMap />
            </div>
          </div>

          {/* 移动端悬浮面板 - 页面底部 */}
          <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(15,22,36,0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(201,169,98,0.25)',
                boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <MobileRouteSummary />
            </div>
          </div>
        </div>
      </main>

      {/* 概念详情弹窗 */}
      <ConceptModal />

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

// 移动端简洁版路线摘要
import { useNavigate } from 'react-router-dom';
import { Play, RefreshCw } from 'lucide-react';
import { philosophyNodes } from '@/data/nodes';
import { getCategoryColor } from '@/utils/colors';

function MobileRouteSummary() {
  const navigate = useNavigate();
  const unlockedNodes = useAppStore((s) => s.unlockedNodes);
  const routeTags = useAppStore((s) => s.routeTags);
  const answeredQuestions = useAppStore((s) => s.answeredQuestions);
  const resetExploration = useAppStore((s) => s.resetExploration);

  const hasProgress = answeredQuestions.length > 0;
  const visitedNodes = unlockedNodes
    .map((id) => philosophyNodes.find((n) => n.id === id))
    .filter(Boolean)
    .slice(0, 5);

  const sortedTags = Object.entries(routeTags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="space-y-3">
      {/* 已解锁节点 */}
      {visitedNodes.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {visitedNodes.map((node) => (
            <div
              key={node!.id}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs"
              style={{
                background: `${getCategoryColor(node!.category)}15`,
                border: `1px solid ${getCategoryColor(node!.category)}40`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getCategoryColor(node!.category) }}
              />
              <span style={{ color: getCategoryColor(node!.category) }}>{node!.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* 标签 */}
      {sortedTags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {sortedTags.map(([tag]) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-[11px] font-medium text-[#c9a962]"
              style={{
                background: 'rgba(201,169,98,0.1)',
                border: '1px solid rgba(201,169,98,0.25)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 按钮 */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => navigate('/explore')}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold text-sm"
          style={{
            background: 'linear-gradient(135deg, #c9a962 0%, #e8c987 100%)',
            color: '#2c1810',
            boxShadow: '0 2px 12px rgba(201,169,98,0.3)',
          }}
        >
          <Play size={14} />
          {hasProgress ? '继续探索' : '开始探索'}
        </button>
        {hasProgress && (
          <button
            onClick={resetExploration}
            className="px-4 py-2.5 rounded-xl text-sm"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(201,169,98,0.25)',
              color: '#c9a962',
            }}
          >
            <RefreshCw size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
