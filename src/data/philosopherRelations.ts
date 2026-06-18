import type { PhilosopherRelation, PhilosopherRelationType } from '../types';
import { philosophyNodes } from './nodes';

// 人物哲学家节点 ID（排除学派、主义、概念等非人物节点）
export const PERSON_NODE_IDS = [
  'socrates',      // 苏格拉底
  'plato',         // 柏拉图
  'aristotle',     // 亚里士多德
  'descartes',     // 笛卡尔
  'spinoza',       // 斯宾诺莎
  'leibniz',       // 莱布尼茨
  'locke',         // 洛克
  'berkeley',      // 贝克莱
  'hume',          // 休谟
  'kant',          // 康德
  'hegel',         // 黑格尔
  'schopenhauer',  // 叔本华
  'nietzsche',     // 尼采
];

// 判断是否为人物节点
export const isPersonNode = (nodeId: string): boolean => {
  return PERSON_NODE_IDS.includes(nodeId);
};

// 获取所有人物节点
export const getPersonNodes = () => {
  return philosophyNodes.filter((node) => PERSON_NODE_IDS.includes(node.id));
};

export const philosopherRelations: PhilosopherRelation[] = [
  // ==================== 古希腊哲学家关系 ====================
  {
    id: 'pr_socrates_plato',
    source: 'socrates',
    target: 'plato',
    type: '师承',
    description: '柏拉图是苏格拉底最杰出的学生，苏格拉底通过对话追问的方法深刻塑造了柏拉图的哲学思维。柏拉图的对话录成为我们了解苏格拉底思想的主要来源。',
  },
  {
    id: 'pr_plato_aristotle',
    source: 'plato',
    target: 'aristotle',
    type: '师承',
    description: '亚里士多德在柏拉图学院学习了20年，虽为柏拉图的学生，但他在许多问题上与老师意见相左，留下名言"吾爱吾师，吾更爱真理"。',
  },
  {
    id: 'pr_socrates_stoicism',
    source: 'socrates',
    target: 'stoicism',
    type: '影响',
    description: '斯多葛学派深受苏格拉底的伦理思想和生活态度影响，将苏格拉底"认识你自己"和"美德即知识"的思想发展为系统的生活哲学。',
  },

  // ==================== 理性主义哲学家关系 ====================
  {
    id: 'pr_descartes_spinoza',
    source: 'descartes',
    target: 'spinoza',
    type: '批判',
    description: '斯宾诺莎从笛卡尔的理性主义前提出发，但批判其身心二元论，提出了神即自然的实体一元论，将理性主义推向更彻底的方向。',
  },
  {
    id: 'pr_descartes_leibniz',
    source: 'descartes',
    target: 'leibniz',
    type: '发展',
    description: '莱布尼茨继承笛卡尔的理性主义传统，在笛卡尔身心问题的基础上提出单子论和预定和谐说，构建了更为精致的形而上学体系。',
  },
  {
    id: 'pr_spinoza_leibniz',
    source: 'spinoza',
    target: 'leibniz',
    type: '批判',
    description: '莱布尼茨对斯宾诺莎的泛神论和决定论进行了深入批判与回应，虽然二人都主张实体一元论，但莱布尼茨的单子是多元的、有目的的。',
  },

  // ==================== 经验主义哲学家关系 ====================
  {
    id: 'pr_locke_berkeley',
    source: 'locke',
    target: 'berkeley',
    type: '批判',
    description: '贝克莱从洛克经验主义前提出发，却批判其物质实体概念，认为既然一切知识都来自感觉，我们就没有理由相信独立于感觉的物质存在，走向了主观唯心主义。',
  },
  {
    id: 'pr_berkeley_hume',
    source: 'berkeley',
    target: 'hume',
    type: '发展',
    description: '休谟沿着贝克莱的经验主义路线继续前进，不仅否定了物质实体，还否定了精神实体和因果必然性，发展出彻底的怀疑论。',
  },
  {
    id: 'pr_locke_hume',
    source: 'locke',
    target: 'hume',
    type: '发展',
    description: '休谟继承洛克经验主义传统，将其推向逻辑终点，从"白板说"出发，最终得出因果关系只是心理习惯的怀疑论结论。',
  },

  // ==================== 理性主义 vs 经验主义 ====================
  {
    id: 'pr_descartes_locke',
    source: 'descartes',
    target: 'locke',
    type: '对立',
    description: '理性主义与经验主义的根本对立：笛卡尔主张天赋观念和理性演绎，洛克主张白板说和经验归纳，这一对立构成了近代认识论的主线。',
  },
  {
    id: 'pr_leibniz_locke',
    source: 'leibniz',
    target: 'locke',
    type: '对立',
    description: '莱布尼茨与洛克的著名论战：莱布尼茨写下《人类理智新论》逐条反驳洛克的《人类理解论》，捍卫理性主义的天赋观念论。',
  },

  // ==================== 德国古典哲学关系 ====================
  {
    id: 'pr_hume_kant',
    source: 'hume',
    target: 'kant',
    type: '影响',
    description: '休谟的怀疑论打破了康德的"独断论迷梦"，直接催生了康德的批判哲学。康德试图通过先天综合判断来回应休谟对因果必然性的质疑。',
  },
  {
    id: 'pr_kant_hegel',
    source: 'kant',
    target: 'hegel',
    type: '发展',
    description: '黑格尔继承康德哲学，但取消了康德不可知的"物自体"，将理性推向绝对，发展出包罗万象的绝对唯心论体系和辩证法。',
  },
  {
    id: 'pr_kant_schopenhauer',
    source: 'kant',
    target: 'schopenhauer',
    type: '继承',
    description: '叔本华继承康德的现象与物自体的二分，但将物自体诠释为"意志"，认为世界的本质是盲目的生存意志，开辟了唯意志论传统。',
  },
  {
    id: 'pr_hegel_schopenhauer',
    source: 'hegel',
    target: 'schopenhauer',
    type: '对立',
    description: '叔本华激烈批判黑格尔的理性乐观主义，认为黑格尔是"诡辩家"。与黑格尔强调历史的理性进程不同，叔本华主张意志形而上学和悲观主义人生观。',
  },
  {
    id: 'pr_plato_kant',
    source: 'plato',
    target: 'kant',
    type: '影响',
    description: '康德的先验哲学深受柏拉图理念论的影响，其现象界与本体界的区分可追溯至柏拉图的感官世界与理念世界的二分。',
  },

  // ==================== 现代哲学关系 ====================
  {
    id: 'pr_schopenhauer_nietzsche',
    source: 'schopenhauer',
    target: 'nietzsche',
    type: '影响',
    description: '叔本华的唯意志论是尼采哲学的重要思想来源。尼采早年深受叔本华影响，但后来将"生存意志"改造为"权力意志"，从悲观主义转向积极的价值重估。',
  },
  {
    id: 'pr_nietzsche_existentialism',
    source: 'nietzsche',
    target: 'existentialism',
    type: '影响',
    description: '尼采被视为存在主义的先驱，其"上帝死了"的宣告、自由、价值重估和超人学说深刻影响了萨特、加缪等存在主义哲学家。',
  },
  {
    id: 'pr_hegel_marxism',
    source: 'hegel',
    target: 'marxism',
    type: '批判',
    description: '马克思批判地继承黑格尔的辩证法，将其"头足倒置"——把唯心辩证法改造为唯物辩证法，用历史唯物主义解释社会发展规律。',
  },
  {
    id: 'pr_kant_phenomenology',
    source: 'kant',
    target: 'phenomenology',
    type: '影响',
    description: '胡塞尔的现象学深受康德先验哲学的影响，发展出先验现象学，试图通过现象学还原为知识奠定绝对可靠的基础。',
  },
  {
    id: 'pr_phenomenology_existentialism',
    source: 'phenomenology',
    target: 'existentialism',
    type: '融合',
    description: '萨特、海德格尔等存在主义者将现象学方法与存在论问题相结合，用现象学的描述方法来揭示人的存在结构。',
  },
  {
    id: 'pr_stoicism_existentialism',
    source: 'stoicism',
    target: 'existentialism',
    type: '影响',
    description: '存在主义对自由、责任、命运的思考与斯多葛学派有精神上的共鸣，二者都关注人在世界中的处境和如何获得内心的自由。',
  },
  {
    id: 'pr_descartes_analytic',
    source: 'descartes',
    target: 'analytic_philosophy',
    type: '影响',
    description: '分析哲学继承笛卡尔对确定性和严格论证的追求，以语言分析为新的手段，试图通过澄清语言来解决或消解传统哲学问题。',
  },
  {
    id: 'pr_hume_analytic',
    source: 'hume',
    target: 'analytic_philosophy',
    type: '影响',
    description: '分析哲学深受休谟的经验主义、怀疑论以及对事实/价值区分的影响，逻辑实证主义者更是直接将休谟视为思想先驱。',
  },
  {
    id: 'pr_locke_pragmatism',
    source: 'locke',
    target: 'pragmatism',
    type: '影响',
    description: '实用主义继承经验主义传统，将其与实践、行动和效果相结合，认为思想和概念都是适应环境、解决问题的工具。',
  },
  {
    id: 'pr_berkeley_phenomenology',
    source: 'berkeley',
    target: 'phenomenology',
    type: '影响',
    description: '贝克莱的主观经验论与现象学对意识的关注有深刻的思想关联，二者都试图回到直接呈现于意识中的现象本身。',
  },
  {
    id: 'pr_aristotle_utilitarianism',
    source: 'aristotle',
    target: 'utilitarianism',
    type: '影响',
    description: '功利主义的幸福论传统可追溯至亚里士多德的幸福主义伦理学，二者都将幸福作为伦理学的核心概念，但对幸福的理解有本质差异。',
  },
];

