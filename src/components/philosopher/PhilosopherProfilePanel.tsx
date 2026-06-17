import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Trophy, Clock, Lock, ChevronRight, Quote, User, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { philosopherNPCs, getPhilosopherById } from '@/data/philosophers';
import { getCategoryColor, getCategoryLabel } from '@/utils/colors';
import { getNodeById } from '@/data/nodes';

export default function PhilosopherProfilePanel({ onClose }: { onClose: () => void }) {
  const encounteredPhilosophers = useAppStore((s) => s.encounteredPhilosophers);
  const completedChallenges = useAppStore((s) => s.completedChallenges);
  const setActivePhilosopher = useAppStore((s) => s.setActivePhilosopher);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = selectedId ? getPhilosopherById(selectedId) : null;
  const selectedProfile = selectedId
    ? encounteredPhilosophers.find((p) => p.philosopherId === selectedId)
    : null;

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const handleChallengeAgain = (philosopherId: string) => {
    setActivePhilosopher(philosopherId);
    onClose();
  };

  return (
    <motion.div
      key="profile-panel"
      className="fixed inset-0 z-[70] flex items-stretch justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="relative w-full max-w-md md:max-w-xl max-h-full overflow-y-auto"
        style={{
          background: 'linear-gradient(180deg, rgba(15,22,36,0.98) 0%, rgba(20,25,45,0.98) 100%)',
          borderLeft: '1px solid rgba(201,169,98,0.2)',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.5)',
        }}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <div className="sticky top-0 z-10 px-6 py-5 flex items-center justify-between"
          style={{
            background: 'linear-gradient(180deg, rgba(15,22,36,0.99) 70%, transparent)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(201,169,98,0.15)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(201,169,98,0.2), rgba(155,89,182,0.2))',
                border: '1px solid rgba(201,169,98,0.3)',
              }}
            >
              <BookOpen size={18} className="text-[#c9a962]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#e8e4d9]"
                style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}>
                人物档案
              </h2>
              <p className="text-xs text-[#e8e4d9]/50">
                已解锁 {completedChallenges.length} / {philosopherNPCs.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <X size={16} className="text-[#e8e4d9]/70" />
          </button>
        </div>

        <div className="p-6">
          {!selected ? (
            <div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 rounded-xl text-center"
                  style={{
                    background: 'rgba(155,89,182,0.08)',
                    border: '1px solid rgba(155,89,182,0.25)',
                  }}
                >
                  <div className="text-2xl font-bold text-purple-400 mb-1"
                    style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}>
                    {encounteredPhilosophers.length}
                  </div>
                  <div className="text-[11px] text-[#e8e4d9]/60 tracking-wider">
                    遭遇哲人
                  </div>
                </div>
                <div className="p-4 rounded-xl text-center"
                  style={{
                    background: 'rgba(39,174,96,0.08)',
                    border: '1px solid rgba(39,174,96,0.25)',
                  }}
                >
                  <div className="text-2xl font-bold text-green-400 mb-1"
                    style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}>
                    {completedChallenges.length}
                  </div>
                  <div className="text-[11px] text-[#e8e4d9]/60 tracking-wider">
                    完成挑战
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#e8e4d9]/50 mb-3 tracking-wider">
                哲人图鉴
              </p>
              <div className="space-y-2.5">
                {philosopherNPCs.map((philo) => {
                  const isEncountered = encounteredPhilosophers.some(
                    (p) => p.philosopherId === philo.id,
                  );
                  const isCompleted = completedChallenges.includes(philo.id);
                  const categoryColor = getCategoryColor(philo.category);

                  return (
                    <motion.button
                      key={philo.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={isEncountered ? { x: 4 } : undefined}
                      whileTap={isEncountered ? { scale: 0.99 } : undefined}
                      onClick={() => isEncountered && setSelectedId(philo.id)}
                      className="w-full p-4 rounded-xl text-left transition-all group"
                      style={{
                        background: isEncountered
                          ? `linear-gradient(135deg, ${categoryColor}08, rgba(15,22,36,0.6))`
                          : 'rgba(255,255,255,0.02)',
                        border: isEncountered
                          ? `1px solid ${categoryColor}25`
                          : '1px solid rgba(255,255,255,0.05)',
                        cursor: isEncountered ? 'pointer' : 'not-allowed',
                        opacity: isEncountered ? 1 : 0.5,
                      }}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: isEncountered
                              ? `linear-gradient(135deg, ${categoryColor}25, ${categoryColor}10)`
                              : 'rgba(255,255,255,0.04)',
                            border: isEncountered
                              ? `1px solid ${categoryColor}40`
                              : '1px solid rgba(255,255,255,0.08)',
                          }}
                        >
                          {isEncountered ? (
                            <span className="text-lg font-bold"
                              style={{
                                color: categoryColor,
                                fontFamily: '"Noto Serif SC", Georgia, serif',
                              }}>
                              {philo.name.charAt(0)}
                            </span>
                          ) : (
                            <Lock size={16} className="text-[#e8e4d9]/30" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-semibold text-[#e8e4d9] truncate"
                              style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}>
                              {isEncountered ? philo.name : '???'}
                            </h3>
                            {isCompleted && (
                              <Trophy size={12} className="text-green-400 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-[#e8e4d9]/50 truncate">
                            {isEncountered ? philo.title : '探索过程中解锁'}
                          </p>
                        </div>
                        {isEncountered && (
                          <ChevronRight
                            size={16}
                            className="text-[#e8e4d9]/30 group-hover:text-[#e8e4d9]/60 transition-colors flex-shrink-0"
                          />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={() => setSelectedId(null)}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg mb-5 transition-all hover:bg-white/5"
                  style={{
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#e8e4d9/60',
                  }}
                >
                  <ChevronRight size={12} className="rotate-180" />
                  返回列表
                </button>

                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center relative"
                    style={{
                      background: `linear-gradient(135deg, ${getCategoryColor(selected.category)}30, ${getCategoryColor(selected.category)}10)`,
                      border: `2px solid ${getCategoryColor(selected.category)}50`,
                      boxShadow: `0 0 30px ${getCategoryColor(selected.category)}20`,
                    }}
                  >
                    <span className="text-3xl font-bold"
                      style={{
                        color: getCategoryColor(selected.category),
                        fontFamily: '"Noto Serif SC", Georgia, serif',
                      }}>
                      {selected.name.charAt(0)}
                    </span>
                    {selectedProfile?.challengeCompletedAt && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #27AE60, #2ECC71)',
                        }}
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Trophy size={12} className="text-white" />
                      </motion.div>
                    )}
                  </motion.div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-2"
                    style={{
                      background: `${getCategoryColor(selected.category)}15`,
                      color: getCategoryColor(selected.category),
                      border: `1px solid ${getCategoryColor(selected.category)}35`,
                    }}>
                    {selected.title}
                  </span>

                  <h2 className="text-2xl md:text-3xl font-bold text-[#e8e4d9] mb-1"
                    style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}>
                    {selected.name}
                  </h2>
                  <p className="text-sm text-[#e8e4d9]/50 mb-1">{selected.era}</p>
                  <p className="text-xs text-[#e8e4d9]/40">
                    {getCategoryLabel(selected.category)}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1 p-3.5 rounded-xl"
                      style={{
                        background: 'rgba(155,89,182,0.06)',
                        border: '1px solid rgba(155,89,182,0.2)',
                      }}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Clock size={12} className="text-purple-400" />
                        <span className="text-[11px] text-purple-400">首次遭遇</span>
                      </div>
                      <p className="text-sm text-[#e8e4d9]/80 font-medium">
                        {selectedProfile ? formatDate(selectedProfile.encounteredAt) : '-'}
                      </p>
                    </div>
                    <div className="flex-1 p-3.5 rounded-xl"
                      style={{
                        background: 'rgba(39,174,96,0.06)',
                        border: '1px solid rgba(39,174,96,0.2)',
                      }}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Trophy size={12} className="text-green-400" />
                        <span className="text-[11px] text-green-400">挑战完成</span>
                      </div>
                      <p className="text-sm text-[#e8e4d9]/80 font-medium">
                        {selectedProfile?.challengeCompletedAt
                          ? formatDate(selectedProfile.challengeCompletedAt)
                          : '未完成'}
                      </p>
                    </div>
                  </div>

                  <div className="relative p-5 rounded-2xl"
                    style={{
                      background: `${getCategoryColor(selected.category)}08`,
                      border: `1px solid ${getCategoryColor(selected.category)}20`,
                    }}
                  >
                    <Quote
                      size={18}
                      className="absolute -top-2.5 left-4"
                      style={{ color: getCategoryColor(selected.category), opacity: 0.6 }}
                    />
                    <p className="text-base leading-relaxed text-[#e8e4d9]/90 italic"
                      style={{
                        fontFamily: '"Noto Serif SC", Georgia, serif',
                        lineHeight: 1.9,
                      }}>
                      {selected.quote}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <User size={13} style={{ color: getCategoryColor(selected.category) }} />
                      <span className="text-xs font-medium"
                        style={{ color: getCategoryColor(selected.category) }}>
                        思想画像
                      </span>
                    </div>
                    <p className="text-sm text-[#e8e4d9]/75 leading-relaxed">
                      {selected.portrait}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <Sparkles size={13} style={{ color: getCategoryColor(selected.category) }} />
                      <span className="text-xs font-medium"
                        style={{ color: getCategoryColor(selected.category) }}>
                        思想标签
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selected.thoughtProfile.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs"
                          style={{
                            background: `${getCategoryColor(selected.category)}12`,
                            border: `1px solid ${getCategoryColor(selected.category)}30`,
                            color: getCategoryColor(selected.category),
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <BookOpen size={13} style={{ color: getCategoryColor(selected.category) }} />
                      <span className="text-xs font-medium"
                        style={{ color: getCategoryColor(selected.category) }}>
                        经典观点
                      </span>
                    </div>
                    <div className="space-y-2">
                      {selected.classicViewpoints.map((vp, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          className="p-3.5 rounded-xl"
                          style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          <p className="text-sm text-[#e8e4d9]/80 leading-relaxed"
                            style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}>
                            {vp}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {selectedProfile?.challengeCompletedAt && (
                    <div>
                      <div className="flex items-center gap-2 mb-2.5">
                        <Trophy size={13} className="text-green-400" />
                        <span className="text-xs font-medium text-green-400">
                          解锁的思想节点
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selected.rewardNodes.map((id) => {
                          const node = getNodeById(id);
                          if (!node) return null;
                          return (
                            <div
                              key={id}
                              className="px-4 py-2 rounded-xl"
                              style={{
                                background: `${getCategoryColor(node.category)}10`,
                                border: `1px solid ${getCategoryColor(node.category)}35`,
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{
                                    backgroundColor: getCategoryColor(node.category),
                                    boxShadow: `0 0 6px ${getCategoryColor(node.category)}60`,
                                  }}
                                />
                                <span
                                  className="text-sm font-medium"
                                  style={{
                                    color: getCategoryColor(node.category),
                                    fontFamily: '"Noto Serif SC", Georgia, serif',
                                  }}
                                >
                                  {node.name}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    {!selectedProfile?.challengeCompletedAt ? (
                      <button
                        onClick={() => handleChallengeAgain(selected.id)}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold"
                        style={{
                          background: `linear-gradient(135deg, ${getCategoryColor(selected.category)}, ${getCategoryColor(selected.category)}cc)`,
                          color: '#fff',
                          boxShadow: `0 4px 20px ${getCategoryColor(selected.category)}40`,
                        }}
                      >
                        <Trophy size={16} />
                        再次挑战
                      </button>
                    ) : (
                      <button
                        onClick={() => handleChallengeAgain(selected.id)}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all hover:opacity-90"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: `1px solid ${getCategoryColor(selected.category)}35`,
                          color: getCategoryColor(selected.category),
                        }}
                      >
                        <Sparkles size={16} />
                        重温对话
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
