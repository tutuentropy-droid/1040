import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Tag,
  Trash2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  History,
  Inbox,
  AlertCircle,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { questions } from '@/data/questions';
import { philosophyNodes } from '@/data/nodes';
import { cn } from '@/lib/utils';
import { getCategoryColor } from '@/utils/colors';
import type { ExplorationRecord } from '@/types';

// 格式化日期
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// 根据路径 ID 获取问题和选择
const getPathDetails = (pathIds: string[]) => {
  return pathIds
    .map((optionId) => {
      for (const q of questions) {
        const option = q.options.find((o) => o.id === optionId);
        if (option) {
          return {
            question: q.title,
            choice: option.text,
          };
        }
      }
      return null;
    })
    .filter(Boolean) as Array<{ question: string; choice: string }>;
};

// 标签颜色
const getTagColor = (tag: string): string => {
  const colors: Record<string, string> = {
    freedom: 'bg-red-500/15 text-red-400 border-red-500/30',
    individual: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    will: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    collective: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    security: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    order: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    balance: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    rational: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    rationalism: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    empiricism: 'bg-green-500/15 text-green-400 border-green-500/30',
    critical: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    existential: 'bg-red-500/15 text-red-400 border-red-500/30',
    happiness: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    wisdom: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    truth: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    power: 'bg-red-600/15 text-red-400 border-red-600/30',
  };
  return colors[tag] || 'bg-[#c9a962]/15 text-[#c9a962] border-[#c9a962]/30';
};

interface RecordItemProps {
  record: ExplorationRecord;
  index: number;
  isLast: boolean;
  onDelete: (id: string) => void;
}

