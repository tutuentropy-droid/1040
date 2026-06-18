import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Star, ChevronRight } from 'lucide-react';
import { thoughtExperiments, getRecommendedExperiments } from '@/data/thoughtExperiments';
import { getNodeById } from '@/data/nodes';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import type { ThoughtExperimentData } from '@/types';

interface ExperimentListProps {
  onSelect: (experiment: ThoughtExperimentData) => void;
}

const difficultyConfig = {
  beginner: { label: '入门', color: '#27AE60', bgColor: 'rgba(39,174,96,0.1)', borderColor: 'rgba(39,174,96,0.3)' },
  intermediate: { label: '进阶', color: '#F39C12', bgColor: 'rgba(243,156,18,0.1)', borderColor: 'rgba(243,156,18,0.3)' },
  advanced: { label: '深度', color: '#E74C3C', bgColor: 'rgba(231,76,60,0.1)', borderColor: 'rgba(231,76,60,0.3)' },
};

export default function ExperimentList({ onSelect }: ExperimentListProps) {
  const completedExperiments = useAppStore((s) => s.completedExperiments);
  const experimentSessions = useAppStore((s) => s.experimentSessions);
  const experimentRouteTags = useAppStore((s) => s.experimentRouteTags);
  const routeTags = useAppStore((s) => s.routeTags);

  const allTags = { ...routeTags, ...experimentRouteTags };
  const recommended = getRecommendedExperiments(completedExperiments, allTags);

  const getEndingTitle = (experimentId: string) => {
    const session = experimentSessions.find(
      (s) => s.experimentId === experimentId && s.endingId,
    );
    if (!session?.endingId) return null;
    const experiment = thoughtExperiments.find((e) => e.id === experimentId);
    return experiment?.endings.find((en) => en.id === session.endingId)?.title ?? null;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
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
          思想实验
        </h2>
        <p className="text-[#e8e4d9]/60 max-w-2xl mx-auto">
          置身经典哲学困境，在两难选择中探索你的思想立场。每一个选择都将揭示你的哲学倾向，并动态影响后续的问题走向。
        </p>

        <div className="flex items-center justify-center gap-4 mt-4">
          <span className="text-sm text-[#c9a962]/70">
            已完成 {completedExperiments.length} / {thoughtExperiments.length}
          </span>
          <div className="w-32 h-1.5 rounded-full bg-[#e8e4d9]/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #c9a962, #e8c987)' }}
              initial={{ width: 0 }}
              animate={{ width: `${(completedExperiments.length / thoughtExperiments.length) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      {recommended.length > 0 && completedExperiments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Star size={16} className="text-[#c9a962]" />
            <span className="text-sm font-semibold tracking-wider text-[#c9a962]">
              为你推荐
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommended.slice(0, 2).map((exp, idx) => {
              const isCompleted = completedExperiments.includes(exp.id);
              const diff = difficultyConfig[exp.difficulty];
              return (
                <motion.button
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(exp)}
                  className="relative w-full text-left rounded-2xl p-5 transition-all overflow-hidden group"
                  style={{
                    background: isCompleted
                      ? 'linear-gradient(135deg, rgba(201,169,98,0.12) 0%, rgba(15,22,36,0.9) 100%)'
                      : 'linear-gradient(135deg, rgba(15,22,36,0.9) 0%, rgba(15,22,36,0.7) 100%)',
                    border: isCompleted ? '1px solid rgba(201,169,98,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#c9a962]/5 blur-3xl pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{exp.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-[#e8e4d9]" style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}>
                            {exp.title}
                          </h3>
                          {isCompleted && <CheckCircle2 size={14} className="text-[#c9a962]" />}
                          <Star size={12} className="text-[#c9a962]/60" />
                        </div>
                        <p className="text-xs text-[#e8e4d9]/40 mb-2">{exp.subtitle}</p>
                        <p className="text-sm text-[#e8e4d9]/70 line-clamp-2">{exp.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 ml-9">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: diff.bgColor, border: `1px solid ${diff.borderColor}`, color: diff.color }}
                      >
                        {diff.label}
                      </span>
                      {isCompleted && (
                        <span className="text-xs text-[#c9a962]/70">
                          结局：{getEndingTitle(exp.id)}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {thoughtExperiments.map((exp, idx) => {
          const isCompleted = completedExperiments.includes(exp.id);
          const diff = difficultyConfig[exp.difficulty];
          const relatedNodeNames = exp.relatedNodes
            .map((id) => getNodeById(id)?.name)
            .filter(Boolean);

          return (
            <motion.button
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + idx * 0.08 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(exp)}
              className="relative w-full text-left rounded-2xl p-6 transition-all overflow-hidden group"
              style={{
                background: isCompleted
                  ? 'linear-gradient(135deg, rgba(201,169,98,0.08) 0%, rgba(15,22,36,0.95) 100%)'
                  : 'linear-gradient(135deg, rgba(15,22,36,0.95) 0%, rgba(20,30,50,0.8) 100%)',
                border: isCompleted ? '1px solid rgba(201,169,98,0.35)' : '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(15px)',
                boxShadow: isCompleted
                  ? '0 8px 32px rgba(201,169,98,0.1)'
                  : '0 8px 32px rgba(0,0,0,0.3)',
              }}
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#c9a962]/5 blur-2xl pointer-events-none group-hover:bg-[#c9a962]/10 transition-all duration-500" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{exp.icon}</span>
                  {isCompleted ? (
                    <div className="flex items-center gap-1 text-[#c9a962]">
                      <CheckCircle2 size={16} />
                      <span className="text-xs font-medium">已完成</span>
                    </div>
                  ) : (
                    <Lock size={16} className="text-[#e8e4d9]/30" />
                  )}
                </div>

                <h3
                  className="text-lg font-bold text-[#e8e4d9] mb-1"
                  style={{ fontFamily: '"Noto Serif SC", Georgia, serif' }}
                >
                  {exp.title}
                </h3>
                <p className="text-xs text-[#e8e4d9]/40 mb-3">{exp.subtitle}</p>

                <p className="text-sm text-[#e8e4d9]/60 line-clamp-3 mb-4 leading-relaxed">
                  {exp.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: diff.bgColor, border: `1px solid ${diff.borderColor}`, color: diff.color }}
                    >
                      {diff.label}
                    </span>
                    {relatedNodeNames.length > 0 && (
                      <span className="text-xs text-[#e8e4d9]/40">
                        {relatedNodeNames.slice(0, 2).join('·')}
                      </span>
                    )}
                  </div>

                  <ChevronRight size={16} className="text-[#e8e4d9]/30 group-hover:text-[#c9a962] transition-colors" />
                </div>

                {isCompleted && getEndingTitle(exp.id) && (
                  <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.06)]">
                    <span className="text-xs text-[#c9a962]/60">你的结局：</span>
                    <span className="text-xs text-[#c9a962] font-medium">{getEndingTitle(exp.id)}</span>
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
