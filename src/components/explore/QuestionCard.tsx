import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Question } from '@/types';
import { questions } from '@/data/questions';

// 问题卡片组件 Props
interface QuestionCardProps {
  question: Question;
  className?: string;
}

// 生成星空粒子（固定数组，避免每次渲染重新生成）
const stars = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 1,
  delay: Math.random() * 3,
  duration: Math.random() * 2 + 2,
}));

export default function QuestionCard({ question, className }: QuestionCardProps) {
  // 计算问题序号（从 1 开始）
  const questionIndex = questions.findIndex((q) => q.id === question.id) + 1;

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-3xl p-8 md:p-12',
        'bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]',
        className,
      )}
    >
      {/* 星空背景层 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* 光晕效果 */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/10 blur-3xl" />

        {/* 星星粒子 */}
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* 内容层 */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* 问题序号 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(201,169,98,0.4)] bg-[rgba(201,169,98,0.1)] px-4 py-1.5"
        >
          <span className="text-xs font-medium tracking-widest text-[#c9a962]">
            第 {questionIndex} 问
          </span>
          <span className="text-xs text-[#e8e4d9]/50">/ {questions.length}</span>
        </motion.div>

        {/* 问题标题 - 大号衬线字体 */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          className="mb-6 max-w-3xl text-2xl font-bold leading-relaxed text-[#e8e4d9] md:text-4xl lg:text-5xl"
          style={{ fontFamily: '"Noto Serif SC", "Songti SC", Georgia, serif' }}
        >
          {question.title}
        </motion.h2>

        {/* 问题描述（context 补充说明） */}
        {question.description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
            className="max-w-2xl text-sm leading-relaxed text-[#e8e4d9]/70 md:text-base lg:text-lg"
          >
            {question.description}
          </motion.p>
        )}
      </div>
    </div>
  );
}
