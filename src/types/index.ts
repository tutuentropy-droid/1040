// 哲学节点分类
export type PhilosophyCategory =
  | 'ancient' // 古希腊
  | 'rationalism' // 理性主义
  | 'empiricism' // 经验主义
  | 'german' // 德国古典
  | 'modern'; // 现代

// 哲学流派节点
export interface PhilosophyNode {
  id: string;
  name: string;
  category: PhilosophyCategory;
  description: string;
  detail: string;
  keyFigures: string[];
  coreIdeas: string[];
  era: string;
  x: number;
  y: number;
  color: string;
}

// 边的关系类型
export type EdgeRelation =
  | '继承'
  | '批判'
  | '发展'
  | '影响'
  | '对立'
  | '融合';

// 哲学流派连接线
export interface PhilosophyEdge {
  id: string;
  source: string;
  target: string;
  relation: EdgeRelation;
  description?: string;
}

// 问题选项
export interface QuestionOption {
  id: string;
  text: string;
  unlockNodes: string[];
  routeTags: Record<string, number>;
  nextQuestionId: string | null;
  feedback: string;
}

// 哲学问题
export interface Question {
  id: string;
  title: string;
  description: string;
  options: QuestionOption[];
}

// 探索记录
export interface ExplorationRecord {
  id: string;
  timestamp: number;
  startedAt: number;
  completedAt?: number;
  path: string[];
  unlockedNodes: string[];
  routeTags: Record<string, number>;
  summary: string;
}

// 视图类型
export interface PhilosopherChallengeOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface PhilosopherChallenge {
  id: string;
  question: string;
  hint: string;
  options: PhilosopherChallengeOption[];
}

export interface PhilosopherNPC {
  id: string;
  name: string;
  title: string;
  era: string;
  category: PhilosophyCategory;
  portrait: string;
  quote: string;
  thoughtProfile: string[];
  classicViewpoints: string[];
  challenge: PhilosopherChallenge;
  rewardNodes: string[];
}

export interface PhilosopherProfile {
  philosopherId: string;
  encounteredAt: number;
  challengeCompletedAt?: number;
}

// 哲学家关系类型
export type PhilosopherRelationType =
  | '师承'      // 直接师徒关系
  | '继承'      // 思想继承
  | '批判'      // 批判与反对
  | '发展'      // 发展与创新
  | '影响'      // 重要影响
  | '对立'      // 思想对立
  | '融合';     // 思想融合

// 哲学家之间的关系
export interface PhilosopherRelation {
  id: string;
  source: string;       // 源哲学家ID（PhilosopherNPC的id，去掉npc_前缀）
  target: string;       // 目标哲学家ID
  type: PhilosopherRelationType;
  description: string;  // 关系描述
}

// 思想成长记录（用于成长路径）
export interface ThoughtGrowthPoint {
  id: string;
  timestamp: number;
  philosopherId?: string;     // 关联的哲学家
  unlockedNodes: string[];    // 解锁的思想节点
  routeTags: Record<string, number>;  // 思想倾向标签
  summary: string;            // 成长描述
}

export interface ExperimentStepOption {
  id: string;
  text: string;
  nextStepId: string | null;
  feedback: string;
  philosophyExplanation: string;
  philosophySchools: string[];
  routeTags: Record<string, number>;
}

export interface ExperimentStep {
  id: string;
  title: string;
  description: string;
  options: ExperimentStepOption[];
}

export interface ExperimentEnding {
  id: string;
  title: string;
  description: string;
  philosophySchools: string[];
  routeTags: Record<string, number>;
  advice: string;
}

export interface ThoughtExperimentData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  relatedNodes: string[];
  steps: ExperimentStep[];
  endings: ExperimentEnding[];
}

export interface ExperimentSession {
  experimentId: string;
  startedAt: number;
  completedAt?: number;
  choices: { stepId: string; optionId: string }[];
  endingId?: string;
  routeTags: Record<string, number>;
}

export interface DebateRound {
  roundNumber: number;
  philosopherA: {
    argument: string;
    type: 'opening' | 'rebuttal' | 'closing';
  };
  philosopherB: {
    argument: string;
    type: 'opening' | 'rebuttal' | 'closing';
  };
}

export interface DebateVerdict {
  summary: string;
  keyDisagreement: string;
  commonGround: string;
}

export interface DebateMatchup {
  id: string;
  philosopherA: string;
  philosopherB: string;
  topic: string;
  description: string;
  rounds: DebateRound[];
  verdict: DebateVerdict;
}

export type View =
  | 'home'
  | 'questionnaire'
  | 'graph'
  | 'history'
  | 'nodeDetail'
  | 'relationGraph'
  | 'growthPath';

export interface AppState {
  currentView: View;
  currentQuestionId: string | null;
  answeredQuestions: string[];
  selectedOptions: Record<string, string>;
  unlockedNodes: string[];
  activeNodeId: string | null;
  routeTags: Record<string, number>;
  explorationPath: string[];
  records: ExplorationRecord[];
  encounteredPhilosophers: PhilosopherProfile[];
  completedChallenges: string[];
  experimentSessions: ExperimentSession[];
  completedExperiments: string[];
  experimentRouteTags: Record<string, number>;
}

// ==================== 哲学病毒系统 ====================

// 观念病毒：一种会传播的思想，依附于某个哲学节点
export interface ThoughtVirus {
  id: string;
  name: string;
  category: PhilosophyCategory;
  infectivity: number; // 1-10 传染力基数
  tagline: string; // 一句话特征
  color: string;
  nodeId?: string; // 关联的哲学节点 id
}

// 虚拟社会人群：对各类思想的接受概率不同
export interface VirusPopulation {
  id: string;
  name: string;
  icon: string;
  description: string;
  susceptibility: Record<PhilosophyCategory, number>; // 对各类思想的接受概率 0-1
  connections: string[]; // 相连的人群 id（用于扩散）
  x: number; // 网络布局坐标 0-1
  y: number;
}

// 混合学派：两种观念病毒在人群中相遇后诞生的新学派
export interface HybridSchool {
  id: string;
  name: string;
  description: string;
  color: string;
  virusIds: [string, string]; // 触发的两种病毒
}

// 单个人群的运行时感染状态
export interface VirusPopState {
  id: string;
  infections: Record<string, number>; // virusId -> 感染强度 0-100
  hybrids: string[]; // 该人群已诞生的混合学派 id
}

// 事件日志条目
export interface VirusLogEntry {
  id: string;
  tick: number;
  text: string;
  type: 'spread' | 'hybrid' | 'info';
}

// 哲学病毒模拟的整体状态
export interface VirusSimState {
  populations: Record<string, VirusPopState>;
  tick: number;
  isRunning: boolean;
  speed: number; // 每步间隔毫秒
  discoveredHybrids: string[];
  log: VirusLogEntry[];
}
