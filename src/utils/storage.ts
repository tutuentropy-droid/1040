import type { AppState, ExplorationRecord } from '../types';

// LocalStorage Key 常量
const STORAGE_KEYS = {
  APP_STATE: 'philosophy_explorer_app_state',
  RECORDS: 'philosophy_explorer_records',
  THEME: 'philosophy_explorer_theme',
} as const;

// ==================== 基础 LocalStorage 操作 ====================

/**
 * 检查 LocalStorage 是否可用
 */
const isStorageAvailable = (): boolean => {
  try {
    const key = '__test_storage__';
    window.localStorage.setItem(key, 'test');
    window.localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.warn('LocalStorage 不可用:', e);
    return false;
  }
};

/**
 * 从 LocalStorage 读取数据
 * @param key 存储键
 * @param defaultValue 默认值
 */
const getItem = <T>(key: string, defaultValue: T): T => {
  if (!isStorageAvailable()) return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (e) {
    console.warn(`读取 ${key} 失败，使用默认值:`, e);
    return defaultValue;
  }
};

/**
 * 向 LocalStorage 写入数据
 * @param key 存储键
 * @param value 要存储的值
 */
const setItem = <T>(key: string, value: T): boolean => {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn(`写入 ${key} 失败:`, e);
    return false;
  }
};

/**
 * 从 LocalStorage 删除数据
 * @param key 存储键
 */
const removeItem = (key: string): boolean => {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.warn(`删除 ${key} 失败:`, e);
    return false;
  }
};

// ==================== 应用状态相关 ====================

/**
 * 默认应用状态
 */
export const defaultAppState: AppState = {
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
};

/**
 * 保存应用状态到 LocalStorage
 * @param state 应用状态对象
 */
export const saveAppState = (state: AppState): boolean => {
  // 记录不需要保存两份，只保存状态本身
  const stateToSave = { ...state, records: undefined };
  return setItem(STORAGE_KEYS.APP_STATE, stateToSave);
};

/**
 * 从 LocalStorage 读取应用状态
 * @returns 应用状态对象，不存在则返回默认状态
 */
export const loadAppState = (): AppState => {
  const saved = getItem<Partial<AppState>>(STORAGE_KEYS.APP_STATE, {});
  // 合并默认值，确保新增字段不会丢失
  return {
    ...defaultAppState,
    ...saved,
    records: loadAllRecords(),
  };
};

/**
 * 清空应用状态（保留历史记录）
 */
export const clearAppState = (): boolean => {
  const currentRecords = loadAllRecords();
  const cleared = removeItem(STORAGE_KEYS.APP_STATE);
  if (cleared) {
    saveAllRecords(currentRecords);
  }
  return cleared;
};

// ==================== 探索记录相关 ====================

/**
 * 生成唯一记录 ID
 */
const generateRecordId = (): string => {
  return `rec_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
};

/**
 * 保存所有探索记录
 * @param records 记录数组
 */
const saveAllRecords = (records: ExplorationRecord[]): boolean => {
  return setItem(STORAGE_KEYS.RECORDS, records);
};

/**
 * 加载所有探索记录
 */
export const loadAllRecords = (): ExplorationRecord[] => {
  return getItem<ExplorationRecord[]>(STORAGE_KEYS.RECORDS, []);
};

/**
 * 保存一条新的探索记录
 * @param recordData 记录数据（不含 id 和 timestamp）
 * @returns 保存成功返回完整记录，失败返回 null
 */
export const saveExplorationRecord = (
  recordData: Omit<ExplorationRecord, 'id' | 'timestamp'>,
): ExplorationRecord | null => {
  const newRecord: ExplorationRecord = {
    ...recordData,
    id: generateRecordId(),
    timestamp: Date.now(),
  };
  const records = loadAllRecords();
  records.unshift(newRecord); // 最新记录放在最前面
  const success = saveAllRecords(records);
  return success ? newRecord : null;
};

/**
 * 根据 ID 获取单条记录
 * @param id 记录 ID
 */
export const getRecordById = (id: string): ExplorationRecord | undefined => {
  const records = loadAllRecords();
  return records.find((r) => r.id === id);
};

/**
 * 删除单条记录
 * @param id 记录 ID
 */
export const deleteRecord = (id: string): boolean => {
  const records = loadAllRecords();
  const filtered = records.filter((r) => r.id !== id);
  if (filtered.length === records.length) {
    return false; // 没有找到要删除的记录
  }
  return saveAllRecords(filtered);
};

/**
 * 清空所有历史记录
 */
export const clearAllRecords = (): boolean => {
  return removeItem(STORAGE_KEYS.RECORDS);
};

// ==================== 主题设置相关 ====================

/**
 * 主题类型
 */
export type Theme = 'light' | 'dark';

/**
 * 保存主题设置
 * @param theme 主题 'light' | 'dark'
 */
export const saveTheme = (theme: Theme): boolean => {
  return setItem(STORAGE_KEYS.THEME, theme);
};

/**
 * 加载主题设置
 * @returns 主题设置，默认根据系统偏好
 */
export const loadTheme = (): Theme => {
  const saved = getItem<Theme | null>(STORAGE_KEYS.THEME, null);
  if (saved) return saved;
  // 默认根据系统偏好
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return 'light';
};

// ==================== 通用工具 ====================

/**
 * 清空所有与本应用相关的 LocalStorage 数据
 */
export const clearAllStorage = (): boolean => {
  let success = true;
  Object.values(STORAGE_KEYS).forEach((key) => {
    if (!removeItem(key)) {
      success = false;
    }
  });
  return success;
};

/**
 * 导出所有数据为 JSON 字符串
 */
export const exportAllData = (): string => {
  const data = {
    exportedAt: new Date().toISOString(),
    version: 1,
    appState: loadAppState(),
    records: loadAllRecords(),
    theme: loadTheme(),
  };
  return JSON.stringify(data, null, 2);
};

/**
 * 从 JSON 字符串导入数据
 * @param jsonStr JSON 字符串
 * @param overwrite 是否覆盖现有数据
 */
export const importAllData = (
  jsonStr: string,
  overwrite: boolean = true,
): boolean => {
  try {
    const data = JSON.parse(jsonStr);
    if (!data || typeof data !== 'object') return false;

    if (overwrite) {
      if (data.appState) saveAppState(data.appState);
      if (data.records) saveAllRecords(data.records);
      if (data.theme) saveTheme(data.theme);
    } else {
      // 合并模式：记录合并去重
      if (data.records && Array.isArray(data.records)) {
        const existingRecords = loadAllRecords();
        const existingIds = new Set(existingRecords.map((r) => r.id));
        const merged = [
          ...existingRecords,
          ...data.records.filter((r: ExplorationRecord) => !existingIds.has(r.id)),
        ];
        saveAllRecords(merged);
      }
    }
    return true;
  } catch (e) {
    console.warn('导入数据失败:', e);
    return false;
  }
};
