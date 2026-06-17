import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RefreshCw, Home, Sparkles, CheckCircle2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import QuestionCard from '@/components/explore/QuestionCard';
import { getQuestionById } from '@/data/questions';
import { getRandomPhilosopher } from '@/data/philosophers';
import { cn } from '@/lib/utils';

// 背景粒子
const particles = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  delay: Math.random() * 4,
  duration: Math.random() * 4 + 4,
}));

export default function ExploreFlow() {
  const navigate = useNavigate();

  const currentQuestionId = useAppStore((s) => s.currentQuestionId);
  const answeredQuestions = useAppStore((s) => s.answeredQuestions);
  const selectOption = useAppStore((s) => s.selectOption);
  const resetExploration = useAppStore((s) => s.resetExploration);
  const unlockedNodes = useAppStore((s) => s.unlockedNodes);
  const routeTags = useAppStore((s) => s.routeTags);
  const encounteredPhilosophers = useAppStore((s) => s.encounteredPhilosophers);
  const completedChallenges = useAppStore((s) => s.completedChallenges);
  const encounterPhilosopher = useAppStore((s) => s.encounterPhilosopher);

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = currentQuestionId
    ? getQuestionById(currentQuestionId)
    : null;

  const maybeEncounterPhilosopher = () => {
    const encounterChance = 0.35;
    if (Math.random() < encounterChance) {
      const excludeIds = completedChallenges;
      const philosopher = getRandomPhilosopher(excludeIds);
      if (philosopher) {
        encounterPhilosopher(philosopher.id);
        return true;
      }
    }
    return false;
  };

  // 检测是否完成探索
  useEffect(() => {
    if (!currentQuestionId && answeredQuestions.length > 0) {
      setIsCompleted(true);
    }
  }, [currentQuestionId, answeredQuestions.length]);

  // 切换问题时重置状态
  useEffect(() => {
    setSelectedOptionId(null);
    setShowFeedback(false);
  }, [currentQuestionId]);

  // 选择选项
  const handleSelectOption = (optionId: string) => {
    if (showFeedback || !currentQuestion) return;
    setSelectedOptionId(optionId);
  };

  // 确认选择
  const handleConfirm = () => {
    if (!selectedOptionId || !currentQuestion) return;

    const option = currentQuestion.options.find((o) => o.id === selectedOptionId);
    if (!option) return;

    setFeedbackText(option.feedback);
    setShowFeedback(true);
  };

  // 进入下一题
  const handleNext = () => {
    if (!selectedOptionId || !currentQuestion) return;

    const option = currentQuestion.options.find((o) => o.id === selectedOptionId);
    if (!option) return;

    // 调用 store 选择逻辑
    selectOption(currentQuestion.id, selectedOptionId);

    if (!option.nextQuestionId) {
      setIsCompleted(true);
    } else {
      maybeEncounterPhilosopher();
    }
  };

  // 完成页面
  if (isCompleted) {
    const topTags = Object.entries(routeTags)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return (
      <div className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* 背景粒子 */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-[#c9a962]"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
              }}
              animate={{
                opacity: [0.2, 0.9, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative max-w-2xl w-full"
        >
          <div
            className="relative rounded-3xl p-8 md:p-12 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(15,22,36,0.95) 0%, rgba(15,22,36,0.85) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(201,169,98,0.3)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* 光晕装饰 */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#c9a962]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 text-center">
              {/* 完成图标 */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #c9a962 0%, #e8c987 100%)',
                  boxShadow: '0 10px 40px rgba(201,169,98,0.4)',
                }}
              >
                <Sparkles size={36} className="text-[#2c1810]" />
              </motion.div>

              {/* 标题 */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl md:text-4xl font-bold text-[#e8e4d9] mb-3"
                style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
              >
                探索完成
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-[#e8e4d9]/60 mb-8"
              >
                你已穿越哲学的思想迷宫，发现了属于你的智慧之路
              </motion.p>

              {/* 统计数据 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
              >
                <div
                  className="p-5 rounded-2xl text-center"
                  style={{
                    background: 'rgba(201,169,98,0.08)',
                    border: '1px solid rgba(201,169,98,0.25)',
                  }}
                >
                  <div
                    className="text-4xl font-bold text-[#c9a962] mb-1"
                    style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                  >
                    {unlockedNodes.length}
                  </div>
                  <div className="text-xs text-[#e8e4d9]/60 tracking-wider">
                    解锁思想节点
                  </div>
                </div>
                <div
                  className="p-5 rounded-2xl text-center"
                  style={{
                    background: 'rgba(52,152,219,0.08)',
                    border: '1px solid rgba(52,152,219,0.25)',
                  }}
                >
                  <div
                    className="text-4xl font-bold text-blue-400 mb-1"
                    style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                  >
                    {answeredQuestions.length}
                  </div>
                  <div className="text-xs text-[#e8e4d9]/60 tracking-wider">
                    回答问题
                  </div>
                </div>
                <div
                  className="p-5 rounded-2xl text-center"
                  style={{
                    background: 'rgba(155,89,182,0.08)',
                    border: '1px solid rgba(155,89,182,0.25)',
                  }}
                >
                  <div
                    className="text-4xl font-bold text-purple-400 mb-1"
                    style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                  >
                    {encounteredPhilosophers.length}
                  </div>
                  <div className="text-xs text-[#e8e4d9]/60 tracking-wider">
                    遭遇哲人
                  </div>
                </div>
                <div
                  className="p-5 rounded-2xl text-center"
                  style={{
                    background: 'rgba(39,174,96,0.08)',
                    border: '1px solid rgba(39,174,96,0.25)',
                  }}
                >
                  <div
                    className="text-4xl font-bold text-green-400 mb-1"
                    style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                  >
                    {completedChallenges.length}
                  </div>
                  <div className="text-xs text-[#e8e4d9]/60 tracking-wider">
                    完成挑战
                  </div>
                </div>
              </motion.div>

              {/* 思想倾向 */}
              {topTags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mb-10"
                >
                  <p className="text-xs text-[#c9a962]/70 tracking-wider mb-3">
                    你的核心思想倾向
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {topTags.map(([tag, score], idx) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + idx * 0.1 }}
                        className="px-4 py-1.5 rounded-full text-sm font-medium"
                        style={{
                          background: 'linear-gradient(135deg, rgba(201,169,98,0.2) 0%, rgba(201,169,98,0.08) 100%)',
                          border: '1px solid rgba(201,169,98,0.4)',
                          color: '#c9a962',
                        }}
                      >
                        {tag} · {score}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 操作按钮 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/')}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #c9a962 0%, #e8c987 100%)',
                    color: '#2c1810',
                    boxShadow: '0 4px 20px rgba(201,169,98,0.4)',
                  }}
                >
                  <Home size={18} />
                  返回地图
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    resetExploration();
                    setIsCompleted(false);
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(201,169,98,0.3)',
                    color: '#c9a962',
                  }}
                >
                  <RefreshCw size={18} />
                  重新探索
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* 背景光晕 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#c9a962]/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        {/* 进度指示器 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 px-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#e8e4d9]/50 tracking-wider">
              探索进度
            </span>
            <span className="text-sm font-bold text-[#c9a962]">
              {answeredQuestions.length + (showFeedback ? 1 : 0)}
            </span>
          </div>

          {/* 进度条 */}
          <div className="flex-1 mx-4 h-1.5 rounded-full bg-[#e8e4d9]/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #c9a962, #e8c987)',
              }}
              initial={{ width: 0 }}
              animate={{
                width: `${((answeredQuestions.length + (showFeedback ? 1 : 0)) / 8) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" title="已遭遇哲人">
              <User size={12} className="text-purple-400" />
              <span className="text-xs text-purple-400 font-medium">
                {encounteredPhilosophers.length}
              </span>
            </div>
            <span className="text-xs text-[#e8e4d9]/50">8 问</span>
          </div>
        </motion.div>

        {/* 问题卡片 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id + (showFeedback ? '-feedback' : '')}
            initial={{ opacity: 0, x: showFeedback ? 50 : -50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: showFeedback ? -50 : 50, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <QuestionCard question={currentQuestion} className="mb-8" />
          </motion.div>
        </AnimatePresence>

        {/* 选项区域 */}
        <AnimatePresence mode="wait">
          {!showFeedback ? (
            <motion.div
              key="options"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="space-y-3 mb-8"
            >
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOptionId === option.id;
                return (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    whileHover={{ scale: isSelected ? 1 : 1.01, x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSelectOption(option.id)}
                    className={cn(
                      'w-full relative overflow-hidden rounded-2xl p-5 md:p-6 text-left transition-all duration-300',
                      'border',
                      isSelected
                        ? 'border-[#c9a962] bg-[rgba(201,169,98,0.1)]'
                        : 'border-[rgba(255,255,255,0.08)] bg-[rgba(15,22,36,0.6)] hover:border-[rgba(201,169,98,0.35)] hover:bg-[rgba(15,22,36,0.8)]',
                    )}
                    style={{
                      backdropFilter: 'blur(10px)',
                      boxShadow: isSelected
                        ? '0 4px 30px rgba(201,169,98,0.15), inset 0 0 0 1px rgba(201,169,98,0.2)'
                        : '0 4px 20px rgba(0,0,0,0.2)',
                    }}
                  >
                    {/* 左侧选中指示条 */}
                    {isSelected && (
                      <motion.div
                        layoutId="option-indicator"
                        className="absolute top-0 left-0 bottom-0 w-1 rounded-l-2xl"
                        style={{
                          background: 'linear-gradient(180deg, #c9a962, #e8c987)',
                        }}
                      />
                    )}

                    <div className="flex items-start gap-4">
                      {/* 选项序号 */}
                      <div
                        className={cn(
                          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all',
                          isSelected
                            ? 'bg-[#c9a962] text-[#2c1810]'
                            : 'bg-[rgba(255,255,255,0.05)] text-[#e8e4d9]/50',
                        )}
                      >
                        {isSelected ? <CheckCircle2 size={16} /> : String.fromCharCode(65 + idx)}
                      </div>

                      {/* 选项文本 */}
                      <p
                        className={cn(
                          'flex-1 text-sm md:text-base leading-relaxed pt-1 transition-colors',
                          isSelected ? 'text-[#e8e4d9]' : 'text-[#e8e4d9]/80',
                        )}
                        style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                      >
                        {option.text}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            // 反馈面板
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative rounded-2xl overflow-hidden mb-8"
              style={{
                background: 'linear-gradient(135deg, rgba(201,169,98,0.1) 0%, rgba(15,22,36,0.9) 100%)',
                border: '1px solid rgba(201,169,98,0.3)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-1"
                style={{ background: 'linear-gradient(90deg, transparent, #c9a962, transparent)' }}
              />

              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={18} className="text-[#c9a962]" />
                  <span className="text-xs font-semibold tracking-widest text-[#c9a962]">
                    哲思回响
                  </span>
                </div>

                <p
                  className="text-base md:text-lg leading-relaxed text-[#e8e4d9]/90"
                  style={{
                    fontFamily: '"Noto Serif SC", Georgia, serif',
                    lineHeight: 1.9,
                  }}
                >
                  {feedbackText}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 操作按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end gap-3"
        >
          {!showFeedback ? (
            <motion.button
              whileHover={{ scale: selectedOptionId ? 1.03 : 1 }}
              whileTap={{ scale: selectedOptionId ? 0.97 : 1 }}
              onClick={handleConfirm}
              disabled={!selectedOptionId}
              className={cn(
                'flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold transition-all duration-300',
                selectedOptionId
                  ? 'text-[#2c1810] cursor-pointer'
                  : 'text-[#e8e4d9]/30 cursor-not-allowed',
              )}
              style={{
                background: selectedOptionId
                  ? 'linear-gradient(135deg, #c9a962 0%, #e8c987 100%)'
                  : 'rgba(255,255,255,0.05)',
                boxShadow: selectedOptionId
                  ? '0 4px 20px rgba(201,169,98,0.4)'
                  : 'none',
                border: selectedOptionId ? 'none' : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              确认选择
              <ArrowRight size={18} />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold"
              style={{
                background: 'linear-gradient(135deg, #c9a962 0%, #e8c987 100%)',
                color: '#2c1810',
                boxShadow: '0 4px 20px rgba(201,169,98,0.4)',
              }}
            >
              继续探索
              <ArrowRight size={18} />
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
