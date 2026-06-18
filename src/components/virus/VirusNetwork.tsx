import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { VirusSimState, ThoughtVirus, VirusPopulation } from '@/types';
import { virusPopulations, getVirusById, getPopulationById } from '@/data/philosophyVirus';
import { hexToRgba } from '@/lib/utils';

interface Props {
  state: VirusSimState;
  selectedVirus: ThoughtVirus | null;
  onSeed: (popId: string) => void;
}

interface NodeProps {
  pop: VirusPopulation;
  popState: VirusSimState['populations'][string];
  selectedVirus: ThoughtVirus | null;
  onSeed: (popId: string) => void;
}

function PopulationNode({ pop, popState, selectedVirus, onSeed }: NodeProps) {
  const activeInfections = Object.entries(popState.infections)
    .filter(([, level]) => level > 0.5)
    .sort((a, b) => b[1] - a[1]);

  const accept = selectedVirus ? pop.susceptibility[selectedVirus.category] : 0;

  return (
    <motion.button
      type="button"
      onClick={() => onSeed(pop.id)}
      whileHover={selectedVirus ? { scale: 1.05, y: -2 } : {}}
      whileTap={{ scale: 0.97 }}
      animate={selectedVirus ? { scale: [1, 1.03, 1] } : { scale: 1 }}
      transition={selectedVirus ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
      className="absolute -translate-x-1/2 -translate-y-1/2 w-[150px] rounded-2xl p-3 text-left"
      style={{
        left: `${pop.x * 100}%`,
        top: `${pop.y * 100}%`,
        background: 'linear-gradient(135deg, rgba(15,22,36,0.96) 0%, rgba(20,30,50,0.88) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: selectedVirus
          ? `1.5px solid ${hexToRgba(selectedVirus.color, 0.25 + accept * 0.65)}`
          : '1px solid rgba(201,169,98,0.18)',
        boxShadow: selectedVirus
          ? `0 0 ${10 + accept * 22}px ${hexToRgba(selectedVirus.color, 0.16 + accept * 0.4)}`
          : '0 6px 20px rgba(0,0,0,0.3)',
        cursor: selectedVirus ? 'pointer' : 'default',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl leading-none">{pop.icon}</span>
        <div className="min-w-0 flex-1">
          <div
            className="text-sm font-semibold text-[#e8e4d9] truncate"
            style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
          >
            {pop.name}
          </div>
          {selectedVirus ? (
            <div className="text-[10px] leading-tight" style={{ color: hexToRgba(selectedVirus.color, 0.9) }}>
              接受度 {Math.round(accept * 100)}%
            </div>
          ) : (
            <div className="text-[10px] leading-tight text-[#e8e4d9]/35 truncate">{pop.description}</div>
          )}
        </div>
        {popState.hybrids.length > 0 && <Sparkles size={13} className="text-[#c9a962] flex-shrink-0" />}
      </div>

      {activeInfections.length > 0 ? (
        <div className="space-y-1">
          {activeInfections.slice(0, 4).map(([virusId, level]) => {
            const v = getVirusById(virusId);
            if (!v) return null;
            return (
              <div key={virusId} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: v.color }} />
                <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${v.color}, ${hexToRgba(v.color, 0.55)})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, level)}%` }}
                    transition={{ duration: 0.45 }}
                  />
                </div>
                <span className="text-[9px] text-[#e8e4d9]/55 w-6 text-right tabular-nums">{Math.round(level)}</span>
              </div>
            );
          })}
          {activeInfections.length > 4 && (
            <div className="text-[9px] text-[#e8e4d9]/40 pl-3">+{activeInfections.length - 4} 种</div>
          )}
        </div>
      ) : (
        <div className="h-[7px] rounded-full bg-white/5" />
      )}

      {activeInfections.length > 0 && (
        <div className="mt-2 pt-1.5 border-t border-white/5">
          <span className="text-[9px] text-[#e8e4d9]/45">
            活跃思想 ×{activeInfections.length}
            {popState.hybrids.length > 0 && (
              <span className="text-[#c9a962]"> · 学派 ×{popState.hybrids.length}</span>
            )}
          </span>
        </div>
      )}
    </motion.button>
  );
}

export default function VirusNetwork({ state, selectedVirus, onSeed }: Props) {
  const edges: Array<{ a: VirusPopulation; b: VirusPopulation }> = [];
  const seen = new Set<string>();
  virusPopulations.forEach((p) => {
    p.connections.forEach((cid) => {
      const c = getPopulationById(cid);
      if (!c) return;
      const key = [p.id, cid].sort().join('|');
      if (seen.has(key)) return;
      seen.add(key);
      edges.push({ a: p, b: c });
    });
  });

  const hasInfection = (id: string) =>
    Object.values(state.populations[id]?.infections ?? {}).some((l) => l > 0);

  return (
    <div className="relative w-full">
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(15,22,36,0.6) 0%, rgba(20,30,50,0.4) 100%)',
          border: '1px solid rgba(201,169,98,0.15)',
        }}
      />
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #c9a962 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div className="relative h-[460px] sm:h-[520px] md:h-[560px]">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {edges.map(({ a, b }) => {
            const active = hasInfection(a.id) || hasInfection(b.id);
            return (
              <line
                key={`${a.id}-${b.id}`}
                x1={a.x * 100}
                y1={a.y * 100}
                x2={b.x * 100}
                y2={b.y * 100}
                stroke={active ? 'rgba(201,169,98,0.45)' : 'rgba(201,169,98,0.14)'}
                strokeWidth={active ? 1.5 : 1}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
        {virusPopulations.map((p) => (
          <PopulationNode
            key={p.id}
            pop={p}
            popState={state.populations[p.id]}
            selectedVirus={selectedVirus}
            onSeed={onSeed}
          />
        ))}
      </div>
    </div>
  );
}