// 单条记录卡片
function RecordItem({ record, index, isLast, onDelete }: RecordItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const pathDetails = getPathDetails(record.path);
  const sortedTags = Object.entries(record.routeTags).sort((a, b) => b[1] - a[1]).slice(0, 6);

  // 解锁节点颜色
  const unlockedNodesData = record.unlockedNodes
    .map((id) => philosophyNodes.find((n) => n.id === id))
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative pl-8 pb-8"
    >
      {/* 时间线 */}
      <div className="absolute left-3 top-0 bottom-0 w-px">
        <div
          className="absolute top-0 bottom-0 left-0 w-full"
          style={{
            background: isLast
              ? 'linear-gradient(180deg, rgba(201,169,98,0.5) 0%, rgba(201,169,98,0.1) 80%, transparent 100%)'
              : 'rgba(201,169,98,0.3)',
          }}
        />
      </div>

      {/* 时间线节点 */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 300 }}
        className="absolute left-0 top-5 w-7 h-7 rounded-full flex items-center justify-center z-10"
        style={{
          background: 'linear-gradient(135deg, #c9a962 0%, #e8c987 100%)',
          boxShadow: '0 0 15px rgba(201,169,98,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
        }}
      >
        <div className="w-2 h-2 rounded-full bg-[#2c1810]" />
      </motion.div>

      {/* 卡片 */}
      <motion.div
        layout
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(15,22,36,0.9) 0%, rgba(15,22,36,0.75) 100%)',
          border: '1px solid rgba(201,169,98,0.2)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}
        whileHover={{ borderColor: 'rgba(201,169,98,0.4)' }}
      >
        {/* 顶部信息栏 */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            {/* 日期与统计 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm text-[#c9a962]/90 mb-2">
                <Calendar size={14} />
                <span>{formatDate(record.timestamp)}</span>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#e8e4d9]/60">
                <span className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-[#c9a962]/70" />
                  <span>
                    解锁 <span className="text-[#c9a962] font-semibold">{record.unlockedNodes.length}</span> 节点
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen size={12} className="text-[#c9a962]/70" />
                  <span>
                    回答 <span className="text-[#c9a962] font-semibold">{record.path.length}</span> 问题
                  </span>
                </span>
              </div>
            </div>

            {/* 删除按钮 */}
            <div className="relative flex-shrink-0">
              {showDeleteConfirm ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5"
                >
                  <button
                    onClick={() => onDelete(record.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors"
                  >
                    确认
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#e8e4d9]/10 text-[#e8e4d9]/70 border border-[#e8e4d9]/15 hover:bg-[#e8e4d9]/15 transition-colors"
                  >
                    取消
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#e8e4d9]/40 hover:text-red-400 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <Trash2 size={16} />
                </motion.button>
              )}
            </div>
          </div>

          {/* 摘要 */}
          <motion.p
            layout
            className="text-[#e8e4d9]/85 text-sm leading-relaxed mb-4"
            style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
          >
            {record.summary}
          </motion.p>

          {/* 解锁节点预览 */}
          {unlockedNodesData.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {unlockedNodesData.slice(0, 6).map((node) => (
                <div
                  key={node!.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                  style={{
                    background: `${getCategoryColor(node!.category)}12`,
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
              {unlockedNodesData.length > 6 && (
                <span className="px-2.5 py-1 rounded-full text-xs text-[#e8e4d9]/50 border border-[#e8e4d9]/10">
                  +{unlockedNodesData.length - 6} 更多
                </span>
              )}
            </div>
          )}

          {/* 标签 */}
          {sortedTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <Tag size={12} className="text-[#c9a962]/50 mt-1" />
              {sortedTags.map(([tag]) => (
                <span
                  key={tag}
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[11px] font-medium border',
                    getTagColor(tag),
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 展开/收起按钮 */}
        <motion.button
          layout
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors border-t border-[rgba(201,169,98,0.1)] hover:bg-[rgba(201,169,98,0.05)]"
          style={{ color: isExpanded ? '#c9a962' : 'rgba(232,228,217,0.5)' }}
        >
          {isExpanded ? (
            <>
              <ChevronUp size={14} />
              收起详情
            </>
          ) : (
            <>
              <ChevronDown size={14} />
              展开详情（{pathDetails.length} 个选择）
            </>
          )}
        </motion.button>

        {/* 详情区域 */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-5 pt-0 space-y-4 border-t border-[rgba(201,169,98,0.1)]">
                {pathDetails.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative pl-5"
                  >
                    {/* 选择序号 */}
                    <div
                      className="absolute left-0 top-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{
                        background: 'linear-gradient(135deg, rgba(201,169,98,0.3) 0%, rgba(201,169,98,0.1) 100%)',
                        border: '1px solid rgba(201,169,98,0.4)',
                        color: '#c9a962',
                      }}
                    >
                      {idx + 1}
                    </div>

                    {/* 问题 */}
                    <p
                      className="text-xs font-semibold text-[#c9a962]/90 mb-1.5"
                      style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                    >
                      Q: {item.question}
                    </p>

                    {/* 选择 */}
                    <p
                      className="text-sm text-[#e8e4d9]/75 leading-relaxed pl-2 border-l-2 border-[rgba(201,169,98,0.25)]"
                      style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                    >
                      {item.choice}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// 空状态
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-24 px-6"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative mb-6"
      >
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(201,169,98,0.15) 0%, rgba(201,169,98,0.05) 100%)',
            border: '1px solid rgba(201,169,98,0.3)',
          }}
        >
          <Inbox size={42} className="text-[#c9a962]/70" />
        </div>
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{ rotate: [0, 15, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        >
          <AlertCircle size={20} className="text-[#c9a962]" />
        </motion.div>
      </motion.div>

      <h3
        className="text-xl font-bold text-[#e8e4d9] mb-2"
        style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
      >
        尚无探索记录
      </h3>
      <p className="text-sm text-[#e8e4d9]/50 text-center max-w-xs leading-relaxed">
        每一次哲学探索都是一次思想的旅行。
        <br />
        开始你的第一段哲学之旅吧。
      </p>
    </motion.div>
  );
}

export default function RecordList() {
  const records = useAppStore((s) => s.records);
  const removeRecord = useAppStore((s) => s.removeRecord);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 md:mb-14"
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(201,169,98,0.2) 0%, rgba(201,169,98,0.08) 100%)',
              border: '1px solid rgba(201,169,98,0.35)',
            }}
          >
            <History size={20} className="text-[#c9a962]" />
          </div>
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold text-[#e8e4d9]"
              style={{ fontFamily: '"Noto Serif SC", "Songti SC", Georgia, serif' }}
            >
              探索记录
            </h1>
            <p className="text-xs text-[#e8e4d9]/50 tracking-wider mt-0.5">
              EXPLORATION HISTORY
            </p>
          </div>
        </div>

        {records.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-[#e8e4d9]/60 pl-13 ml-[52px]"
          >
            共 <span className="text-[#c9a962] font-semibold">{records.length}</span> 次探索记录
          </motion.p>
        )}
      </motion.div>

      {/* 记录列表 */}
      {records.length > 0 ? (
        <div className="relative">
          {records.map((record, idx) => (
            <RecordItem
              key={record.id}
              record={record}
              index={idx}
              isLast={idx === records.length - 1}
              onDelete={removeRecord}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
