import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Swords, Pause, Play } from 'lucide-react';
import { philosopherNPCs } from '@/data/philosophers';
import type { DebateMatchup, PhilosopherNPC } from '@/types';

interface DebateFlowProps {
  matchup: DebateMatchup;
  onComplete: () => void;
}

type DebatePhase = 'intro' | 'debating' | 'complete';

const roundTypeLabels: Record<string, string> = {
  opening: '开场立论',
  rebuttal: '反驳交锋',
  closing: '总结陈词',
};

const roundTypeIcons: Record<string, string> = {
  opening: '📖',
  rebuttal: '⚡',
  closing: '🎭',
};

export default function DebateFlow({ matchup, onComplete }: DebateFlowProps) {
  const [phase, setPhase] = useState<DebatePhase>('intro');
  const [currentRound, setCurrentRound] = useState(0);
  const [currentSide, setCurrentSide] = useState<'A' | 'B'>('A');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const philosopherA = philosopherNPCs.find((p) => p.id === matchup.philosopherA) as PhilosopherNPC;
  const philosopherB = philosopherNPCs.find((p) => p.id === matchup.philosopherB) as PhilosopherNPC;

  const round = matchup.rounds[currentRound];
  const currentArgument = currentSide === 'A' ? round?.philosopherA : round?.philosopherB;
  const currentPhilosopher = currentSide === 'A' ? philosopherA : philosopherB;

  useEffect(() => {
    if (phase === 'intro') {
      const timer = setTimeout(() => setPhase('debating'), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'debating' || !currentArgument || showFullText) return;

    const fullText = currentArgument.argument;
    if (isPaused) {
      if (typingRef.current) clearTimeout(typingRef.current);
      return;
    }

    setIsTyping(true);
    let index = displayedText.length;

    const typeChar = () => {
      if (index < fullText.length && !isPaused) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
        typingRef.current = setTimeout(typeChar, 25 + Math.random() * 15);
      } else {
        setIsTyping(false);
      }
    };

    if (displayedText.length === 0) {
      typingRef.current = setTimeout(typeChar, 300);
    } else if (displayedText.length < fullText.length) {
      typingRef.current = setTimeout(typeChar, 30);
    }

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentRound, currentSide, isPaused, showFullText, currentArgument]);

  const handleNext = () => {
    if (showFullText) {
      if (isTyping) {
        setIsTyping(false);
        if (typingRef.current) clearTimeout(typingRef.current);
      }

      if (currentSide === 'A') {
        setCurrentSide('B');
        setDisplayedText('');
        setShowFullText(false);
      } else {
        if (currentRound < matchup.rounds.length - 1) {
          setCurrentRound((prev) => prev + 1);
          setCurrentSide('A');
          setDisplayedText('');
          setShowFullText(false);
        } else {
          setPhase('complete');
          setTimeout(onComplete, 500);
        }
      }
      return;
    }

    if (isTyping) {
      setIsTyping(false);
      if (typingRef.current) clearTimeout(typingRef.current);
      setDisplayedText(currentArgument.argument);
      setShowFullText(true);
      return;
    }

    setShowFullText(true);
  };

  const handleSkip = () => {
    if (typingRef.current) clearTimeout(typingRef.current);
    setIsTyping(false);
    setDisplayedText(currentArgument?.argument || '');
    setShowFullText(true);
  };

  if (phase === 'intro') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-6xl mb-6"
          >
            ⚔️
          </motion.div>

          <div className="flex items-center justify-center gap-6 mb-6">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <span className="text-5xl block mb-2">{philosopherA.portrait}</span>
              <div className="font-bold text-[#e8e4d9]">{philosopherA.name}</div>
              <div className="text-xs text-[#e8e4d9]/50">{philosopherA.title}</div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: 'spring' }}
              className="flex items-center"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,169,98,0.2) 0%, rgba(201,169,98,0.05) 100%)',
                  border: '2px solid rgba(201,169,98,0.5)',
                }}
              >
                <Swords size={24} className="text-[#c9a962]" />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <span className="text-5xl block mb-2">{philosopherB.portrait}</span>
              <div className="font-bold text-[#e8e4d9]">{philosopherB.name}</div>
              <div className="text-xs text-[#e8e4d9]/50">{philosopherB.title}</div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="glass-panel rounded-2xl p-6 inline-block"
          >
            <div className="text-xs text-[#c9a962]/60 mb-1">辩题</div>
            <div
              className="text-xl font-bold text-[#c9a962] mb-2"
              style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
            >
              {matchup.topic}
            </div>
            <div className="text-sm text-[#e8e4d9]/60 max-w-lg">{matchup.description}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-6 text-[#e8e4d9]/40 text-sm"
          >
            辩论即将开始……
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const sideColorA = '#3498db';
  const sideColorB = '#e74c3c';
  const currentColor = currentSide === 'A' ? sideColorA : sideColorB;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-center gap-6 mb-6">
        <motion.div
          animate={{ scale: currentSide === 'A' ? 1.05 : 0.95, opacity: currentSide === 'A' ? 1 : 0.6 }}
          className="text-center"
        >
          <span className="text-3xl block mb-1">{philosopherA.portrait}</span>
          <div className="text-sm font-bold" style={{ color: sideColorA }}>{philosopherA.name}</div>
        </motion.div>

        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(201,169,98,0.2) 0%, rgba(201,169,98,0.05) 100%)',
            border: '1px solid rgba(201,169,98,0.4)',
          }}
        >
          <Swords size={16} className="text-[#c9a962]" />
        </div>

        <motion.div
          animate={{ scale: currentSide === 'B' ? 1.05 : 0.95, opacity: currentSide === 'B' ? 1 : 0.6 }}
          className="text-center"
        >
          <span className="text-3xl block mb-1">{philosopherB.portrait}</span>
          <div className="text-sm font-bold" style={{ color: sideColorB }}>{philosopherB.name}</div>
        </motion.div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        {matchup.rounds.map((_, idx) => (
          <div key={idx} className="flex items-center gap-1">
            <div
              className="w-8 h-1.5 rounded-full transition-all duration-500"
              style={{
                background: idx < currentRound
                  ? 'linear-gradient(90deg, #3498db, #e74c3c)'
                  : idx === currentRound
                    ? currentColor
                    : 'rgba(255,255,255,0.08)',
              }}
            />
          </div>
        ))}
      </div>

      <motion.div
        key={`${currentRound}-${currentSide}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel rounded-2xl overflow-hidden"
      >
        <div
          className="px-6 py-3 flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, ${currentColor}15 0%, ${currentColor}05 100%)`,
            borderBottom: `1px solid ${currentColor}30`,
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{roundTypeIcons[currentArgument?.type || 'opening']}</span>
            <div>
              <div className="text-xs text-[#e8e4d9]/50">
                第 {currentRound + 1} 轮 · {roundTypeLabels[currentArgument?.type || 'opening']}
              </div>
              <div className="font-bold" style={{ color: currentColor }}>
                {currentPhilosopher.name}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
            >
              {isPaused ? <Play size={14} className="text-[#e8e4d9]/50" /> : <Pause size={14} className="text-[#e8e4d9]/50" />}
            </button>
            <button
              onClick={handleSkip}
              className="text-xs text-[#e8e4d9]/30 hover:text-[#e8e4d9]/60 transition-colors px-2 py-1 rounded"
            >
              跳过
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="text-[#e8e4d9]/85 leading-relaxed text-[15px]" style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}>
            {displayedText}
            {isTyping && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block ml-0.5"
                style={{ color: currentColor }}
              >
                |
              </motion.span>
            )}
          </div>
        </div>

        <div className="px-6 pb-4 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all"
            style={{
              background: `linear-gradient(135deg, ${currentColor}20 0%, ${currentColor}08 100%)`,
              border: `1px solid ${currentColor}40`,
              color: currentColor,
            }}
          >
            {isTyping ? '显示全文' : currentSide === 'A' ? `${philosopherB.name} 回应` : currentRound < matchup.rounds.length - 1 ? '下一轮' : '查看裁决'}
            <ChevronRight size={14} />
          </motion.button>
        </div>
      </motion.div>

      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {round && (
          <>
            <span
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(52,152,219,0.1)', border: '1px solid rgba(52,152,219,0.3)', color: '#3498db' }}
            >
              {philosopherA.name}：{philosopherA.thoughtProfile.slice(0, 2).join('·')}
            </span>
            <span className="text-xs text-[#e8e4d9]/30">VS</span>
            <span
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', color: '#e74c3c' }}
            >
              {philosopherB.name}：{philosopherB.thoughtProfile.slice(0, 2).join('·')}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
