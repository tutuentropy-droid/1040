import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter, X, ChevronLeft, ChevronRight, Clock,
  User, BookOpen, Sparkles, ArrowRight, Calendar
} from 'lucide-react';
import type { PhilosophyCategory } from '@/types';
import {
  buildTimelineItems,
  DYNASTY_PERIODS,
  formatYear,
  type TimelineItem,
  type DynastyPeriod,
} from '@/utils/timeline';
import { getCategoryColor, getCategoryLabel, CATEGORY_COLORS } from '@/utils/colors';
import { useAppStore } from '@/store/useAppStore';
import { getNodeById } from '@/data/nodes';
import { getPhilosopherById } from '@/data/philosophers';

type FilterState = {
  dynasties: string[];
  categories: PhilosophyCategory[];
  showPhilosophers: boolean;
  showSchools: boolean;
};

const defaultFilter: FilterState = {
  dynasties: [],
  categories: [],
  showPhilosophers: true,
  showSchools: true,
};

export default function PhilosopherTimeline() {
  const [filter, setFilter] = useState<FilterState>(defaultFilter);
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allItems = useMemo(() => buildTimelineItems(), []);
  const setActivePhilosopher = useAppStore((s) => s.setActivePhilosopher);
  const setSelectedNodeId = useAppStore((s) => s.setSelectedNodeId);
  const completedChallenges = useAppStore((s) => s.completedChallenges);
  const unlockedNodes = useAppStore((s) => s.unlockedNodes);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      if (!filter.showPhilosophers && item.type === 'philosopher') return false;
      if (!filter.showSchools && item.type === 'school') return false;
      if (filter.categories.length > 0 && !filter.categories.includes(item.category)) return false;
      if (filter.dynasties.length > 0) {
        const matched = filter.dynasties.some((dId) => {
          const d = DYNASTY_PERIODS.find((x) => x.id === dId);
          if (!d) return false;
          return (
            (item.startYear >= d.startYear && item.startYear <= d.endYear) ||
            (item.endYear >= d.startYear && item.endYear <= d.endYear) ||
            (item.startYear <= d.startYear && item.endYear >= d.endYear)
          );
        });
        if (!matched) return false;
      }
      return true;
    });
  }, [allItems, filter]);

  const timelineRange = useMemo(() => {
    if (filteredItems.length === 0) return { min: -600, max: 2100 };
    const years = filteredItems.flatMap((i) => [i.startYear, i.endYear]);
    const min = Math.min(...years, -600);
    const max = Math.max(...years, 2100);
    return { min: min - 50, max: max + 50 };
  }, [filteredItems]);

  const yearToPercent = (year: number) => {
    const { min, max } = timelineRange;
    return ((year - min) / (max - min)) * 100;
  };

  const toggleDynasty = (id: string) => {
    setFilter((f) => ({
      ...f,
      dynasties: f.dynasties.includes(id) ? f.dynasties.filter((x) => x !== id) : [...f.dynasties, id],
    }));
  };

  const toggleCategory = (cat: PhilosophyCategory) => {
    setFilter((f) => ({
      ...f,
      categories: f.categories.includes(cat) ? f.categories.filter((x) => x !== cat) : [...f.categories, cat],
    }));
  };

  const resetFilter = () => setFilter(defaultFilter);

  const scrollBy = (dir: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 400, behavior: 'smooth' });
    }
  };

  const handleItemClick = (item: TimelineItem) => {
    setSelectedItem(item);
  };

  const handleInteract = (item: TimelineItem) => {
    if (item.type === 'philosopher') {
      const philosopherId = item.id.replace('p_', '');
      const philosopher = getPhilosopherById(philosopherId);
      if (philosopher) {
        setActivePhilosopher(philosopherId);
        setSelectedItem(null);
      }
    } else {
      const nodeId = item.id.replace('n_', '');
      const node = getNodeById(nodeId);
      if (node) {
        setSelectedNodeId(nodeId);
        setSelectedItem(null);
      }
    }
  };

  const isUnlocked = (item: TimelineItem): boolean => {
    if (item.type === 'philosopher') {
      const pId = item.id.replace('p_', '');
      return completedChallenges.includes(pId);
    }
    const nId = item.id.replace('n_', '');
    return unlockedNodes.includes(nId);
  };

  const activeFilterCount =
    filter.dynasties.length +
    filter.categories.length +
    (filter.showPhilosophers ? 0 : 1) +
    (filter.showSchools ? 0 : 1);

  return (
    <div className="w-full h-full flex flex-col">
      {/* 顶部筛选栏 */}
      <div className="flex items-center justify-between mb-4 md:mb-6 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(201,169,98,0.12), rgba(201,169,98,0.04))',
              border: '1px solid rgba(201,169,98,0.3)',
            }}
          >
            <Clock size={16} className="text-[#c9a962]" />
            <h2
              className="text-lg font-bold"
              style={{ fontFamily: '"Noto Serif SC", Georgia, serif', color: '#e8e4d9' }}
            >
              思想长河
            </h2>
            <span className="text-xs text-[#c9a962]/70 ml-1">
              {filteredItems.length} 条脉络
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 快速类型切换 */}
          <div className="flex items-center gap-1 p-1 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <button
              onClick={() => setFilter((f) => ({ ...f, showPhilosophers: !f.showPhilosophers }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter.showPhilosophers ? 'text-[#e8e4d9]' : 'text-[#e8e4d9]/40'
              }`}
              style={{
                background: filter.showPhilosophers ? 'rgba(201,169,98,0.15)' : 'transparent',
                border: filter.showPhilosophers ? '1px solid rgba(201,169,98,0.3)' : '1px solid transparent',
              }}
            >
              <User size={12} />
              人物
            </button>
            <button
              onClick={() => setFilter((f) => ({ ...f, showSchools: !f.showSchools }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter.showSchools ? 'text-[#e8e4d9]' : 'text-[#e8e4d9]/40'
              }`}
              style={{
                background: filter.showSchools ? 'rgba(201,169,98,0.15)' : 'transparent',
                border: filter.showSchools ? '1px solid rgba(201,169,98,0.3)' : '1px solid transparent',
              }}
            >
              <BookOpen size={12} />
              学派
            </button>
          </div>

          {/* 筛选按钮 */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowFilterPanel((v) => !v)}
            className="relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium"
            style={{
              background: showFilterPanel
                ? 'linear-gradient(135deg, rgba(201,169,98,0.25), rgba(201,169,98,0.08))'
                : 'rgba(255,255,255,0.04)',
              border: showFilterPanel
                ? '1px solid rgba(201,169,98,0.5)'
                : '1px solid rgba(255,255,255,0.1)',
              color: showFilterPanel ? '#c9a962' : '#e8e4d9',
            }}
          >
            <Filter size={14} />
            筛选
            {activeFilterCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full text-[10px] font-bold flex items-center justify-center"
                style={{
                  background: '#c9a962',
                  color: '#0f1624',
                  minWidth: '18px',
                  minHeight: '18px',
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* 筛选面板 */}
      <AnimatePresence>
        {showFilterPanel && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div
              className="p-4 md:p-5 rounded-2xl space-y-4"
              style={{
                background: 'rgba(15,22,36,0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(201,169,98,0.2)',
              }}
            >
              {/* 朝代筛选 */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <Calendar size={13} className="text-[#c9a962]" />
                  <span className="text-xs font-medium text-[#c9a962] tracking-wider">
                    历史时期
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {DYNASTY_PERIODS.map((d) => {
                    const active = filter.dynasties.includes(d.id);
                    return (
                      <motion.button
                        key={d.id}
                        whileHover={{ scale: active ? 1 : 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleDynasty(d.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: active ? `${d.color}20` : 'rgba(255,255,255,0.04)',
                          border: active ? `1px solid ${d.color}60` : '1px solid rgba(255,255,255,0.08)',
                          color: active ? d.color : '#e8e4d9/70',
                        }}
                      >
                        {d.name}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* 学派筛选 */}
              <div className="divider-gold" />
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <Sparkles size={13} className="text-[#c9a962]" />
                  <span className="text-xs font-medium text-[#c9a962] tracking-wider">
                    哲学流派
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(CATEGORY_COLORS) as PhilosophyCategory[]).map((cat) => {
                    const active = filter.categories.includes(cat);
                    const color = CATEGORY_COLORS[cat];
                    return (
                      <motion.button
                        key={cat}
                        whileHover={{ scale: active ? 1 : 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleCategory(cat)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: active ? `${color}18` : 'rgba(255,255,255,0.04)',
                          border: active ? `1px solid ${color}50` : '1px solid rgba(255,255,255,0.08)',
                          color: active ? color : '#e8e4d9/70',
                        }}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: active ? color : '#e8e4d9/30' }}
                        />
                        {getCategoryLabel(cat)}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* 重置按钮 */}
              {activeFilterCount > 0 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={resetFilter}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    background: 'rgba(231,76,60,0.1)',
                    border: '1px solid rgba(231,76,60,0.3)',
                    color: '#E74C3C',
                  }}
                >
                  <X size={12} />
                  清除所有筛选
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 时间轴主体 */}
      <div className="relative flex-1 min-h-0">
        {/* 左右滚动按钮 */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scrollBy(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center hidden md:flex"
          style={{
            background: 'rgba(15,22,36,0.9)',
            border: '1px solid rgba(201,169,98,0.3)',
            color: '#c9a962',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          <ChevronLeft size={18} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scrollBy(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center hidden md:flex"
          style={{
            background: 'rgba(15,22,36,0.9)',
            border: '1px solid rgba(201,169,98,0.3)',
            color: '#c9a962',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          <ChevronRight size={18} />
        </motion.button>

        {/* 可滚动时间轴 */}
        <div
          ref={scrollRef}
          className="w-full h-full overflow-x-auto overflow-y-hidden scroll-smooth"
          style={{ scrollbarWidth: 'thin' }}
        >
          <div
            className="relative h-full min-w-[1800px]"
            style={{ minHeight: '420px' }}
          >
            {/* 朝代背景色带 */}
            {DYNASTY_PERIODS.map((d) => {
              const left = yearToPercent(Math.max(d.startYear, timelineRange.min));
              const right = yearToPercent(Math.min(d.endYear, timelineRange.max));
              const width = right - left;
              if (width <= 0) return null;
              return (
                <div
                  key={d.id}
                  className="absolute top-0 bottom-0 transition-opacity duration-300"
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    background: `linear-gradient(180deg, ${d.color}08 0%, ${d.color}03 50%, ${d.color}08 100%)`,
                    borderLeft: `1px solid ${d.color}15`,
                    borderRight: `1px solid ${d.color}15`,
                    opacity: filter.dynasties.length === 0 || filter.dynasties.includes(d.id) ? 1 : 0.2,
                  }}
                >
                  <div
                    className="absolute top-2 left-2 right-2 text-[10px] font-medium tracking-wider truncate"
                    style={{ color: `${d.color}80` }}
                  >
                    {d.name} · {d.nameEn}
                  </div>
                </div>
              );
            })}

            {/* 中央时间轴主线 */}
            <div
              className="absolute left-0 right-0 h-[3px] rounded-full"
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'linear-gradient(90deg, transparent 0%, rgba(201,169,98,0.15) 5%, rgba(201,169,98,0.6) 20%, rgba(201,169,98,0.6) 80%, rgba(201,169,98,0.15) 95%, transparent 100%)',
                boxShadow: '0 0 20px rgba(201,169,98,0.2)',
              }}
            />

            {/* 年份刻度 */}
            {[-500, -400, -300, -200, -100, 0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000].map((year) => (
              <div
                key={year}
                className="absolute"
                style={{
                  left: `${yearToPercent(year)}%`,
                  top: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                <div
                  className="w-px h-6"
                  style={{
                    background: year % 500 === 0
                      ? 'linear-gradient(180deg, rgba(201,169,98,0.5), rgba(201,169,98,0.1))'
                      : 'rgba(255,255,255,0.06)',
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                  }}
                />
                {year % 500 === 0 && (
                  <div
                    className="absolute top-6 -translate-x-1/2 text-[10px] font-medium whitespace-nowrap"
                    style={{ color: 'rgba(201,169,98,0.6)' }}
                  >
                    {year < 0 ? `前${Math.abs(year)}` : `${year}`}
                  </div>
                )}
              </div>
            ))}

            {/* 时间轴节点 */}
            {filteredItems.map((item, idx) => {
              const color = getCategoryColor(item.category);
              const isTop = idx % 2 === 0;
              const isSelected = selectedItem?.id === item.id;
              const unlocked = isUnlocked(item);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: isTop ? -20 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02, duration: 0.4 }}
                  className="absolute"
                  style={{
                    left: `${yearToPercent(item.midYear)}%`,
                    top: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: isSelected ? 15 : 10,
                  }}
                >
                  {/* 连接线 */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-px"
                    style={{
                      height: '44px',
                      top: isTop ? '-44px' : '0',
                      background: `linear-gradient(${isTop ? '180deg' : '0deg'}, transparent, ${color}50)`,
                    }}
                  />

                  {/* 节点圆点 */}
                  <motion.button
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleItemClick(item)}
                    className="relative"
                    style={{ width: '16px', height: '16px' }}
                  >
                    {/* 外圈光晕 */}
                    <motion.div
                      animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: idx * 0.1 }}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `${color}30`,
                        transform: 'translate(-50%, -50%)',
                        left: '50%',
                        top: '50%',
                        width: '16px',
                        height: '16px',
                      }}
                    />
                    {/* 主体圆点 */}
                    <div
                      className="absolute rounded-full transition-all"
                      style={{
                        transform: 'translate(-50%, -50%)',
                        left: '50%',
                        top: '50%',
                        width: isSelected ? '18px' : '14px',
                        height: isSelected ? '18px' : '14px',
                        background: unlocked
                          ? `linear-gradient(135deg, ${color}, ${color}cc)`
                          : `linear-gradient(135deg, ${color}60, ${color}30)`,
                        border: unlocked
                          ? `2px solid ${color}`
                          : `2px solid ${color}60`,
                        boxShadow: unlocked
                          ? `0 0 12px ${color}60`
                          : 'none',
                      }}
                    />
                    {unlocked && (
                      <div
                        className="absolute w-1.5 h-1.5 rounded-full"
                        style={{
                          transform: 'translate(-50%, -50%)',
                          left: '50%',
                          top: '50%',
                          background: '#fff',
                        }}
                      />
                    )}
                  </motion.button>

                  {/* 卡片 */}
                  <motion.div
                    layoutId={`timeline-card-${item.id}`}
                    initial={false}
                    animate={{
                      scale: isSelected ? 1 : 0.95,
                      opacity: isSelected ? 1 : 0.92,
                      y: isSelected ? 0 : 2,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    onClick={() => handleItemClick(item)}
                    className="absolute cursor-pointer"
                    style={{
                      transform: 'translateX(-50%)',
                      left: '50%',
                      bottom: isTop ? 'calc(50% + 52px)' : 'auto',
                      top: isTop ? 'auto' : 'calc(50% + 52px)',
                      width: '160px',
                    }}
                  >
                    <div
                      className="relative p-3 rounded-xl transition-all"
                      style={{
                        background: isSelected
                          ? `linear-gradient(135deg, ${color}25, rgba(15,22,36,0.95))`
                          : 'rgba(15,22,36,0.85)',
                        border: isSelected
                          ? `1px solid ${color}70`
                          : `1px solid ${color}30`,
                        boxShadow: isSelected
                          ? `0 8px 30px ${color}25, 0 0 0 1px ${color}20`
                          : `0 4px 16px rgba(0,0,0,0.3)`,
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {/* 类型标签 */}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium"
                          style={{
                            background: `${color}18`,
                            color: color,
                            border: `1px solid ${color}30`,
                          }}
                        >
                          {item.type === 'philosopher' ? (
                            <><User size={8} /> 人物</>
                          ) : (
                            <><BookOpen size={8} /> 学派</>
                          )}
                        </span>
                        {unlocked && (
                          <span
                            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium"
                            style={{
                              background: 'rgba(39,174,96,0.15)',
                              color: '#27AE60',
                              border: '1px solid rgba(39,174,96,0.3)',
                            }}
                          >
                            <Sparkles size={7} /> 已解锁
                          </span>
                        )}
                      </div>

                      {/* 名称 */}
                      <h3
                        className="text-sm font-bold leading-tight mb-1"
                        style={{
                          fontFamily: '"Noto Serif SC", Georgia, serif',
                          color: '#e8e4d9',
                        }}
                      >
                        {item.name}
                      </h3>

                      {/* 年代 */}
                      <div
                        className="text-[10px] leading-tight mb-1.5"
                        style={{ color: 'rgba(201,169,98,0.7)' }}
                      >
                        {item.era}
                      </div>

                      {/* 描述 */}
                      {item.title && (
                        <p
                          className="text-[10px] leading-snug line-clamp-2"
                          style={{ color: 'rgba(232,228,217,0.55)' }}
                        >
                          {item.title}
                        </p>
                      )}

                      {/* 展开提示 */}
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 pt-2"
                          style={{ borderTop: `1px solid ${color}20` }}
                        >
                          <motion.button
                            whileHover={{ x: 3 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInteract(item);
                            }}
                            className="flex items-center gap-1 text-[11px] font-semibold transition-all"
                            style={{ color: color }}
                          >
                            {item.type === 'philosopher' ? '发起哲学对话' : '查看思想详情'}
                            <ArrowRight size={11} />
                          </motion.button>
                        </motion.div>
                      )}
                    </div>

                    {/* 三角指向 */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
                      style={{
                        top: isTop ? 'auto' : '-6px',
                        bottom: isTop ? '-6px' : 'auto',
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        ...(isTop
                          ? { borderTop: `6px solid ${isSelected ? color + '70' : 'rgba(255,255,255,0.08)'}` }
                          : { borderBottom: `6px solid ${isSelected ? color + '70' : 'rgba(255,255,255,0.08)'}` }),
                      }}
                    />
                  </motion.div>
                </motion.div>
              );
            })}

            {/* 空状态 */}
            {filteredItems.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <Filter size={24} className="text-[#e8e4d9]/30" />
                  </div>
                  <p className="text-sm text-[#e8e4d9]/50 mb-2">当前筛选条件下没有结果</p>
                  <button
                    onClick={resetFilter}
                    className="text-xs font-medium text-[#c9a962] hover:underline"
                  >
                    清除筛选条件
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 详情弹窗 */}
      <AnimatePresence>
        {selectedItem && (
          <TimelineDetailModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onInteract={() => handleInteract(selectedItem)}
            isUnlocked={isUnlocked(selectedItem)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TimelineDetailModal({
  item,
  onClose,
  onInteract,
  isUnlocked,
}: {
  item: TimelineItem;
  onClose: () => void;
  onInteract: () => void;
  isUnlocked: boolean;
}) {
  const color = getCategoryColor(item.category);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-0 z-[80] flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="relative w-full max-w-lg pointer-events-auto rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(15,22,36,0.98) 0%, rgba(30,25,50,0.98) 100%)',
            border: `1px solid ${color}40`,
            boxShadow: `0 0 60px ${color}20, 0 20px 60px rgba(0,0,0,0.5)`,
          }}
        >
          {/* 顶部渐变条 */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            }}
          />

          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#e8e4d9',
            }}
          >
            <X size={16} />
          </button>

          <div className="p-6 md:p-8">
            {/* 头部 */}
            <div className="flex items-start gap-4 mb-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                  border: `2px solid ${color}60`,
                  boxShadow: `0 0 24px ${color}25`,
                }}
              >
                {item.type === 'philosopher' ? (
                  <span
                    className="text-2xl font-bold"
                    style={{ color, fontFamily: '"Noto Serif SC", Georgia, serif' }}
                  >
                    {item.name.charAt(0)}
                  </span>
                ) : (
                  <BookOpen size={24} style={{ color }} />
                )}
              </motion.div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium"
                    style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
                  >
                    {item.type === 'philosopher' ? '哲学家' : '思想流派'}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium"
                    style={{
                      background: `${color}12`,
                      color,
                      border: `1px solid ${color}25`,
                      opacity: 0.85,
                    }}
                  >
                    {getCategoryLabel(item.category)}
                  </span>
                  {isUnlocked && (
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium"
                      style={{
                        background: 'rgba(39,174,96,0.15)',
                        color: '#27AE60',
                        border: '1px solid rgba(39,174,96,0.3)',
                      }}
                    >
                      <Sparkles size={9} />
                      已解锁
                    </span>
                  )}
                </div>

                <h2
                  className="text-2xl font-bold text-[#e8e4d9] mb-1"
                  style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                >
                  {item.name}
                </h2>

                {item.title && (
                  <p className="text-sm text-[#c9a962]/80">{item.title}</p>
                )}

                <div className="flex items-center gap-1.5 mt-2 text-xs text-[#c9a962]/70">
                  <Calendar size={11} />
                  <span>{item.era}</span>
                  <span className="opacity-40 mx-1">·</span>
                  <span>
                    {formatYear(item.startYear)} — {formatYear(item.endYear)}
                  </span>
                </div>
              </div>
            </div>

            {/* 引言 */}
            {item.quote && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative mb-5 p-4 rounded-2xl"
                style={{
                  background: `${color}08`,
                  border: `1px solid ${color}20`,
                }}
              >
                <p
                  className="text-base leading-relaxed italic text-[#e8e4d9]/90"
                  style={{ fontFamily: '"Noto Serif SC", Georgia, serif', lineHeight: 1.9 }}
                >
                  "{item.quote}"
                </p>
              </motion.div>
            )}

            {/* 描述 */}
            {item.description && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-5"
              >
                <p className="text-sm leading-relaxed text-[#e8e4d9]/70" style={{ lineHeight: 1.8 }}>
                  {item.description}
                </p>
              </motion.div>
            )}

            {/* 核心思想标签 */}
            {item.coreIdeas && item.coreIdeas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <p className="text-xs font-medium mb-2" style={{ color: `${color}aa` }}>
                  核心思想
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.coreIdeas.map((idea) => (
                    <span
                      key={idea}
                      className="px-3 py-1 rounded-full text-xs"
                      style={{
                        background: `${color}15`,
                        border: `1px solid ${color}30`,
                        color,
                      }}
                    >
                      {idea}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 操作按钮 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onInteract}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm"
                style={{
                  background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                  color: '#fff',
                  boxShadow: `0 4px 20px ${color}40`,
                }}
              >
                {item.type === 'philosopher' ? (
                  <><Sparkles size={16} /> 发起哲学对话</>
                ) : (
                  <><BookOpen size={16} /> 查看详细脉络</>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="px-5 py-3 rounded-xl font-medium text-sm"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#e8e4d9',
                }}
              >
                关闭
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
