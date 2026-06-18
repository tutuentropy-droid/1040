import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Trophy, Quote, Scroll, Eye, RotateCcw, LogOut } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getPhilosopherById } from '@/data/philosophers';
import { getNodeById } from '@/data/nodes';
import { getCategoryColor } from '@/utils/colors';

type Phase = 'encounter' | 'challenge' | 'result' | 'reward';

export default function PhilosopherEncounter() {
  const activePhilosopherId = useAppStore((s) => s.activePhilosopherId);
  const setActivePhilosopher = useAppStore((s) => s.setActivePhilosopher);
  const completeChallenge = useAppStore((s) => s.completeChallenge);

  const [phase, setPhase] = useState<Phase>('encounter');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const philosopher = activePhilosopherId
    ? getPhilosopherById(activePhilosopherId)
    : null;

  const resetAndClose = () => {
    setPhase('encounter');
    setSelectedOptionId(null);
    setShowHint(false);
    setActivePhilosopher(null);
  };

  if (!philosopher) return null;

  const challenge = philosopher.challenge;
  const selectedOption = selectedOptionId
    ? challenge.options.find((o) => o.id === selectedOptionId)
    : null;

  const handleAcceptChallenge = () => {
    setPhase('challenge');
    setSelectedOptionId(null);
    setShowHint(false);
  };

  const handleSelectOption = (optionId: string) => {
    if (selectedOptionId) return;
    setSelectedOptionId(optionId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOption) return;
    setPhase('result');
  };

  const handleCollectReward = () => {
    completeChallenge(philosopher.id, philosopher.rewardNodes);
    setPhase('reward');
  };

  const handleRetryChallenge = () => {
    setPhase('challenge');
    setSelectedOptionId(null);
    setShowHint(false);
  };

  const rewardNodes = philosopher.rewardNodes
    .map((id) => getNodeById(id))
    .filter(Boolean);

  const categoryColor = getCategoryColor(philosopher.category);

  return (
    <AnimatePresence>
      {philosopher && (
        <>
          <motion.div
            key="npc-backdrop"
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            key="npc-modal"
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(15,22,36,0.98) 0%, rgba(30,25,50,0.98) 100%)',
                border: `1px solid ${categoryColor}40`,
                boxShadow: `0 0 60px ${categoryColor}20, 0 20px 60px rgba(0,0,0,0.5)`,
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                style={{
                  background: `linear-gradient(90deg, transparent, ${categoryColor}, transparent)`,
                }}
              />

              <div className="absolute top-4 right-4 z-10">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={resetAndClose}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#e8e4d9',
                  }}
                >
                  <X size={16} />
                </motion.button>
              </div>

              <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {phase === 'encounter' && (
                    <motion.div
                      key="encounter"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center relative"
                        style={{
                          background: `linear-gradient(135deg, ${categoryColor}30, ${categoryColor}10)`,
                          border: `2px solid ${categoryColor}60`,
                          boxShadow: `0 0 30px ${categoryColor}30`,
                        }}
                      >
                        <span
                          className="text-4xl font-bold"
                          style={{
                            color: categoryColor,
                            fontFamily: '"Noto Serif SC", Georgia, serif',
                          }}
                        >
                          {philosopher.name.charAt(0)}
                        </span>
                        <motion.div
                          className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}cc)`,
                          }}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Sparkles size={12} className="text-white" />
                        </motion.div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mb-2"
                      >
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: `${categoryColor}20`,
                            color: categoryColor,
                            border: `1px solid ${categoryColor}40`,
                          }}
                        >
                          {philosopher.title}
                        </span>
                      </motion.div>

                      <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-3xl font-bold text-[#e8e4d9] mb-2"
                        style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                      >
                        {philosopher.name}
                      </motion.h2>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-sm text-[#e8e4d9]/50 mb-6"
                      >
                        {philosopher.era}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="relative mx-auto max-w-md mb-8 p-5 rounded-2xl"
                        style={{
                          background: `${categoryColor}08`,
                          border: `1px solid ${categoryColor}20`,
                        }}
                      >
                        <Quote
                          size={20}
                          className="absolute -top-2.5 left-4"
                          style={{ color: categoryColor, opacity: 0.6 }}
                        />
                        <p
                          className="text-base leading-relaxed text-[#e8e4d9]/90 italic"
                          style={{
                            fontFamily: '"Noto Serif SC", Georgia, serif',
                            lineHeight: 1.9,
                          }}
                        >
                          {philosopher.quote}
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="mb-6 p-4 rounded-xl text-left"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Eye size={14} style={{ color: categoryColor }} />
                          <span className="text-xs font-medium" style={{ color: categoryColor }}>
                            思想画像
                          </span>
                        </div>
                        <p className="text-sm text-[#e8e4d9]/70 leading-relaxed">
                          {philosopher.portrait}
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="flex flex-wrap justify-center gap-2 mb-8"
                      >
                        {philosopher.thoughtProfile.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-xs"
                            style={{
                              background: `${categoryColor}15`,
                              border: `1px solid ${categoryColor}30`,
                              color: categoryColor,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </motion.div>

                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleAcceptChallenge}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold"
                        style={{
                          background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}cc)`,
                          color: '#fff',
                          boxShadow: `0 4px 20px ${categoryColor}40`,
                        }}
                      >
                        <Scroll size={18} />
                        接受哲学挑战
                      </motion.button>
                    </motion.div>
                  )}

                  {phase === 'challenge' && (
                    <motion.div
                      key="challenge"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                          style={{
                            background: `${categoryColor}20`,
                            border: `1px solid ${categoryColor}40`,
                            color: categoryColor,
                          }}
                        >
                          {philosopher.name.charAt(0)}
                        </div>
                        <div>
                          <h3
                            className="text-lg font-bold text-[#e8e4d9]"
                            style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                          >
                            {philosopher.name}的挑战
                          </h3>
                          <p className="text-xs text-[#e8e4d9]/50">
                            {philosopher.title}
                          </p>
                        </div>
                      </div>

                      <div
                        className="mb-6 p-6 rounded-2xl"
                        style={{
                          background: `linear-gradient(135deg, ${categoryColor}10, rgba(15,22,36,0.8))`,
                          border: `1px solid ${categoryColor}30`,
                        }}
                      >
                        <h4
                          className="text-xl md:text-2xl font-bold text-[#e8e4d9] mb-3 leading-relaxed"
                          style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                        >
                          {challenge.question}
                        </h4>

                        {!showHint && (
                          <button
                            onClick={() => setShowHint(true)}
                            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                            style={{
                              background: `${categoryColor}15`,
                              border: `1px solid ${categoryColor}30`,
                              color: categoryColor,
                            }}
                          >
                            <Eye size={12} />
                            查看提示
                          </button>
                        )}

                        {showHint && (
                          <motion.p
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-[#c9a962]/80 italic"
                          >
                            💡 {challenge.hint}
                          </motion.p>
                        )}
                      </div>

                      <div className="space-y-3 mb-6">
                        {challenge.options.map((option, idx) => {
                          const isSelected = selectedOptionId === option.id;
                          return (
                            <motion.button
                              key={option.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              whileHover={!selectedOptionId ? { x: 4 } : undefined}
                              whileTap={!selectedOptionId ? { scale: 0.99 } : undefined}
                              onClick={() => handleSelectOption(option.id)}
                              className="w-full text-left p-4 rounded-xl transition-all"
                              style={{
                                background: isSelected
                                  ? `${categoryColor}15`
                                  : 'rgba(255,255,255,0.03)',
                                border: isSelected
                                  ? `1px solid ${categoryColor}60`
                                  : '1px solid rgba(255,255,255,0.08)',
                                cursor: selectedOptionId ? 'default' : 'pointer',
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                                  style={{
                                    background: isSelected ? categoryColor : 'rgba(255,255,255,0.08)',
                                    color: isSelected ? '#fff' : '#e8e4d9/50',
                                  }}
                                >
                                  {String.fromCharCode(65 + idx)}
                                </div>
                                <p className="text-sm md:text-base leading-relaxed text-[#e8e4d9]/85 pt-0.5">
                                  {option.text}
                                </p>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>

                      <div className="flex justify-end gap-3">
                        <motion.button
                          whileHover={{ scale: selectedOptionId ? 1.03 : 1 }}
                          whileTap={{ scale: selectedOptionId ? 0.97 : 1 }}
                          onClick={handleConfirmAnswer}
                          disabled={!selectedOptionId}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all"
                          style={{
                            background: selectedOptionId
                              ? `linear-gradient(135deg, ${categoryColor}, ${categoryColor}cc)`
                              : 'rgba(255,255,255,0.05)',
                            color: selectedOptionId ? '#fff' : '#e8e4d9/30',
                            boxShadow: selectedOptionId
                              ? `0 4px 20px ${categoryColor}40`
                              : 'none',
                            cursor: selectedOptionId ? 'pointer' : 'not-allowed',
                          }}
                        >
                          确认回答
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {phase === 'result' && selectedOption && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                        style={{
                          background: selectedOption.isCorrect
                            ? 'linear-gradient(135deg, #27AE60, #2ECC71)'
                            : 'linear-gradient(135deg, #E67E22, #F39C12)',
                          boxShadow: selectedOption.isCorrect
                            ? '0 0 30px rgba(39,174,96,0.4)'
                            : '0 0 30px rgba(230,126,34,0.4)',
                        }}
                      >
                        <Sparkles size={28} className="text-white" />
                      </motion.div>

                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-2xl font-bold text-[#e8e4d9] mb-2"
                        style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                      >
                        {selectedOption.isCorrect ? '洞见深刻！' : '深思可嘉'}
                      </motion.h3>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-sm text-[#e8e4d9]/60 mb-6"
                      >
                        {selectedOption.isCorrect
                          ? `${philosopher.name}对你的回答十分满意`
                          : `${philosopher.name}欣赏你的思考，但有不同的看法`}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="p-5 rounded-2xl text-left mb-8"
                        style={{
                          background: `${categoryColor}08`,
                          border: `1px solid ${categoryColor}25`,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                            style={{
                              background: `${categoryColor}20`,
                              color: categoryColor,
                            }}
                          >
                            {philosopher.name.charAt(0)}
                          </div>
                          <span
                            className="text-sm font-medium"
                            style={{ color: categoryColor }}
                          >
                            {philosopher.name}的回应
                          </span>
                        </div>
                        <p
                          className="text-base leading-relaxed text-[#e8e4d9]/90"
                          style={{
                            fontFamily: '"Noto Serif SC", Georgia, serif',
                            lineHeight: 1.9,
                          }}
                        >
                          {selectedOption.feedback}
                        </p>
                      </motion.div>

                      {selectedOption.isCorrect ? (
                        <motion.button
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={handleCollectReward}
                          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold"
                          style={{
                            background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}cc)`,
                            color: '#fff',
                            boxShadow: `0 4px 20px ${categoryColor}40`,
                          }}
                        >
                          <Trophy size={18} />
                          领取奖励
                        </motion.button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                          className="flex flex-col sm:flex-row items-center justify-center gap-3"
                        >
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleRetryChallenge}
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold"
                            style={{
                              background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}cc)`,
                              color: '#fff',
                              boxShadow: `0 4px 20px ${categoryColor}40`,
                            }}
                          >
                            <RotateCcw size={18} />
                            再试一次
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={resetAndClose}
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold transition-all hover:opacity-90"
                            style={{
                              background: 'rgba(255,255,255,0.05)',
                              border: `1px solid rgba(255,255,255,0.15)`,
                              color: '#e8e4d9',
                            }}
                          >
                            <LogOut size={18} />
                            暂离对话
                          </motion.button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {phase === 'reward' && (
                    <motion.div
                      key="reward"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${categoryColor}30, ${categoryColor}10)`,
                          border: `2px solid ${categoryColor}60`,
                          boxShadow: `0 0 40px ${categoryColor}30`,
                        }}
                      >
                        <Trophy size={36} style={{ color: categoryColor }} />
                      </motion.div>

                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-bold text-[#e8e4d9] mb-2"
                        style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                      >
                        挑战完成！
                      </motion.h3>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-sm text-[#e8e4d9]/60 mb-8"
                      >
                        {philosopher.name}的智慧已为你解锁新的思想节点
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-8"
                      >
                        <p className="text-xs text-[#c9a962]/70 tracking-wider mb-3">
                          解锁的思想节点
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                          {rewardNodes.map((node) => (
                            <motion.div
                              key={node!.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.6 }}
                              className="px-5 py-3 rounded-xl"
                              style={{
                                background: `${getCategoryColor(node!.category)}15`,
                                border: `1px solid ${getCategoryColor(node!.category)}40`,
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-3 h-3 rounded-full"
                                  style={{
                                    backgroundColor: getCategoryColor(node!.category),
                                    boxShadow: `0 0 8px ${getCategoryColor(node!.category)}60`,
                                  }}
                                />
                                <span
                                  className="text-sm font-medium"
                                  style={{
                                    color: getCategoryColor(node!.category),
                                    fontFamily: '"Noto Serif SC", Georgia, serif',
                                  }}
                                >
                                  {node!.name}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="p-4 rounded-xl mb-8"
                        style={{
                          background: `${categoryColor}08`,
                          border: `1px solid ${categoryColor}20`,
                        }}
                      >
                        <p className="text-xs font-medium mb-2" style={{ color: categoryColor }}>
                          📜 人物档案已解锁
                        </p>
                        <p className="text-sm text-[#e8e4d9]/70">
                          {philosopher.name}的完整档案已加入你的收藏
                        </p>
                      </motion.div>

                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={resetAndClose}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold"
                        style={{
                          background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}cc)`,
                          color: '#fff',
                          boxShadow: `0 4px 20px ${categoryColor}40`,
                        }}
                      >
                        继续探索
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
