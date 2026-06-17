import { create } from 'zustand';
import type { AppState, ExplorationRecord, Question } from '@/types';
import {
  loadAppState,
  saveAppState,
  deleteRecord,
  loadAllRecords,
  saveExplorationRecord,
} from '@/utils/storage';
import { philosophyNodes } from '@/data/nodes';
import { questions, getQuestionById, getFirstQuestion } from '@/data/questions';

interface AppStore extends AppState {
  // 选中的节点 ID（用于弹窗）
  selectedNodeId: string | null;

  // 缩放级别
  zoomLevel: number;

  // 地图偏移
  mapOffset: { x: number; y: number };

  // 探索开始时间
  explorationStartTime: number | null;

  // 设置选中节点
  setSelectedNodeId: (nodeId: string | null) => void;

  // 选择选项
  selectOption: (
    questionId: string,
    optionId: string,
    nextQuestionId?: string | null,
    unlockNodes?: string[],
    routeTags?: Record<string, number>,
  ) => void;

  // 设置当前视图
  setCurrentView: (view: AppState['currentView']) => void;

  // 选择节点
  selectNode: (nodeId: string | null) => void;

  // 设置缩放级别（别名）
  setZoomLevel: (level: number) => void;

  // 重置当前探索
  resetExploration: () => void;

  // 完成探索并保存记录
  finishExploration: () => void;

  // 删除记录
  removeRecord: (recordId: string) => void;

  // 从存储中恢复数据
  hydrate: () => void;

  // 缩放方法
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (level: number) => void;
  resetView: () => void;
  setMapOffset: (offset: { x: number; y: number }) => void;
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
};

export const useAppStore = create<AppStore>((set, get) => ({
  ...initialState,
  selectedNodeId: null,
  zoomLevel: 1,
  mapOffset: { x: 0, y: 0 },
  explorationStartTime: null,

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
