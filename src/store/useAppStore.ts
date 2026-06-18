import { create } from 'zustand';
import type { AppState, ExplorationRecord, PhilosopherProfile, Question, ExperimentSession } from '@/types';
import {
  loadAppState,
  saveAppState,
  deleteRecord,
  loadAllRecords,
  saveExplorationRecord,
} from '@/utils/storage';
import { philosophyNodes } from '@/data/nodes';
import { questions, getQuestionById, getFirstQuestion } from '@/data/questions';
import { resolveExperimentEnding } from '@/data/thoughtExperiments';

interface AppStore extends AppState {
  selectedNodeId: string | null;
  zoomLevel: number;
  mapOffset: { x: number; y: number };
  explorationStartTime: number | null;
  activePhilosopherId: string | null;

  setSelectedNodeId: (nodeId: string | null) => void;
  selectOption: (
    questionId: string,
    optionId: string,
    nextQuestionId?: string | null,
    unlockNodes?: string[],
    routeTags?: Record<string, number>,
  ) => void;
  setCurrentView: (view: AppState['currentView']) => void;
  selectNode: (nodeId: string | null) => void;
  setZoomLevel: (level: number) => void;
  resetExploration: () => void;
  finishExploration: () => void;
  removeRecord: (recordId: string) => void;
  hydrate: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (level: number) => void;
  resetView: () => void;
  setMapOffset: (offset: { x: number; y: number }) => void;
  encounterPhilosopher: (philosopherId: string) => void;
  completeChallenge: (philosopherId: string, rewardNodes: string[]) => void;
  setActivePhilosopher: (philosopherId: string | null) => void;
  startExperiment: (experimentId: string) => void;
  selectExperimentOption: (experimentId: string, stepId: string, optionId: string, routeTags: Record<string, number>, nextStepId: string | null) => void;
  completeExperiment: (experimentId: string) => void;
}

const initialState: AppState = {
  currentView: 'home',
  currentQuestionId: 'q1',
  answeredQuestions: [],
  selectedOptions: {},
  unlockedNodes: [],
  activeNodeId: null,
  routeTags: {},
  explorationPath: [],
  records: [],
  encounteredPhilosophers: [],
  completedChallenges: [],
  experimentSessions: [],
  completedExperiments: [],
  experimentRouteTags: {},
};

