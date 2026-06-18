import { motion } from 'framer-motion';
import { Sparkles, Lock } from 'lucide-react';
import { hybridRecipes, getVirusById } from '@/data/philosophyVirus';
import { hexToRgba } from '@/lib/utils';

interface Props {
  discoveredHybrids: string[];
}

export default function VirusHybridPanel({ discoveredHybrids }: Props) {
  const discovered = new Set(discoveredHybrids);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={15} className="text-[#c9a962]" />
        <h3 className="text-sm font-semibold tracking-wider text-[#c9a962]">混合学派</h3>
        <span className="ml-auto text-xs text-[#e8e4d9]/50">
          {discovered.size} / {hybridRecipes.length}
        </span>
      </div>
      <div className="space-y-2">
        {hybridRecipes.map((r) => {
          const found = discovered.has(r.id);
          const [aId, bId] = r.virusIds;
          const a = getVirusById(aId);
          const b = getVirusById(bId);
          return (
            <motion.div
              key={r.id}
              initial={false}
              animate={found ? { opacity: 1 } : { opacity: 0.6 }}
              className="rounded-xl p-2.5"
              style={{
                background: found
                  ? `linear-gradient(135deg, ${hexToRgba(r.color, 0.16)} 0%, rgba(15,22,36,0.6) 100%)`
                  : 'rgba(255,255,255,0.02)',
                border: found ? `1px solid ${hexToRgba(r.color, 0.5)}` : '1px dashed rgba(255,255,255,0.08)',
              }}
            >
              <div className="flex items-center gap-2">
                {found ? (
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: r.color, boxShadow: `0 0 8px ${r.color}` }}
                  />
                ) : (
                  <Lock size={12} className="text-[#e8e4d9]/30 flex-shrink-0" />
                )}
                <span
                  className="text-sm font-semibold flex-1 truncate"
                  style={{
                    color: found ? '#e8e4d9' : 'rgba(232,228,217,0.4)',
                    fontFamily: '"Noto Serif SC", Georgia, serif',
                  }}
                >
                  {found ? r.name : '？？？'}
                </span>
              </div>

              {found ? (
                <p className="text-[11px] text-[#e8e4d9]/55 mt-1 leading-snug">{r.description}</p>
              ) : (
                <p className="text-[10px] text-[#e8e4d9]/30 mt-1">两种观念在此人群相遇后诞生</p>
              )}

              <div className="flex items-center gap-1.5 mt-1.5">
                {a && (
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{
                      background: hexToRgba(a.color, found ? 0.15 : 0.08),
                      color: found ? a.color : hexToRgba(a.color, 0.6),
                    }}
                  >
                    {a.name}
                  </span>
                )}
                <span className="text-[10px] text-[#e8e4d9]/30">×</span>
                {b && (
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{
                      background: hexToRgba(b.color, found ? 0.15 : 0.08),
                      color: found ? b.color : hexToRgba(b.color, 0.6),
                    }}
                  >
                    {b.name}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
