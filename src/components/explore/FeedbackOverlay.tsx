import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

// 反馈遮罩层 Props
interface FeedbackOverlayProps {
  feedback: string;
  duration?: number;
  onComplete: () => void;
}

export default function FeedbackOverlay({
  feedback,
  duration = 2800,
  onComplete,
}: FeedbackOverlayProps) {
  const [isTimeUp, setIsTimeUp] = useState(false);

  // 计时器
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeUp(true);
      setTimeout(onComplete, 400); // 等待退出动画完成
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
    >
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-[#0a0a14]/90 backdrop-blur-md" />

      {/* 反馈内容卡片 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{
          opacity: isTimeUp ? 0 : 1,
          scale: isTimeUp ? 0.95 : 1,
          y: isTimeUp ? -20 : 0,
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-2xl"
      >
        {/* 装饰光晕 */}
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#c9a962]/20 via-transparent to-[#6366f1]/20 blur-2xl" />

        <div className="relative overflow-hidden rounded-3xl border border-[rgba(201,169,98,0.4)] bg-gradient-to-br from-[#1a1a2e] via-[#1e1e3a] to-[#16162a] p-8 md:p-12">
          {/* 顶部装饰图标 */}
          <div className="mb-6 flex justify-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="rounded-full border border-[#c9a962]/40 bg-[#c9a962]/10 p-4"
            >
              <Sparkles className="h-8 w-8 text-[#c9a962]" />
            </motion.div>
          </div>

          {/* 标题 */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6 text-center text-xl font-semibold text-[#c9a962] md:text-2xl"
            style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
          >
            思考片刻…
          </motion.h3>

          {/* 反馈文本 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center text-base leading-relaxed text-[#e8e4d9]/90 md:text-lg"
            style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
          >
            {feedback}
          </motion.p>

          {/* 底部加载指示器 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex justify-center"
          >
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-2 w-2 rounded-full bg-[#c9a962]"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