export const useAppStore = create<AppStore>((set, get) => ({
  ...initialState,
  selectedNodeId: null,
  zoomLevel: 1,
  mapOffset: { x: 0, y: 0 },
  explorationStartTime: null,
  activePhilosopherId: null,

  setSelectedNodeId: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },

  selectOption: (questionId, optionId, nextQuestionId, unlockNodes, routeTags) => {
    const state = get();
    const question = getQuestionById(questionId);
    if (!question) return;

    const option = question.options.find((o) => o.id === optionId);
    if (!option) return;

    // 如果是第一个选项，记录开始时间
    const startTime = state.explorationStartTime ?? Date.now();

    // 优先使用传入的参数，否则从 option 中获取
    const nodesToUnlock = unlockNodes ?? option.unlockNodes;
    const tagsToAdd = routeTags ?? option.routeTags;
    const nextQid = nextQuestionId !== undefined ? nextQuestionId : option.nextQuestionId;

    // 合并解锁节点
    const newUnlockedNodes = Array.from(
      new Set([...state.unlockedNodes, ...nodesToUnlock]),
    );

    // 合并标签
    const newRouteTags = { ...state.routeTags };
    Object.entries(tagsToAdd).forEach(([tag, score]) => {
      newRouteTags[tag] = (newRouteTags[tag] || 0) + score;
    });

    // 更新状态
    const newState = {
      answeredQuestions: [...state.answeredQuestions, questionId],
      selectedOptions: { ...state.selectedOptions, [questionId]: optionId },
      unlockedNodes: newUnlockedNodes,
      routeTags: newRouteTags,
      explorationPath: [...state.explorationPath, optionId],
      currentQuestionId: nextQid,
      explorationStartTime: startTime,
    };

    set(newState);
    saveAppState({ ...state, ...newState });

    // 如果没有下一个问题，自动完成探索
    if (!nextQid) {
      get().finishExploration();
    }
  },

  setCurrentView: (view) => {
    const state = get();
    const newState = { currentView: view };
    set(newState);
    saveAppState({ ...state, ...newState });
  },

  selectNode: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },

  setZoomLevel: (level) => {
    set({ zoomLevel: Math.max(0.5, Math.min(3, level)) });
  },

  resetExploration: () => {
    const state = get();
    const resetState = {
      currentQuestionId: getFirstQuestion()?.id || 'q1',
      answeredQuestions: [],
      selectedOptions: {},
      explorationPath: [],
      routeTags: {},
      explorationStartTime: null,
      unlockedNodes: [],
      exploredEdges: [],
    };

    set(resetState);
    saveAppState({ ...state, ...resetState });
  },

  finishExploration: () => {
    const state = get();
    if (state.explorationPath.length === 0) return;

    // 生成摘要
    const unlockedNodeNames = state.unlockedNodes
      .map((id) => philosophyNodes.find((n) => n.id === id)?.name)
      .filter(Boolean)
      .slice(0, 5) as string[];

    const summary = `本次探索解锁了 ${state.unlockedNodes.length} 个思想节点，包括：${unlockedNodeNames.join('、')}${state.unlockedNodes.length > 5 ? ' 等' : ''}。`;

    const recordData: Omit<ExplorationRecord, 'id' | 'timestamp'> = {
      startedAt: state.explorationStartTime ?? Date.now(),
      completedAt: Date.now(),
      path: state.explorationPath,
      unlockedNodes: state.unlockedNodes,
      routeTags: state.routeTags,
      summary,
    };

    const newRecord = saveExplorationRecord(recordData);
    if (newRecord) {
      set({ records: [newRecord, ...state.records], explorationStartTime: null });
    }
  },

  removeRecord: (recordId) => {
    const success = deleteRecord(recordId);
    if (success) {
      const state = get();
      set({ records: state.records.filter((r) => r.id !== recordId) });
    }
  },

  hydrate: () => {
    const savedState = loadAppState();
    const records = loadAllRecords();
    set({ ...savedState, records });
  },

  zoomIn: () => {
    const state = get();
    set({ zoomLevel: Math.min(state.zoomLevel + 0.1, 3) });
  },

  zoomOut: () => {
    const state = get();
    set({ zoomLevel: Math.max(state.zoomLevel - 0.1, 0.5) });
  },

  setZoom: (level) => {
    set({ zoomLevel: Math.max(0.5, Math.min(3, level)) });
  },

  resetView: () => {
    set({ zoomLevel: 1, mapOffset: { x: 0, y: 0 } });
  },

  setMapOffset: (offset) => {
    set({ mapOffset: offset });
  },

  encounterPhilosopher: (philosopherId) => {
    const state = get();
    const alreadyEncountered = state.encounteredPhilosophers.find(
      (p) => p.philosopherId === philosopherId,
    );
    if (alreadyEncountered) {
      set({ activePhilosopherId: philosopherId });
      return;
    }
    const newProfile: PhilosopherProfile = {
      philosopherId,
      encounteredAt: Date.now(),
    };
    const newState = {
      encounteredPhilosophers: [...state.encounteredPhilosophers, newProfile],
      activePhilosopherId: philosopherId,
    };
    set(newState);
    saveAppState({ ...state, ...newState });
  },

  completeChallenge: (philosopherId, rewardNodes) => {
    const state = get();
    const newUnlockedNodes = Array.from(
      new Set([...state.unlockedNodes, ...rewardNodes]),
    );
    const updatedProfiles = state.encounteredPhilosophers.map((p) =>
      p.philosopherId === philosopherId
        ? { ...p, challengeCompletedAt: Date.now() }
        : p,
    );
    const newState = {
      unlockedNodes: newUnlockedNodes,
      encounteredPhilosophers: updatedProfiles,
      completedChallenges: [...state.completedChallenges, philosopherId],
      activePhilosopherId: null,
    };
    set(newState);
    saveAppState({ ...state, ...newState });
  },

  setActivePhilosopher: (philosopherId) => {
    set({ activePhilosopherId: philosopherId });
  },

  startExperiment: (experimentId) => {
    const state = get();
    const existing = state.experimentSessions.find(
      (s) => s.experimentId === experimentId && !s.completedAt,
    );
    if (existing) return;

    const newSession: ExperimentSession = {
      experimentId,
      startedAt: Date.now(),
      choices: [],
      routeTags: {},
    };
    const newState = {
      experimentSessions: [...state.experimentSessions, newSession],
    };
    set(newState);
    saveAppState({ ...state, ...newState });
  },

  selectExperimentOption: (experimentId, stepId, optionId, routeTags, nextStepId) => {
    const state = get();
    const updatedSessions = state.experimentSessions.map((s) => {
      if (s.experimentId === experimentId && !s.completedAt) {
        const newTags = { ...s.routeTags };
        Object.entries(routeTags).forEach(([tag, score]) => {
          newTags[tag] = (newTags[tag] || 0) + score;
        });
        return {
          ...s,
          choices: [...s.choices, { stepId, optionId }],
          routeTags: newTags,
        };
      }
      return s;
    });

    const globalExpTags = { ...state.experimentRouteTags };
    Object.entries(routeTags).forEach(([tag, score]) => {
      globalExpTags[tag] = (globalExpTags[tag] || 0) + score;
    });

    const globalTags = { ...state.routeTags };
    Object.entries(routeTags).forEach(([tag, score]) => {
      globalTags[tag] = (globalTags[tag] || 0) + score;
    });

    const newState = {
      experimentSessions: updatedSessions,
      experimentRouteTags: globalExpTags,
      routeTags: globalTags,
    };
    set(newState);
    saveAppState({ ...state, ...newState });
  },

  completeExperiment: (experimentId) => {
    const state = get();
    const session = state.experimentSessions.find(
      (s) => s.experimentId === experimentId && !s.completedAt,
    );
    if (!session) return;

    const endingId = resolveExperimentEnding(experimentId, session.routeTags);

    const updatedSessions = state.experimentSessions.map((s) => {
      if (s.experimentId === experimentId && !s.completedAt) {
        return {
          ...s,
          completedAt: Date.now(),
          endingId,
        };
      }
      return s;
    });

    const newState = {
      experimentSessions: updatedSessions,
      completedExperiments: state.completedExperiments.includes(experimentId)
        ? state.completedExperiments
        : [...state.completedExperiments, experimentId],
    };
    set(newState);
    saveAppState({ ...state, ...newState });
  },
}));

// 自定义 Hook: 获取当前问题
export const useCurrentQuestion = (): Question | null => {
  const currentQuestionId = useAppStore((state) => state.currentQuestionId);
  if (!currentQuestionId) return null;
  return getQuestionById(currentQuestionId) ?? null;
};

// 自定义 Hook: 获取探索进度
export const useProgress = (): { answered: number; total: number } => {
  const answeredQuestions = useAppStore((state) => state.answeredQuestions);
  return {
    answered: answeredQuestions.length,
    total: questions.length,
  };
};
