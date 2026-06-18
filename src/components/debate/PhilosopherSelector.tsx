import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, ChevronRight, Sparkles, ArrowRight, Users } from 'lucide-react';
import { philosopherNPCs } from '@/data/philosophers';
import { debateMatchups, getAvailableOpponents, getMatchupBetween } from '@/data/debateArena';
import type { PhilosopherNPC, DebateMatchup } from '@/types';
import { cn } from '@/lib/utils';

interface PhilosopherSelectorProps {
  onStartDebate: (matchup: DebateMatchup) => void;
}

const categoryColors: Record<string, { color: string; bg: string; border: string }> = {
  ancient: { color: '#c9a962', bg: 'rgba(201,169,98,0.1)', border: 'rgba(201,169,98,0.3)' },
  rationalism: { color: '#3498db', bg: 'rgba(52,152,219,0.1)', border: 'rgba(52,152,219,0.3)' },
  empiricism: { color: '#27ae60', bg: 'rgba(39,174,96,0.1)', border: 'rgba(39,174,96,0.3)' },
  german: { color: '#9b59b6', bg: 'rgba(155,89,182,0.1)', border: 'rgba(155,89,182,0.3)' },
  modern: { color: '#e74c3c', bg: 'rgba(231,76,60,0.1)', border: 'rgba(231,76,60,0.3)' },
};

const categoryLabels: Record<string, string> = {
  ancient: '古希腊',
  rationalism: '理性主义',
  empiricism: '经验主义',
  german: '德国古典',
  modern: '现代',
};

