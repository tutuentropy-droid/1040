import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Sparkles, Activity, ScrollText } from 'lucide-react';
import { useVirusSimulation } from '@/hooks/useVirusSimulation';
import { thoughtViruses, getVirusById, hybridRecipes, virusPopulations } from '@/data/philosophyVirus';
import VirusNetwork from './VirusNetwork';
import VirusPalette from './VirusPalette';
import VirusControls from './VirusControls';
import VirusHybridPanel from './VirusHybridPanel';

const LOG_COLORS: Record<string, string> = {
  hybrid: '#e8c987',
  spread: '#9ec5fe',
  info: 'rgba(232,228,217,0.8)',
};

export default function VirusSimulation() {
  const { state, seed, tick, play, pause, reset, setSpeed } = useVirusSimulation();
  const [selectedVirusId, setSelectedVirusId] = useState<string | null>(null);

  const selectedVirus = selectedVirusId ? getVirusById(selectedVirusId) ?? null : null;

  const stats = useMemo(() => {
    const pops = Object.values(state.populations);
    const infectedPops = pops.filter((ps) =>
      Object.values(ps.infections).some((l) => l > 0),
    ).length;
    const totalLevel = pops.reduce(
      (sum, ps) => sum + Math.min(100, Object.values(ps.infections).reduce((s, l) => s + l, 0)),
      0,
    );
    const saturation = Math.round((totalLevel / (pops.length * 100)) * 100);
    return {
      tick: state.tick,
      infectedPops,
      totalPops: virusPopulations.length,
      hybrids: state.discoveredHybrids.length,
      totalHybrids: hybridRecipes.length,
      saturation,
    };
  }, [state]);

  const canStep = useMemo(
    () => Object.values(state.populations).some((ps) =>
      Object.values(ps.infections).some((l) => l > 0),
    ),
    [state],
  );

  const handleSeed = (popId: string) => {
    if (!selectedVirus) return;
    seed(popId, selectedVirus.id);
    if (state.tick === 0 && !state.isRunning) play();
  };

  const statCards = [
    { icon: Clock, label: '时代推进', value: `T${stats.tick}`, color: '#c9a962' },
    { icon: Users, label: '已感染人群', value: `${stats.infectedPops}/${stats.totalPops}`, color: '#3498DB' },
    { icon: Activity, label: '扩散饱和度', value: `${stats.saturation}%`, color: '#E67E22' },
    { icon: Sparkles, label: '混合学派', value: `${stats.hybrids}/${stats.totalHybrids}`, color: '#9B59B6' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2
          className="text-3xl md:text-4xl font-bold text-[#e8e4d9] mb-3"
          style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
        >
          哲学病毒实验室
        </h2>
        <p className="text-[#e8e4d9]/60 max-w-2xl mx-auto leading-relaxed">
          每一种思想都是一种会传播的观念病毒。在虚拟社会的人群之间植入思想，观察它如何随接受概率扩散、相遇，并在碰撞中诞生新的混合学派。
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
      >
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl p-3 flex items-center gap-3"
              style={{
                background: 'linear-gradient(135deg, rgba(15,22,36,0.8) 0%, rgba(20,30,50,0.5) 100%)',
                border: '1px solid rgba(201,169,98,0.15)',
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${card.color}1a`, border: `1px solid ${card.color}40` }}
              >
                <Icon size={16} style={{ color: card.color }} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-[#e8e4d9]/45 truncate">{card.label}</div>
                <div className="text-base font-bold tabular-nums" style={{ color: card.color }}>
                  {card.value}
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <VirusNetwork state={state} selectedVirus={selectedVirus} onSeed={handleSeed} />
          {!selectedVirus && stats.tick === 0 && (
            <div className="mt-3 text-center text-xs text-[#e8e4d9]/40">
              ← 先从右侧选择一种观念病毒，再点击人群节点植入
            </div>
          )}
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-5"
        >
          <div
            className="rounded-2xl p-4"
            style={{
              background: 'rgba(15,22,36,0.6)',
              border: '1px solid rgba(201,169,98,0.15)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <VirusPalette
              viruses={thoughtViruses}
              selectedVirusId={selectedVirusId}
              onSelect={(id) => setSelectedVirusId((prev) => (prev === id ? null : id))}
            />
          </div>

          <div
            className="rounded-2xl p-4"
            style={{
              background: 'rgba(15,22,36,0.6)',
              border: '1px solid rgba(201,169,98,0.15)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <VirusControls
              isRunning={state.isRunning}
              speed={state.speed}
              canStep={canStep}
              onPlay={play}
              onPause={pause}
              onStep={tick}
              onReset={reset}
              onSpeedChange={setSpeed}
            />
          </div>

          <div
            className="rounded-2xl p-4"
            style={{
              background: 'rgba(15,22,36,0.6)',
              border: '1px solid rgba(201,169,98,0.15)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <VirusHybridPanel discoveredHybrids={state.discoveredHybrids} />
          </div>

          <div
            className="rounded-2xl p-4"
            style={{
              background: 'rgba(15,22,36,0.6)',
              border: '1px solid rgba(201,169,98,0.15)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <ScrollText size={15} className="text-[#c9a962]" />
              <h3 className="text-sm font-semibold tracking-wider text-[#c9a962]">事件日志</h3>
            </div>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {state.log.length === 0 ? (
                <p className="text-xs text-[#e8e4d9]/30 leading-relaxed">
                  尚无事件。植入病毒后将记录其传播轨迹与学派诞生时刻。
                </p>
              ) : (
                state.log.map((e) => (
                  <div key={e.id} className="text-[11px] flex gap-2 leading-snug">
                    <span className="text-[#e8e4d9]/30 tabular-nums w-9 flex-shrink-0">T{e.tick}</span>
                    <span
                      style={{
                        color: LOG_COLORS[e.type] ?? 'rgba(232,228,217,0.8)',
                        fontWeight: e.type === 'hybrid' ? 600 : 400,
                      }}
                    >
                      {e.text}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
