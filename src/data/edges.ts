import type { PhilosophyEdge } from '../types';

// 哲学流派连接线数据（20+条）
export const philosophyEdges: PhilosophyEdge[] = [
  // ==================== 古希腊内部关系 ====================
  {
    id: 'e1',
    source: 'socrates',
    target: 'plato',
    relation: '继承',
    description: '柏拉图是苏格拉底最杰出的学生，将苏格拉底的思想系统化发展',
  },
  {
    id: 'e2',
    source: 'plato',
    target: 'aristotle',
    relation: '继承',
    description: '亚里士多德师从柏拉图20年，"吾爱吾师，吾更爱真理"',
  },
  {
    id: 'e3',
    source: 'aristotle',
    target: 'stoicism',
    relation: '影响',
    description: '斯多葛学派吸收了亚里士多德的逻辑学和伦理学思想',
  },
  {
    id: 'e4',
    source: 'socrates',
    target: 'stoicism',
    relation: '影响',
    description: '斯多葛学派深受苏格拉底的伦理思想和生活态度影响',
  },

  // ==================== 理性主义内部关系 ====================
  {
    id: 'e5',
    source: 'descartes',
    target: 'spinoza',
    relation: '批判',
    description: '斯宾诺莎批判笛卡尔的身心二元论，提出实体一元论',
  },
  {
    id: 'e6',
    source: 'descartes',
    target: 'leibniz',
    relation: '发展',
    description: '莱布尼茨继承笛卡尔理性主义传统，提出单子论和预定和谐说',
  },
  {
    id: 'e7',
    source: 'spinoza',
    target: 'leibniz',
    relation: '批判',
    description: '莱布尼茨对斯宾诺莎的泛神论和决定论进行批判与回应',
  },

  // ==================== 经验主义内部关系 ====================
  {
    id: 'e8',
    source: 'locke',
    target: 'berkeley',
    relation: '批判',
    description: '贝克莱从洛克经验主义出发，批判其物质实体概念，走向主观唯心',
  },
  {
    id: 'e9',
    source: 'berkeley',
    target: 'hume',
    relation: '发展',
    description: '休谟沿着贝克莱的经验主义路线，发展出彻底的怀疑论',
  },
  {
    id: 'e10',
    source: 'locke',
    target: 'hume',
    relation: '发展',
    description: '休谟继承洛克经验主义传统，并将其推向逻辑终点',
  },

  // ==================== 理性主义 vs 经验主义 ====================
  {
    id: 'e11',
    source: 'descartes',
    target: 'locke',
    relation: '对立',
    description: '理性主义与经验主义的对立：天赋观念 vs 白板说',
  },
  {
    id: 'e12',
    source: 'leibniz',
    target: 'locke',
    relation: '对立',
    description: '莱布尼茨与洛克的著名论战：《人类理智新论》对《人类理解论》',
  },

  // ==================== 德国古典哲学内部关系 ====================
  {
    id: 'e13',
    source: 'hume',
    target: 'kant',
    relation: '影响',
    description: '休谟的怀疑论打破了康德的"独断论迷梦"，催生批判哲学',
  },
  {
    id: 'e14',
    source: 'kant',
    target: 'hegel',
    relation: '发展',
    description: '黑格尔继承康德哲学，取消物自体，发展出绝对唯心论体系',
  },
  {
    id: 'e15',
    source: 'kant',
    target: 'schopenhauer',
    relation: '继承',
    description: '叔本华继承康德的物自体概念，将其诠释为"意志"',
  },
  {
    id: 'e16',
    source: 'hegel',
    target: 'schopenhauer',
    relation: '对立',
    description: '叔本华激烈批判黑格尔的理性乐观主义，主张意志形而上学和悲观主义',
  },

  // ==================== 现代哲学与古典传统 ====================
  {
    id: 'e17',
    source: 'schopenhauer',
    target: 'nietzsche',
    relation: '影响',
    description: '叔本华的唯意志论是尼采哲学的重要思想来源',
  },
  {
    id: 'e18',
    source: 'nietzsche',
    target: 'existentialism',
    relation: '影响',
    description: '尼采被视为存在主义的先驱，其自由、价值重估思想深刻影响萨特等',
  },
  {
    id: 'e19',
    source: 'hegel',
    target: 'marxism',
    relation: '批判',
    description: '马克思批判地继承黑格尔的辩证法，创立唯物辩证法',
  },
  {
    id: 'e20',
    source: 'aristotle',
    target: 'utilitarianism',
    relation: '影响',
    description: '功利主义的幸福论传统可追溯至亚里士多德的幸福主义伦理学',
  },
  {
    id: 'e21',
    source: 'kant',
    target: 'phenomenology',
    relation: '影响',
    description: '胡塞尔的现象学深受康德先验哲学的影响，发展出先验现象学',
  },
  {
    id: 'e22',
    source: 'phenomenology',
    target: 'existentialism',
    relation: '融合',
    description: '萨特、海德格尔等存在主义者将现象学方法与存在论问题相结合',
  },
  {
    id: 'e23',
    source: 'descartes',
    target: 'analytic_philosophy',
    relation: '影响',
    description: '分析哲学继承笛卡尔对确定性和严格论证的追求，以语言分析为手段',
  },
  {
    id: 'e24',
    source: 'hume',
    target: 'analytic_philosophy',
    relation: '影响',
    description: '分析哲学深受休谟的经验主义、怀疑论以及对事实/价值区分的影响',
  },
  {
    id: 'e25',
    source: 'locke',
    target: 'pragmatism',
    relation: '影响',
    description: '实用主义继承经验主义传统，将其与实践、行动和效果相结合',
  },
  {
    id: 'e26',
    source: 'berkeley',
    target: 'phenomenology',
    relation: '影响',
    description: '贝克莱的主观经验论与现象学对意识的关注有深刻的思想关联',
  },
  {
    id: 'e27',
    source: 'stoicism',
    target: 'existentialism',
    relation: '影响',
    description: '存在主义对自由、责任、命运的思考与斯多葛学派有精神上的共鸣',
  },
  {
    id: 'e28',
    source: 'plato',
    target: 'kant',
    relation: '影响',
    description: '康德的先验哲学和理念世界与现象界的区分深受柏拉图理念论影响',
  },
];

// 根据源节点 ID 获取出边
export const getEdgesBySource = (sourceId: string) =>
  philosophyEdges.filter((edge) => edge.source === sourceId);

// 根据目标节点 ID 获取入边
export const getEdgesByTarget = (targetId: string) =>
  philosophyEdges.filter((edge) => edge.target === targetId);

// 获取与指定节点相关的所有边
export const getRelatedEdges = (nodeId: string) =>
  philosophyEdges.filter(
    (edge) => edge.source === nodeId || edge.target === nodeId,
  );
