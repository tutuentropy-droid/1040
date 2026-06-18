import { motion } from 'framer-motion';
import { Map, Compass, BookOpen, Lock, Unlock, Users, Clock, GitBranch, TrendingUp, FlaskConical, Swords } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { philosophyNodes } from '@/data/nodes';
import { philosopherNPCs } from '@/data/philosophers';
import { cn } from '@/lib/utils';

// 导航栏按钮配置
const navItems = [
  { key: 'home', label: '思想地图', icon: Map, path: '/' },
  { key: 'relation', label: '哲人关系', icon: GitBranch, path: '/relation' },
  { key: 'timeline', label: '思想长河', icon: Clock, path: '/timeline' },
  { key: 'experiment', label: '思想实验', icon: FlaskConical, path: '/experiment' },
  { key: 'debate', label: '辩论竞技', icon: Swords, path: '/debate' },
  { key: 'explore', label: '开始探索', icon: Compass, path: '/explore' },
  { key: 'growth', label: '成长路径', icon: TrendingUp, path: '/growth' },
  { key: 'record', label: '探索记录', icon: BookOpen, path: '/record' },
];

interface NavHeaderProps {
  onOpenProfiles?: () => void;
}

export default function NavHeader({ onOpenProfiles }: NavHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const unlockedNodes = useAppStore((s) => s.unlockedNodes);
  const completedChallenges = useAppStore((s) => s.completedChallenges);

  // 总节点数
  const totalNodes = philosophyNodes.length;
  // 已解锁节点数
  const unlockedCount = unlockedNodes.length;

  // 当前激活路径
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* 毛玻璃背景层 */}
      <div
        className="absolute inset-0 backdrop-blur-xl bg-[#0f1624]/80"
        style={{
          background: 'linear-gradient(180deg, rgba(15,22,36,0.95) 0%, rgba(15,22,36,0.8) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      />

      {/* 金边底部分隔线 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(201,169,98,0.6) 20%, rgba(201,169,98,0.9) 50%, rgba(201,169,98,0.6) 80%, transparent 100%)',
        }}
      />

      {/* 内容区域 */}
      <div className="relative h-16 md:h-20 flex items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        {/* 左侧：Logo + 副标题 */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Logo 图标 */}
          <div
            className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(201,169,98,0.2) 0%, rgba(201,169,98,0.05) 100%)',
              border: '1px solid rgba(201,169,98,0.4)',
            }}
          >
            <span
              className="text-xl md:text-2xl font-bold"
              style={{
                fontFamily: '"Noto Serif SC", "Songti SC", Georgia, serif',
                color: '#c9a962',
                textShadow: '0 0 20px rgba(201,169,98,0.5)',
              }}
            >
              思
            </span>
          </div>

          {/* Logo 文字 */}
          <div className="flex flex-col">
            <h1
              className="text-lg md:text-xl font-bold tracking-wide group-hover:opacity-90 transition-opacity"
              style={{
                fontFamily: '"Noto Serif SC", "Songti SC", Georgia, serif',
                color: '#e8e4d9',
              }}
            >
              思哲迷宫
            </h1>
            <p className="text-[10px] md:text-xs text-[#c9a962]/70 tracking-widest">
              PHILOSOPHY MAZE
            </p>
          </div>
        </motion.div>

        {/* 中间：三个导航按钮 */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <motion.button
                key={item.key}
                onClick={() => navigate(item.path)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                  active
                    ? 'text-[#c9a962]'
                    : 'text-[#e8e4d9]/70 hover:text-[#e8e4d9]',
                )}
                style={{
                  background: active
                    ? 'linear-gradient(135deg, rgba(201,169,98,0.15) 0%, rgba(201,169,98,0.05) 100%)'
                    : 'transparent',
                  border: active
                    ? '1px solid rgba(201,169,98,0.4)'
                    : '1px solid transparent',
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>

                {/* 激活状态的下划线 */}
                {active && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-[17px] left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, transparent, #c9a962, transparent)',
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* 右侧：已解锁节点数 / 总节点数 */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* 人物档案按钮 */}
          {onOpenProfiles && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenProfiles}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: completedChallenges.length > 0
                    ? 'linear-gradient(135deg, rgba(155,89,182,0.12), rgba(155,89,182,0.04))'
                    : 'rgba(255,255,255,0.04)',
                  border: completedChallenges.length > 0
                    ? '1px solid rgba(155,89,182,0.3)'
                    : '1px solid rgba(255,255,255,0.08)',
                }}
                title="人物档案"
              >
                <Users
                  size={14}
                  className={completedChallenges.length > 0 ? 'text-purple-400' : 'text-[#e8e4d9]/50'}
                />
                <span className="text-sm font-medium"
                  style={{
                    color: completedChallenges.length > 0 ? '#c4a4e6' : '#e8e4d9]',
                  }}>
                  <span style={{
                    color: completedChallenges.length > 0 ? '#9B59B6' : '#c9a962',
                    fontWeight: 700,
                  }}>{completedChallenges.length}</span>
                  <span className="opacity-50 mx-0.5">/</span>
                  <span className="opacity-70">{philosopherNPCs.length}</span>
                </span>
              </motion.button>

              {/* 移动端人物档案按钮 */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onOpenProfiles}
                className="sm:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                style={{
                  background: completedChallenges.length > 0
                    ? 'rgba(155,89,182,0.1)'
                    : 'rgba(255,255,255,0.04)',
                  border: completedChallenges.length > 0
                    ? '1px solid rgba(155,89,182,0.3)'
                    : '1px solid rgba(255,255,255,0.08)',
                }}
                title="人物档案"
              >
                <Users
                  size={18}
                  className={completedChallenges.length > 0 ? 'text-purple-400' : 'text-[#e8e4d9]/60'}
                />
              </motion.button>
            </>
          )}

          {/* 移动端导航按钮 */}
          <div className="md:hidden flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <motion.button
                  key={item.key}
                  onClick={() => navigate(item.path)}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center transition-all',
                    active
                      ? 'text-[#c9a962] bg-[rgba(201,169,98,0.1)] border border-[rgba(201,169,98,0.3)]'
                      : 'text-[#e8e4d9]/60 hover:text-[#e8e4d9]',
                  )}
                >
                  <Icon size={18} />
                </motion.button>
              );
            })}
          </div>

          {/* 进度显示 */}
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(201,169,98,0.1) 0%, rgba(201,169,98,0.03) 100%)',
              border: '1px solid rgba(201,169,98,0.25)',
            }}
          >
            {unlockedCount > 0 ? (
              <Unlock size={14} className="text-[#c9a962]" />
            ) : (
              <Lock size={14} className="text-[#e8e4d9]/40" />
            )}
            <span className="text-sm font-medium text-[#e8e4d9]/90">
              <span className="text-[#c9a962] font-bold">{unlockedCount}</span>
              <span className="text-[#e8e4d9]/50 mx-1">/</span>
              <span className="text-[#e8e4d9]/70">{totalNodes}</span>
            </span>
          </div>

          {/* 进度条 */}
          <div className="hidden lg:block w-24 h-1.5 rounded-full bg-[#e8e4d9]/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #c9a962 0%, #e8c987 50%, #c9a962 100%)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / totalNodes) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
            />
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
