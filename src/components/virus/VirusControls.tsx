import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  isRunning: boolean;
  speed: number;
  canStep: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

const SPEEDS = [
  { label: '慢', value: 1400 },
  { label: '中', value: 900 },
  { label: '快', value: 450 },
];

export default function VirusControls({
  isRunning,
  speed,
  canStep,
  onPlay,
  onPause,
  onStep,
  onReset,
  onSpeedChange,
}: Props) {
  return (
    <div>
      <h3 className="text-sm font-semibold tracking-wider text-[#c9a962] mb-3">传播控制</h3>
      <div className="flex items-center gap-2 mb-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={isRunning ? onPause : onPlay}
          disabled={!canStep && !isRunning}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold text-sm"
          style={{
            background: isRunning
              ? 'rgba(231,76,60,0.15)'
              : 'linear-gradient(135deg, #c9a962 0%, #e8c987 100%)',
            color: isRunning ? '#E74C3C' : '#2c1810',
            border: isRunning ? '1px solid rgba(231,76,60,0.4)' : 'none',
            boxShadow: isRunning ? 'none' : '0 2px 12px rgba(201,169,98,0.3)',
            opacity: !canStep && !isRunning ? 0.4 : 1,
          }}
        >
          {isRunning ? <Pause size={15} /> : <Play size={15} />}
          {isRunning ? '暂停' : '播放'}
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onStep}
          disabled={isRunning || !canStep}
          className="px-3 py-2.5 rounded-xl text-sm"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(201,169,98,0.25)',
            color: '#c9a962',
            opacity: isRunning || !canStep ? 0.4 : 1,
          }}
          title="单步推进"
        >
          <SkipForward size={15} />
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onReset}
          className="px-3 py-2.5 rounded-xl text-sm"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#e8e4d9',
          }}
          title="重置"
        >
          <RotateCcw size={15} />
        </motion.button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-[#e8e4d9]/45 flex-shrink-0">速度</span>
        <div className="flex-1 flex gap-1.5">
          {SPEEDS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => onSpeedChange(s.value)}
              className={cn('flex-1 py-1.5 rounded-lg text-xs font-medium transition-all')}
              style={{
                background: speed === s.value ? 'rgba(201,169,98,0.15)' : 'rgba(255,255,255,0.03)',
                border:
                  speed === s.value ? '1px solid rgba(201,169,98,0.4)' : '1px solid rgba(255,255,255,0.06)',
                color: speed === s.value ? '#c9a962' : '#e8e4d9',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
