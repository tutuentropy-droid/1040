import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import type { ThoughtVirus } from '@/types';
import { getCategoryLabel } from '@/utils/colors';
import { hexToRgba } from '@/lib/utils';

interface Props {
  viruses: ThoughtVirus[];
  selectedVirusId: string | null;
  onSelect: (id: string) => void;
}

export default function VirusPalette({ viruses, selectedVirusId, onSelect }: Props) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Zap size={15} className="text-[#c9a962]" />
        <h3 className="text-sm font-semibold tracking-wider text-[#c9a962]">观念病毒</h3>
      </div>
      <p className="text-xs text-[#e8e4d9]/50 mb-3 leading-relaxed">
        选择一种思想，再点击人群节点植入；不同人群的接受度悬殊。
      </p>
      <div className="space-y-2">
        {viruses.map((v) => {
          const selected = selectedVirusId === v.id;
          return (
            <motion.button
              key={v.id}
              type="button"
              onClick={() => onSelect(v.id)}
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-left rounded-xl p-2.5 transition-all"
              style={{
                background: selected
                  ? `linear-gradient(135deg, ${hexToRgba(v.color, 0.18)} 0%, rgba(15,22,36,0.6) 100%)`
                  : 'rgba(255,255,255,0.03)',
                border: selected ? `1px solid ${hexToRgba(v.color, 0.6)}` : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: v.color, boxShadow: selected ? `0 0 8px ${v.color}` : 'none' }}
                />
                <span
                  className="text-sm font-semibold text-[#e8e4d9] flex-1 truncate"
                  style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                >
                  {v.name}
                </span>
                <span className="text-[10px] text-[#e8e4d9]/40 flex-shrink-0">{getCategoryLabel(v.category)}</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5 pl-5">
                <div className="flex-1 flex items-center gap-0.5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span
                      key={i}
                      className="h-2.5 flex-1 rounded-sm"
                      style={{ background: i < v.infectivity ? v.color : 'rgba(255,255,255,0.08)' }}
                    />
                  ))}
                </div>
                <span className="text-[10px] tabular-nums flex-shrink-0" style={{ color: v.color }}>
                  {v.infectivity}
                </span>
              </div>
              <p className="text-[11px] text-[#e8e4d9]/45 mt-1 pl-5 leading-snug">{v.tagline}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