export default function PhilosopherSelector({ onStartDebate }: PhilosopherSelectorProps) {
  const [selectedA, setSelectedA] = useState<PhilosopherNPC | null>(null);
  const [selectedB, setSelectedB] = useState<PhilosopherNPC | null>(null);

  const availableForB = selectedA ? getAvailableOpponents(selectedA.id) : [];
  const matchup = selectedA && selectedB ? getMatchupBetween(selectedA.id, selectedB.id) : null;

  const canStart = !!matchup;

  const handleSelect = (philosopher: PhilosopherNPC) => {
    if (!selectedA) {
      setSelectedA(philosopher);
    } else if (!selectedB) {
      if (philosopher.id === selectedA.id) return;
      setSelectedB(philosopher);
    } else {
      setSelectedA(philosopher);
      setSelectedB(null);
    }
  };

  const handleReset = () => {
    setSelectedA(null);
    setSelectedB(null);
  };

  const handleStart = () => {
    if (matchup) {
      onStartDebate(matchup);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h2
          className="text-3xl md:text-4xl font-bold text-[#e8e4d9] mb-3"
          style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
        >
          哲学辩论竞技场
        </h2>
        <p className="text-[#e8e4d9]/60 max-w-2xl mx-auto">
          选择两位哲学家，观看他们基于各自思想体系展开的观点对决。每一场辩论都揭示哲学思想的核心张力。
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel rounded-2xl p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          <div className="flex-1 max-w-xs w-full">
            <div className="text-center text-sm text-[#e8e4d9]/50 mb-2">辩论者 A</div>
            <AnimatePresence mode="wait">
              {selectedA ? (
                <motion.div
                  key={selectedA.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(52,152,219,0.15) 0%, rgba(52,152,219,0.05) 100%)',
                    border: '1px solid rgba(52,152,219,0.3)',
                  }}
                >
                  <span className="text-3xl">{selectedA.portrait}</span>
                  <div>
                    <div className="font-bold text-[#e8e4d9]">{selectedA.name}</div>
                    <div className="text-xs text-[#e8e4d9]/50">{selectedA.title}</div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-[#e8e4d9]/10 text-[#e8e4d9]/30"
                >
                  <Users size={20} />
                  <span className="text-sm">点击下方选择</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="flex-shrink-0"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(201,169,98,0.2) 0%, rgba(201,169,98,0.05) 100%)',
                border: '1px solid rgba(201,169,98,0.4)',
              }}
            >
              <Swords size={20} className="text-[#c9a962]" />
            </div>
          </motion.div>

          <div className="flex-1 max-w-xs w-full">
            <div className="text-center text-sm text-[#e8e4d9]/50 mb-2">辩论者 B</div>
            <AnimatePresence mode="wait">
              {selectedB ? (
                <motion.div
                  key={selectedB.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(231,76,60,0.15) 0%, rgba(231,76,60,0.05) 100%)',
                    border: '1px solid rgba(231,76,60,0.3)',
                  }}
                >
                  <span className="text-3xl">{selectedB.portrait}</span>
                  <div>
                    <div className="font-bold text-[#e8e4d9]">{selectedB.name}</div>
                    <div className="text-xs text-[#e8e4d9]/50">{selectedB.title}</div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-[#e8e4d9]/10 text-[#e8e4d9]/30"
                >
                  <Users size={20} />
                  <span className="text-sm">点击下方选择</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {selectedA && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-center gap-3 mt-4"
            >
              <button onClick={handleReset} className="btn-ghost text-sm py-1.5 px-4">
                重新选择
              </button>
              {canStart && matchup && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={handleStart}
                  className="btn-gold flex items-center gap-2 text-sm py-1.5 px-4"
                >
                  <Sparkles size={14} />
                  开始辩论
                </motion.button>
              )}
              {selectedA && !selectedB && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-sm text-[#c9a962]/70"
                >
                  <ArrowRight size={14} />
                  请选择对方辩友
                </motion.div>
              )}
              {selectedA && selectedB && !canStart && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-[#e74c3c]/70"
                >
                  这两位哲学家暂无预设辩题，请选择其他组合
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {matchup && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]"
          >
            <div className="text-center">
              <div className="text-xs text-[#c9a962]/60 mb-1">辩题</div>
              <div className="font-bold text-[#c9a962]" style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}>
                {matchup.topic}
              </div>
              <div className="text-sm text-[#e8e4d9]/50 mt-1">{matchup.description}</div>
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-[#c9a962]" />
          <span className="text-sm font-semibold tracking-wider text-[#c9a962]">经典对决</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {debateMatchups.map((m, idx) => {
            const pA = philosopherNPCs.find((p) => p.id === m.philosopherA);
            const pB = philosopherNPCs.find((p) => p.id === m.philosopherB);
            if (!pA || !pB) return null;

            const isSelected = (selectedA?.id === pA.id && selectedB?.id === pB.id) ||
              (selectedA?.id === pB.id && selectedB?.id === pA.id);

            return (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedA(pA);
                  setSelectedB(pB);
                }}
                className={cn(
                  'relative w-full text-left rounded-2xl p-5 transition-all overflow-hidden group',
                )}
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(201,169,98,0.12) 0%, rgba(15,22,36,0.9) 100%)'
                    : 'linear-gradient(135deg, rgba(15,22,36,0.9) 0%, rgba(15,22,36,0.7) 100%)',
                  border: isSelected ? '1px solid rgba(201,169,98,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: isSelected ? '0 4px 20px rgba(201,169,98,0.15)' : '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#c9a962]/5 blur-2xl pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{pA.portrait}</span>
                      <span className="text-[#e8e4d9]/40 text-xs">{pA.name}</span>
                    </div>
                    <Swords size={14} className="text-[#c9a962]/60" />
                    <div className="flex items-center gap-2">
                      <span className="text-[#e8e4d9]/40 text-xs">{pB.name}</span>
                      <span className="text-2xl">{pB.portrait}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-[#e8e4d9] text-sm mb-1" style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}>
                    {m.topic}
                  </h3>
                  <p className="text-xs text-[#e8e4d9]/40 line-clamp-2">{m.description}</p>
                </div>
                <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#e8e4d9]/20 group-hover:text-[#c9a962] transition-colors" />
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} className="text-[#c9a962]" />
          <span className="text-sm font-semibold tracking-wider text-[#c9a962]">自由选择</span>
        </div>
        <p className="text-xs text-[#e8e4d9]/40 mb-4">
          点击选择两位哲学家进行对决，仅显示有预设辩题的组合
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {philosopherNPCs.map((p) => {
            const catStyle = categoryColors[p.category] || categoryColors.modern;
            const isSelectedA = selectedA?.id === p.id;
            const isSelectedB = selectedB?.id === p.id;
            const hasAvailableMatchup = selectedA
              ? availableForB.includes(p.id)
              : debateMatchups.some(
                  (m) => m.philosopherA === p.id || m.philosopherB === p.id,
                );
            const isDisabled = selectedA && p.id === selectedA.id;

            return (
              <motion.button
                key={p.id}
                whileHover={!isDisabled ? { scale: 1.05, y: -2 } : {}}
                whileTap={!isDisabled ? { scale: 0.95 } : {}}
                onClick={() => !isDisabled && handleSelect(p)}
                disabled={isDisabled}
                className={cn(
                  'relative rounded-xl p-3 text-center transition-all',
                )}
                style={{
                  background: isSelectedA
                    ? 'linear-gradient(135deg, rgba(52,152,219,0.15) 0%, rgba(52,152,219,0.05) 100%)'
                    : isSelectedB
                      ? 'linear-gradient(135deg, rgba(231,76,60,0.15) 0%, rgba(231,76,60,0.05) 100%)'
                      : 'rgba(15,22,36,0.8)',
                  border: isSelectedA
                    ? '1px solid rgba(52,152,219,0.5)'
                    : isSelectedB
                      ? '1px solid rgba(231,76,60,0.5)'
                      : hasAvailableMatchup
                        ? '1px solid rgba(255,255,255,0.08)'
                        : '1px solid rgba(255,255,255,0.03)',
                  opacity: isDisabled ? 0.4 : 1,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                }}
              >
                <span className="text-2xl mb-1 block">{p.portrait}</span>
                <div className="text-sm font-bold text-[#e8e4d9]">{p.name}</div>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full inline-block mt-1"
                  style={{
                    backgroundColor: catStyle.bg,
                    border: `1px solid ${catStyle.border}`,
                    color: catStyle.color,
                  }}
                >
                  {categoryLabels[p.category] || p.category}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
