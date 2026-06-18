import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, BookOpen, RotateCcw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { getExperimentById, getFirstStep, resolveExperimentEnding } from '@/data/thoughtExperiments';
import { cn } from '@/lib/utils';
import type { ThoughtExperimentData, ExperimentStep, ExperimentStepOption, ExperimentEnding } from '@/types';

interface ThoughtExperimentFlowProps {
  experiment: ThoughtExperimentData;
  onBack: () => void;
}

export default function ThoughtExperimentFlow({ experiment, onBack }: ThoughtExperimentFlowProps) {
  const navigate = useNavigate();
  const startExperiment = useAppStore((s) => s.startExperiment);
  const selectExperimentOption = useAppStore((s) => s.selectExperimentOption);
  const completeExperiment = useAppStore((s) => s.completeExperiment);
  const experimentSessions = useAppStore((s) => s.experimentSessions);

  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<ExperimentStepOption | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [ending, setEnding] = useState<ExperimentEnding | null>(null);
  const [sessionRouteTags, setSessionRouteTags] = useState<Record<string, number>>({});

  useEffect(() => {
    startExperiment(experiment.id);
    const firstStep = getFirstStep(experiment.id);
    if (firstStep) {
      setCurrentStepId(firstStep.id);
    }
  }, [experiment.id, startExperiment]);

  useEffect(() => {
    setSelectedOptionId(null);
    setShowFeedback(false);
    setCurrentFeedback(null);
  }, [currentStepId]);

  const currentStep: ExperimentStep | null = currentStepId
    ? experiment.steps.find((s) => s.id === currentStepId) ?? null
    : null;

  const currentStepIndex = currentStepId
    ? experiment.steps.findIndex((s) => s.id === currentStepId)
    : -1;

  const handleSelectOption = (optionId: string) => {
    if (showFeedback || !currentStep) return;
    setSelectedOptionId(optionId);
  };

  const handleConfirm = () => {
    if (!selectedOptionId || !currentStep) return;
    const option = currentStep.options.find((o) => o.id === selectedOptionId);
    if (!option) return;
    setCurrentFeedback(option);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (!selectedOptionId || !currentStep || !currentFeedback) return;

    const option = currentFeedback;

    const newTags = { ...sessionRouteTags };
    Object.entries(option.routeTags).forEach(([tag, score]) => {
      newTags[tag] = (newTags[tag] || 0) + score;
    });
    setSessionRouteTags(newTags);

    selectExperimentOption(experiment.id, currentStep.id, selectedOptionId, option.routeTags, option.nextStepId);

    if (!option.nextStepId) {
      completeExperiment(experiment.id);
      const endingId = resolveExperimentEnding(experiment.id, newTags);
      const foundEnding = experiment.endings.find((e) => e.id === endingId);
      setEnding(foundEnding ?? experiment.endings[0] ?? null);
      setIsComplete(true);
    } else {
      setCurrentStepId(option.nextStepId);
    }
  };

  if (isComplete && ending) {
    const topTags = Object.entries(sessionRouteTags)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return (
      <div className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#c9a962]/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/8 blur-3xl" />
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
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#c9a962]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-4xl"
                style={{
                  background: 'linear-gradient(135deg, #c9a962 0%, #e8c987 100%)',
                  boxShadow: '0 10px 40px rgba(201,169,98,0.4)',
                }}
              >
                {experiment.icon}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mb-2"
              >
                <span className="text-xs tracking-widest text-[#c9a962]/70">你的结局</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl md:text-4xl font-bold text-[#c9a962] mb-4"
                style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
              >
                {ending.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-base md:text-lg leading-relaxed text-[#e8e4d9]/90 mb-6"
                style={{ fontFamily: '"Noto Serif SC", Georgia, serif', lineHeight: 1.9 }}
              >
                {ending.description}
              </motion.p>

              {ending.philosophySchools.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap justify-center gap-2 mb-6"
                >
                  {ending.philosophySchools.map((school) => (
                    <span
                      key={school}
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        background: 'linear-gradient(135deg, rgba(201,169,98,0.2) 0%, rgba(201,169,98,0.08) 100%)',
                        border: '1px solid rgba(201,169,98,0.4)',
                        color: '#c9a962',
                      }}
                    >
                      {school}
                    </span>
                  ))}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="relative rounded-2xl p-6 mb-8 text-left"
                style={{
                  background: 'rgba(201,169,98,0.06)',
                  border: '1px solid rgba(201,169,98,0.2)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={16} className="text-[#c9a962]" />
                  <span className="text-xs font-semibold tracking-widest text-[#c9a962]">哲思寄语</span>
                </div>
                <p
                  className="text-sm md:text-base leading-relaxed text-[#e8e4d9]/85"
                  style={{ fontFamily: '"Noto Serif SC", Georgia, serif', lineHeight: 1.9 }}
                >
                  {ending.advice}
                </p>
              </motion.div>

              {topTags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mb-8"
                >
                  <p className="text-xs text-[#c9a962]/70 tracking-wider mb-3">本次思想倾向</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {topTags.map(([tag, score], idx) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 + idx * 0.1 }}
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: 'rgba(155,89,182,0.1)',
                          border: '1px solid rgba(155,89,182,0.3)',
                          color: '#c4a4e6',
                        }}
                      >
                        {tag} · {score}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onBack}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(201,169,98,0.3)',
                    color: '#c9a962',
                  }}
                >
                  <RotateCcw size={18} />
                  继续探索
                </motion.button>

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
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentStep) return null;

  const selectedOption = currentStep.options.find((o) => o.id === selectedOptionId);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#c9a962]/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 px-2"
        >
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <ArrowLeft size={16} className="text-[#e8e4d9]/60" />
            </motion.button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{experiment.icon}</span>
                <span className="text-sm font-bold text-[#c9a962]">{experiment.title}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#e8e4d9]/50 tracking-wider">步骤</span>
            <span className="text-sm font-bold text-[#c9a962]">
              {currentStepIndex >= 0 ? currentStepIndex + 1 : 1}
            </span>
            <span className="text-xs text-[#e8e4d9]/40">/ {experiment.steps.length}</span>
          </div>
        </motion.div>

        <div className="mb-6 h-1 rounded-full bg-[#e8e4d9]/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #c9a962, #e8c987)' }}
            initial={{ width: 0 }}
            animate={{ width: `${((currentStepIndex >= 0 ? currentStepIndex + 1 : 1) / experiment.steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id + (showFeedback ? '-feedback' : '')}
            initial={{ opacity: 0, x: showFeedback ? 50 : -50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: showFeedback ? -50 : 50, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div
              className="relative w-full overflow-hidden rounded-3xl p-8 md:p-12 mb-8"
              style={{
                background: 'linear-gradient(135deg, rgba(15,22,36,0.95) 0%, rgba(25,35,55,0.9) 100%)',
                border: '1px solid rgba(201,169,98,0.2)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
              }}
            >
              <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(201,169,98,0.4)] bg-[rgba(201,169,98,0.1)] px-4 py-1.5"
                >
                  <span className="text-xs font-medium tracking-widest text-[#c9a962]">
                    第 {currentStepIndex >= 0 ? currentStepIndex + 1 : 1} 步
                  </span>
                </motion.div>

                <h2
                  className="text-2xl md:text-3xl font-bold text-[#e8e4d9] mb-4 leading-relaxed"
                  style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                >
                  {currentStep.title}
                </h2>

                <p className="text-sm md:text-base leading-relaxed text-[#e8e4d9]/70">
                  {currentStep.description}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

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
              {currentStep.options.map((option, idx) => {
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
                      'w-full relative overflow-hidden rounded-2xl p-5 md:p-6 text-left transition-all duration-300 border',
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
                    {isSelected && (
                      <motion.div
                        layoutId="exp-option-indicator"
                        className="absolute top-0 left-0 bottom-0 w-1 rounded-l-2xl"
                        style={{ background: 'linear-gradient(180deg, #c9a962, #e8c987)' }}
                      />
                    )}
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all',
                          isSelected
                            ? 'bg-[#c9a962] text-[#2c1810]'
                            : 'bg-[rgba(255,255,255,0.05)] text-[#e8e4d9]/50',
                        )}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <div className="flex-1">
                        <p
                          className={cn(
                            'text-sm md:text-base leading-relaxed pt-1 transition-colors',
                            isSelected ? 'text-[#e8e4d9]' : 'text-[#e8e4d9]/80',
                          )}
                          style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                        >
                          {option.text}
                        </p>
                        {option.philosophySchools.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {option.philosophySchools.map((school) => (
                              <span
                                key={school}
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{
                                  background: 'rgba(201,169,98,0.08)',
                                  border: '1px solid rgba(201,169,98,0.2)',
                                  color: 'rgba(201,169,98,0.7)',
                                }}
                              >
                                {school}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
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
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: 'linear-gradient(90deg, transparent, #c9a962, transparent)' }}
              />

              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={18} className="text-[#c9a962]" />
                  <span className="text-xs font-semibold tracking-widest text-[#c9a962]">即时回响</span>
                </div>

                <p
                  className="text-base md:text-lg leading-relaxed text-[#e8e4d9]/90 mb-6"
                  style={{ fontFamily: '"Noto Serif SC", Georgia, serif', lineHeight: 1.9 }}
                >
                  {currentFeedback?.feedback}
                </p>

                <div
                  className="rounded-xl p-5"
                  style={{
                    background: 'rgba(155,89,182,0.06)',
                    border: '1px solid rgba(155,89,182,0.2)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen size={14} className="text-purple-400" />
                    <span className="text-xs font-semibold tracking-widest text-purple-400">哲学透视</span>
                  </div>
                  <p
                    className="text-sm md:text-base leading-relaxed text-[#e8e4d9]/85"
                    style={{ fontFamily: '"Noto Serif SC", Georgia, serif', lineHeight: 1.9 }}
                  >
                    {currentFeedback?.philosophyExplanation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
              {selectedOption?.nextStepId ? '继续探索' : '查看结局'}
              <ArrowRight size={18} />
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
