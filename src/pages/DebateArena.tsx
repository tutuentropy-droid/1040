import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import NavHeader from '@/components/common/NavHeader';
import PhilosopherSelector from '@/components/debate/PhilosopherSelector';
import DebateFlow from '@/components/debate/DebateFlow';
import DebateVerdict from '@/components/debate/DebateVerdict';
import { useAppStore } from '@/store/useAppStore';
import type { DebateMatchup } from '@/types';

type ArenaPhase = 'select' | 'debate' | 'verdict';

export default function DebateArena() {
  const hydrate = useAppStore((s) => s.hydrate);
  const [phase, setPhase] = useState<ArenaPhase>('select');
  const [activeMatchup, setActiveMatchup] = useState<DebateMatchup | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleStartDebate = (matchup: DebateMatchup) => {
    setActiveMatchup(matchup);
    setPhase('debate');
  };

  const handleDebateComplete = () => {
    setPhase('verdict');
  };

  const handleBackToSelector = () => {
    setActiveMatchup(null);
    setPhase('select');
  };

  const handleRestart = () => {
    setActiveMatchup(null);
    setPhase('select');
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: '#0f1624' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 20%, rgba(52,152,219,0.06) 0%, transparent 45%),
            radial-gradient(circle at 70% 80%, rgba(231,76,60,0.06) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(201,169,98,0.03) 0%, transparent 60%)
          `,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #e8e4d9 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <NavHeader />

      <main className="relative z-10 pt-20 md:pt-24">
        <AnimatePresence mode="wait">
          {phase === 'select' && (
            <PhilosopherSelector
              key="selector"
              onStartDebate={handleStartDebate}
            />
          )}
          {phase === 'debate' && activeMatchup && (
            <DebateFlow
              key={`debate-${activeMatchup.id}`}
              matchup={activeMatchup}
              onComplete={handleDebateComplete}
            />
          )}
          {phase === 'verdict' && activeMatchup && (
            <DebateVerdict
              key={`verdict-${activeMatchup.id}`}
              matchup={activeMatchup}
              onBack={handleBackToSelector}
              onRestart={handleRestart}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
