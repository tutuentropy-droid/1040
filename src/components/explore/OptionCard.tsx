import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { QuestionOption } from '@/types';
import { getNodeById } from '@/data/nodes';
import { tagLabelMap } from './tagLabels';

// 选项卡片组件 Props
interface OptionCardProps {
  option: QuestionOption;
  index: number;
  isSelected: boolean;
  disabled: boolean;
  onClick: () => void;
}

export default function OptionCard({
  option,
  index,
  isSelected,
  disabled,
  onClick,
}: OptionCardProps) {
  // 获取前两个解锁的节点作为 chips 标签展示
  const chipNodes = option.unlockNodes
    .slice(0, 2)
    .map((id) => getNodeById(id))
    .filter(Boolean);

  // 获取前两个 routeTags 作为标签展示
  const chipTags = Object.entries(option.routeTags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([key]) => tagLabelMap[key] || key);

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.1 + index * 0.1,
        ease: 'easeOut',
      }}
      whileHover={
        !disabled && !isSelected
          ? {
              y: -4,
              boxShadow:
                '0 20px 40px -10px rgba(201,169,98,0.3), 0 0 30px rgba(201,169,98,0.15)',
            }
          : undefined
      }
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group relative w-full overflow-hidden rounded-2xl p-6 text-left transition-all duration-300',
        'backdrop-blur-xl backdrop-saturate-150',
        'border border-[rgba(201,169,98,0.4)]',
        'bg-[rgba(30,30,50,0.5)]',
        isSelected && [
          'border-[rgba(201,169,98,0.8)]',
          'bg-[rgba(201,169,98,0.15)]',
          'shadow-[0_0_30px_rgba(201,169,98,0.25)]',
        ],
        disabled && !isSelected && 'cursor-not-allowed opacity-50',
        !disabled && !isSelected && 'cursor-pointer hover:bg-[rgba(40,40,65,0.6)]',
      )}
    >
      {/* 悬停时的发光边框效果 */}
      {!disabled && !isSelected && (
        <div
          className={cn(
            'pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300',
            'group-hover:opacity-100',
          )}
          style={{
            background:
              'linear-gradient(135deg, rgba(201,169,98,0.15) 0%, transparent 50%, rgba(201,169,98,0.1) 100%)',
          }}
        />
      )}

      {/* 选中时的脉动发光效果 */}
      {isSelected && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: [
              '0 0 20px rgba(201,169,98,0.2)',
              '0 0 40px rgba(201,169,98,0.4)',
              '0 0 20px rgba(201,169,98,0.2)',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className="relative z-10">
        {/* 选项序号和内容 */}
        <div className="mb-4 flex items-start gap-4">
          {/* 序号圆圈 */}
          <div
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300',
              isSelected
                ? 'bg-[#c9a962] text-[#1a1a2e]'
                : 'border border-[rgba(201,169,98,0.5)] text-[#c9a962] group-hover:border-[#c9a962] group-hover:bg-[rgba(201,169,98,0.1)]',
            )}
          >
            {String.fromCharCode(65 + index)}
          </div>

          {/* 选项文本 */}
          <p className="pt-1 text-base leading-relaxed text-[#e8e4d9] md:text-lg">
            {option.text}
          </p>
        </div>

        {/* 底部标签 Chips */}
        {(chipNodes.length > 0 || chipTags.length > 0) && (
          <div className="ml-12 flex flex-wrap gap-2">
            {/* 解锁的哲学流派标签 */}
            {chipNodes.map((node) => (
              <span
                key={node!.id}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
                style={{
                  backgroundColor: `${node!.color}20`,
                  border: `1px solid ${node!.color}50`,
                  color: node!.color,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: node!.color }}
                />
                {node!.name}
              </span>
            ))}

            {/* 属性标签 */}
            {chipTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[rgba(201,169,98,0.25)] bg-[rgba(201,169,98,0.08)] px-2.5 py-1 text-xs text-[#c9a962]/80"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.button>
  );
}
