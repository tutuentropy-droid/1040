import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Sparkles,
  Award,
  Compass,
  Brain,
  Target,
  Star,
  ChevronRight,
  Clock,
  BookOpen,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { philosophyNodes, getNodeById } from '@/data/nodes';
import { philosopherNPCs, getPhilosopherById } from '@/data/philosophers';
import { getCategoryColor, getCategoryLabel } from '@/utils/colors';
import type { PhilosophyCategory } from '@/types';

// 标签颜色映射
const TAG_COLORS: Record<string, string> = {
  freedom: '#E74C3C',
  individual: '#E91E63',
  will: '#9B59B6',
  collective: '#27AE60',
  security: '#16A085',
  order: '#3498DB',
  balance: '#F39C12',
  rational: '#2980B9',
  rationalism: '#3498DB',
  empiricism: '#27AE60',
  critical: '#8E44AD',
  existential: '#C0392B',
  happiness: '#F1C40F',
  wisdom: '#E67E22',
  truth: '#2980B9',
  power: '#E74C3C',
};

const getTagColor = (tag: string): string => TAG_COLORS[tag] || '#c9a962';

// 格式化日期
const formatDate = (ts: number) => {
  const d = new Date(ts);
  return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export default function ThoughtGrowthPath() {
  const records = useAppStore((s) => s.records);
  const unlockedNodes = useAppStore((s) => s.unlockedNodes);
  const encounteredPhilosophers = useAppStore((s) => s.encounteredPhilosophers);
  const completedChallenges = useAppStore((s) => s.completedChallenges);
  const routeTags = useAppStore((s) => s.routeTags);

  // 统计各分类解锁数量
  const categoryStats = useMemo(() => {
    const stats: Record<PhilosophyCategory, { total: number; unlocked: number }> = {
      ancient: { total: 0, unlocked: 0 },
      rationalism: { total: 0, unlocked: 0 },
      empiricism: { total: 0, unlocked: 0 },
      german: { total: 0, unlocked: 0 },
      modern: { total: 0, unlocked: 0 },
    };

    philosophyNodes.forEach((node) => {
      stats[node.category].total++;
      if (unlockedNodes.includes(node.id)) {
        stats[node.category].unlocked++;
      }
    });

    return stats;
  }, [unlockedNodes]);

  // 累计标签（所有记录 + 当前）
  const allTags = useMemo(() => {
    const merged: Record<string, number> = { ...routeTags };
    records.forEach((r) => {
      Object.entries(r.routeTags).forEach(([tag, score]) => {
        merged[tag] = (merged[tag] || 0) + score;
      });
    });
    return Object.entries(merged)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [records, routeTags]);

  // 成长时间线（合并记录和哲学家遭遇）
  const timeline = useMemo(() => {
    const events: Array<{
      id: string;
      timestamp: number;
      type: 'exploration' | 'encounter' | 'challenge';
      title: string;
      description: string;
      icon: 'explore' | 'user' | 'trophy';
      color: string;
    }> = [];

    // 探索记录
    records.forEach((r) => {
      events.push({
        id: `rec_${r.id}`,
        timestamp: r.timestamp,
        type: 'exploration',
        title: `哲学探索 · 解锁 ${r.unlockedNodes.length} 个节点`,
        description: r.summary,
        icon: 'explore',
        color: '#c9a962',
      });
    });

    // 哲学家遭遇和挑战
    encounteredPhilosophers.forEach((p) => {
      const philo = getPhilosopherById(p.philosopherId);
      if (!philo) return;

      events.push({
        id: `enc_${p.philosopherId}`,
        timestamp: p.encounteredAt,
        type: 'encounter',
        title: `遭遇哲人 · ${philo.name}`,
        description: philo.title,
        icon: 'user',
        color: getCategoryColor(philo.category),
      });

      if (p.challengeCompletedAt) {
        events.push({
          id: `ch_${p.philosopherId}`,
          timestamp: p.challengeCompletedAt,
          type: 'challenge',
          title: `挑战完成 · ${philo.name}`,
          description: `解锁思想节点：${philo.rewardNodes
            .map((id) => getNodeById(id)?.name)
            .filter(Boolean)
            .join('、')}`,
          icon: 'trophy',
          color: '#27AE60',
        });
      }
    });

    return events.sort((a, b) => b.timestamp - a.timestamp);
  }, [records, encounteredPhilosophers]);

  // 主要思想流派（按解锁数量排序）
  const topCategories = useMemo(() => {
    return (Object.entries(categoryStats) as [PhilosophyCategory, { total: number; unlocked: number }][])
      .filter(([, s]) => s.unlocked > 0)
      .sort((a, b) => b[1].unlocked - a[1].unlocked);
  }, [categoryStats]);

  // 主导思想倾向
  const dominantTag = allTags.length > 0 ? allTags[0] : null;

  const renderIcon = (icon: string, color: string) => {
    const size = 16;
    switch (icon) {
      case 'explore':
        return <Compass size={size} style={{ color }} />;
      case 'user':
        return <BookOpen size={size} style={{ color }} />;
      case 'trophy':
        return <Award size={size} style={{ color }} />;
      default:
        return <Star size={size} style={{ color }} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 顶部统计概览 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        <StatCard
          icon={<Compass size={18} />}
          label="探索次数"
          value={records.length}
          color="#c9a962"
        />
        <StatCard
          icon={<BookOpen size={18} />}
          label="解锁节点"
          value={`${unlockedNodes.length}/${philosophyNodes.length}`}
          color="#3498DB"
        />
        <StatCard
          icon={<Award size={18} />}
          label="完成挑战"
          value={`${completedChallenges.length}/${philosopherNPCs.length}`}
          color="#27AE60"
        />
        <StatCard
          icon={<Brain size={18} />}
          label="遭遇哲人"
          value={encounteredPhilosophers.length}
          color="#9B59B6"
        />
      </motion.div>

      {/* 主导思想倾向 */}
      {dominantTag && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${getTagColor(dominantTag[0])}12, rgba(15,22,36,0.6))`,
            border: `1px solid ${getTagColor(dominantTag[0])}35`,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${getTagColor(dominantTag[0])}30, ${getTagColor(dominantTag[0])}10)`,
                border: `1px solid ${getTagColor(dominantTag[0])}50`,
              }}
            >
              <TrendingUp size={26} style={{ color: getTagColor(dominantTag[0]) }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} style={{ color: getTagColor(dominantTag[0]) }} />
                <span
                  className="text-xs font-medium tracking-wider"
                  style={{ color: getTagColor(dominantTag[0]) }}
                >
                  主导思想倾向
                </span>
              </div>
              <h3
                className="text-xl font-bold text-[#e8e4d9] mb-1"
                style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
              >
                {dominantTag[0]}
              </h3>
              <p className="text-xs text-[#e8e4d9]/55 leading-relaxed">
                你的哲学探索呈现出明显的 <span style={{ color: getTagColor(dominantTag[0]), fontWeight: 600 }}>{dominantTag[0]}</span> 倾向，
                累计倾向值 <span className="text-[#c9a962] font-semibold">{dominantTag[1]}</span>。
                这表明你在思考中更关注相关的哲学议题。
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* 流派探索进度 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl"
          style={{
            background: 'rgba(15,22,36,0.7)',
            border: '1px solid rgba(201,169,98,0.18)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Target size={16} className="text-[#c9a962]" />
            <h4
              className="text-base font-bold text-[#e8e4d9]"
              style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
            >
              流派探索进度
            </h4>
          </div>

          {topCategories.length > 0 ? (
            <div className="space-y-4">
              {topCategories.map(([cat, stat], idx) => {
                const progress = (stat.unlocked / stat.total) * 100;
                return (
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.08 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor: getCategoryColor(cat),
                            boxShadow: `0 0 6px ${getCategoryColor(cat)}60`,
                          }}
                        />
                        <span className="text-sm font-medium text-[#e8e4d9]/85">
                          {getCategoryLabel(cat)}
                        </span>
                      </div>
                      <span className="text-xs text-[#e8e4d9]/55">
                        {stat.unlocked}/{stat.total}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${getCategoryColor(cat)}, ${getCategoryColor(cat)}cc)`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{
                          duration: 1,
                          delay: 0.4 + idx * 0.1,
                          ease: 'easeOut',
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-[#e8e4d9]/40 text-center py-4">
              尚未解锁任何思想节点，开始探索吧
            </p>
          )}
        </motion.div>

        {/* 思想标签云 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="p-5 rounded-2xl"
          style={{
            background: 'rgba(15,22,36,0.7)',
            border: '1px solid rgba(201,169,98,0.18)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain size={16} className="text-[#c9a962]" />
            <h4
              className="text-base font-bold text-[#e8e4d9]"
              style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
            >
              思想倾向图谱
            </h4>
          </div>

          {allTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {allTags.map(([tag, score], idx) => {
                const maxScore = allTags[0][1];
                const intensity = score / maxScore;
                const size = 11 + intensity * 5;
                const padding = 6 + intensity * 6;
                return (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 + idx * 0.05 }}
                    className="rounded-full font-medium"
                    style={{
                      fontSize: `${size}px`,
                      padding: `${padding / 2}px ${padding}px`,
                      background: `${getTagColor(tag)}${Math.round(intensity * 20 + 8).toString(16).padStart(2, '0')}`,
                      border: `1px solid ${getTagColor(tag)}${Math.round(intensity * 50 + 20).toString(16).padStart(2, '0')}`,
                      color: getTagColor(tag),
                    }}
                  >
                    {tag}
                    <span className="ml-1 opacity-60 text-[10px]">{score}</span>
                  </motion.span>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-[#e8e4d9]/40 text-center py-4">
              暂无思想倾向数据，完成探索问卷即可生成
            </p>
          )}
        </motion.div>
      </div>

      {/* 成长时间线 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="p-5 rounded-2xl"
        style={{
          background: 'rgba(15,22,36,0.7)',
          border: '1px solid rgba(201,169,98,0.18)',
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#c9a962]" />
            <h4
              className="text-base font-bold text-[#e8e4d9]"
              style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
            >
              思想成长足迹
            </h4>
          </div>
          <span className="text-xs text-[#e8e4d9]/45">
            共 {timeline.length} 条记录
          </span>
        </div>

        {timeline.length > 0 ? (
          <div className="relative">
            {timeline.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + idx * 0.06 }}
                className={`relative pl-8 ${idx === timeline.length - 1 ? '' : 'pb-5'}`}
              >
                {/* 时间线 */}
                {idx !== timeline.length - 1 && (
                  <div
                    className="absolute left-[11px] top-6 bottom-0 w-px"
                    style={{
                      background: `linear-gradient(180deg, ${event.color}50, rgba(201,169,98,0.1))`,
                    }}
                  />
                )}

                {/* 节点 */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.5 + idx * 0.06,
                    type: 'spring',
                    stiffness: 300,
                  }}
                  className="absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${event.color}40, ${event.color}15)`,
                    border: `1.5px solid ${event.color}80`,
                    boxShadow: `0 0 10px ${event.color}30`,
                  }}
                >
                  {renderIcon(event.icon, event.color)}
                </motion.div>

                {/* 内容卡片 */}
                <div
                  className="p-3.5 rounded-xl"
                  style={{
                    background: `${event.color}08`,
                    border: `1px solid ${event.color}20`,
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <h5
                      className="text-sm font-semibold text-[#e8e4d9]/90"
                      style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                    >
                      {event.title}
                    </h5>
                    <span className="text-[10px] text-[#e8e4d9]/40 whitespace-nowrap">
                      {formatDate(event.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-[#e8e4d9]/55 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock size={32} className="mx-auto mb-3 text-[#c9a962]/30" />
            <p className="text-sm text-[#e8e4d9]/40 mb-1">暂无成长记录</p>
            <p className="text-xs text-[#e8e4d9]/30">
              你的每一次探索和挑战都将被记录在这里
            </p>
          </div>
        )}
      </motion.div>

      {/* 最近解锁 */}
      {unlockedNodes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-2xl"
          style={{
            background: 'rgba(15,22,36,0.7)',
            border: '1px solid rgba(201,169,98,0.18)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-[#c9a962]" />
            <h4
              className="text-base font-bold text-[#e8e4d9]"
              style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
            >
              已解锁的思想灯塔
            </h4>
          </div>

          <div className="flex flex-wrap gap-2">
            {unlockedNodes.slice(0, 15).map((id) => {
              const node = getNodeById(id);
              if (!node) return null;
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{
                    background: `${getCategoryColor(node.category)}10`,
                    border: `1px solid ${getCategoryColor(node.category)}30`,
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: getCategoryColor(node.category),
                      boxShadow: `0 0 6px ${getCategoryColor(node.category)}60`,
                    }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{
                      color: getCategoryColor(node.category),
                      fontFamily: '"Noto Serif SC", Georgia, serif',
                    }}
                  >
                    {node.name}
                  </span>
                  <ChevronRight size={12} className="text-[#e8e4d9]/25" />
                </motion.div>
              );
            })}
            {unlockedNodes.length > 15 && (
              <span className="flex items-center px-3 py-2 text-xs text-[#e8e4d9]/40">
                +{unlockedNodes.length - 15} 更多
              </span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// 统计卡片
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-4 rounded-xl"
      style={{
        background: `linear-gradient(135deg, ${color}10, rgba(15,22,36,0.6))`,
        border: `1px solid ${color}25`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: `${color}20`,
            border: `1px solid ${color}40`,
          }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
      </div>
      <div
        className="text-2xl font-bold text-[#e8e4d9] mb-0.5"
        style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
      >
        {value}
      </div>
      <div className="text-[11px] text-[#e8e4d9]/50 tracking-wide">
        {label}
      </div>
    </motion.div>
  );
}