// 获取关系类型的颜色（7种颜色在色轮上均匀分布，确保视觉差异明显）
export const getRelationColor = (type: PhilosopherRelationType): string => {
  const colors: Record<PhilosopherRelationType, string> = {
    '师承': '#27AE60',   // 翠绿色 - 师徒传承，生命延续
    '继承': '#3498DB',   // 天蓝色 - 思想继承，河流延伸
    '批判': '#E74C3C',   // 正红色 - 批判反对，鲜明冲突
    '发展': '#9B59B6',   // 紫罗兰 - 创新发展，神秘超越
    '影响': '#F1C40F',   // 金黄色 - 启发影响，光芒四射
    '对立': '#E67E22',   // 橙红色 - 思想对立，张力强烈
    '融合': '#1ABC9C',   // 青蓝色 - 融会贯通，江海交汇
  };
  return colors[type] || '#c9a962';
};

// 获取关系类型的描述
export const getRelationDescription = (type: PhilosopherRelationType): string => {
  const descriptions: Record<PhilosopherRelationType, string> = {
    '师承': '直接的师徒传承关系',
    '继承': '思想上的继承与延续',
    '批判': '对前人思想的批判与超越',
    '发展': '在既有基础上的创新发展',
    '影响': '重要的思想启发与影响',
    '对立': '根本性的思想对立与分歧',
    '融合': '不同思想的融会贯通',
  };
  return descriptions[type] || '';
};

// 根据源哲学家获取关系
export const getRelationsBySource = (philosopherId: string) =>
  philosopherRelations.filter((r) => r.source === philosopherId);

// 根据目标哲学家获取关系
export const getRelationsByTarget = (philosopherId: string) =>
  philosopherRelations.filter((r) => r.target === philosopherId);

// 获取与指定哲学家相关的所有关系
export const getAllRelationsForPhilosopher = (philosopherId: string) =>
  philosopherRelations.filter(
    (r) => r.source === philosopherId || r.target === philosopherId,
  );

// 获取所有哲学家人物之间的关系（排除学派、主义等非人物节点）
export const getPersonToPersonRelations = (): PhilosopherRelation[] => {
  return philosopherRelations.filter(
    (r) => isPersonNode(r.source) && isPersonNode(r.target),
  );
};
