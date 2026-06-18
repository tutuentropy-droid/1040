import { motion } from 'framer-motion';
import { Award, ArrowLeft, RotateCcw } from 'lucide-react';
import { philosopherNPCs } from '@/data/philosophers';
import type { DebateMatchup, PhilosopherNPC } from '@/types';

interface DebateVerdictProps {
  matchup: DebateMatchup;
  onBack: () => void;
  onRestart: () => void;
}

export default function DebateVerdict({ matchup, onBack, onRestart }: DebateVerdictProps) {
  const philosopherA = philosopherNPCs.find((p) => p.id === matchup.philosopherA) as PhilosopherNPC;
  const philosopherB = philosopherNPCs.find((p) => p.id === matchup.philosopherB) as PhilosopherNPC;
  const { verdict } = matchup;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
          style={{
            background: 'linear-gradient(135deg, rgba(201,169,98,0.2) 0%, rgba(201,169,98,0.05) 100%)',
            border: '2px solid rgba(201,169,98,0.5)',
          }}
        >
          <Award size={28} className="text-[#c9a962]" />
        </motion.div>

        <h2
          className="text-2xl md:text-3xl font-bold text-[#e8e4d9] mb-2"
          style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
        >
          辩论裁决
        </h2>
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-sm" style={{ color: '#3498db' }}>{philosopherA.name}</span>
          <span className="text-[#e8e4d9]/30">vs</span>
          <span className="text-sm" style={{ color: '#e74c3c' }}>{philosopherB.name}</span>
        </div>
        <div
          className="text-[#c9a962] font-bold"
          style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
        >
          {matchup.topic}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-panel rounded-2xl p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 rounded-full bg-[#c9a962]" />
          <h3
            className="text-lg font-bold text-[#e8e4d9]"
            style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
          >
            辩论总评
          </h3>
        </div>
        <p className="text-[#e8e4d9]/75 leading-relaxed" style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}>
          {verdict.summary}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-panel rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full" style={{ background: '#e74c3c' }} />
            <h3
              className="text-lg font-bold text-[#e8e4d9]"
              style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
            >
              核心分歧
            </h3>
          </div>
          <p className="text-[#e8e4d9]/70 leading-relaxed text-sm" style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}>
            {verdict.keyDisagreement}
          </p>
          <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <span className="text-xl block mb-1">{philosopherA.portrait}</span>
                <span className="text-xs" style={{ color: '#3498db' }}>{philosopherA.name}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg text-[#e74c3c]">⟷</div>
                <span className="text-[10px] text-[#e8e4d9]/30">对立</span>
              </div>
              <div className="text-center">
                <span className="text-xl block mb-1">{philosopherB.portrait}</span>
                <span className="text-xs" style={{ color: '#e74c3c' }}>{philosopherB.name}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-panel rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full bg-[#27ae60]" />
            <h3
              className="text-lg font-bold text-[#e8e4d9]"
              style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
            >
              共同基础
            </h3>
          </div>
          <p className="text-[#e8e4d9]/70 leading-relaxed text-sm" style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}>
            {verdict.commonGround}
          </p>
          <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <span className="text-xl block mb-1">{philosopherA.portrait}</span>
                <span className="text-xs" style={{ color: '#3498db' }}>{philosopherA.name}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-lg text-[#27ae60]">⟶⟵</div>
                <span className="text-[10px] text-[#e8e4d9]/30">共识</span>
              </div>
              <div className="text-center">
                <span className="text-xl block mb-1">{philosopherB.portrait}</span>
                <span className="text-xs" style={{ color: '#e74c3c' }}>{philosopherB.name}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="glass-panel rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 rounded-full bg-[#9b59b6]" />
          <h3
            className="text-lg font-bold text-[#e8e4d9]"
            style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
          >
            思想脉络回顾
          </h3>
        </div>
        <div className="space-y-4">
          {matchup.rounds.map((r, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(201,169,98,0.1)] border border-[rgba(201,169,98,0.3)] text-[#c9a962]">
                  第{r.roundNumber}轮
                </span>
                <span className="text-xs text-[#e8e4d9]/40">
                  {r.philosopherA.type === 'opening' ? '立论' : r.philosopherA.type === 'rebuttal' ? '交锋' : '总结'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  className="p-3 rounded-xl text-sm text-[#e8e4d9]/70 leading-relaxed"
                  style={{
                    background: 'rgba(52,152,219,0.05)',
                    borderLeft: '2px solid rgba(52,152,219,0.4)',
                  }}
                >
                  <span className="text-xs font-bold block mb-1" style={{ color: '#3498db' }}>
                    {philosopherA.name}
                  </span>
                  {r.philosopherA.argument.slice(0, 80)}……
                </div>
                <div
                  className="p-3 rounded-xl text-sm text-[#e8e4d9]/70 leading-relaxed"
                  style={{
                    background: 'rgba(231,76,60,0.05)',
                    borderLeft: '2px solid rgba(231,76,60,0.4)',
                  }}
                >
                  <span className="text-xs font-bold block mb-1" style={{ color: '#e74c3c' }}>
                    {philosopherB.name}
                  </span>
                  {r.philosopherB.argument.slice(0, 80)}……
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex items-center justify-center gap-4"
      >
        <button onClick={onBack} className="btn-ghost flex items-center gap-2">
          <ArrowLeft size={16} />
          返回选择
        </button>
        <button onClick={onRestart} className="btn-gold flex items-center gap-2">
          <RotateCcw size={16} />
          再来一场
        </button>
      </motion.div>
    </div>
  );
}
