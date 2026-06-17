import type { PhilosophyCategory, EdgeRelation } from '@/types';

/**
 * 分类 → 代表色 的统一映射
 * 图例、节点、面板 所有地方都应使用此映射，确保颜色一致
 */
export const CATEGORY_COLORS: Record<PhilosophyCategory, string> = {
  ancient: '#E67E22',      // 古希腊 - 橙色
  rationalism: '#3498DB',  // 理性主义 - 蓝色
  empiricism: '#27AE60',   // 经验主义 - 绿色
  german: '#9B59B6',       // 德国古典 - 紫色
  modern: '#C0392B',       // 现代哲学 - 红色
};

/**
 * 分类的中文名标签
 */
export const CATEGORY_LABELS: Record<PhilosophyCategory, string> = {
  ancient: '古希腊哲学',
  rationalism: '理性主义',
  empiricism: '经验主义',
  german: '德国古典哲学',
  modern: '现代哲学',
};

/**
 * 获取分类的代表色
 * 所有需要显示节点颜色的地方都应调用此函数，
 * 保证与图例完全对应
 */
export const getCategoryColor = (category: PhilosophyCategory): string => {
  return CATEGORY_COLORS[category] ?? '#c9a962';
};

/**
 * 获取分类中文名
 */
export const getCategoryLabel = (category: PhilosophyCategory): string => {
  return CATEGORY_LABELS[category] ?? '其他哲学';
};

/**
 * 边的关系 → 颜色映射
 */
export const EDGE_COLORS: Record<EdgeRelation, string> = {
  继承: '#27AE60',
  批判: '#E74C3C',
  发展: '#3498DB',
  影响: '#9B59B6',
  对立: '#F39C12',
  融合: '#16A085',
};

/**
 * 获取边的颜色
 */
export const getEdgeColor = (relation: EdgeRelation): string => {
  return EDGE_COLORS[relation] ?? '#9ca3af';
};

/**
 * 生成所有分类的图例数据
 * 用于 PhilosophyMap 的图例组件
 */
export const getCategoryLegend = (): Array<{
  key: PhilosophyCategory;
  label: string;
  color: string;
}> => {
  return (Object.keys(CATEGORY_COLORS) as PhilosophyCategory[]).map((key) => ({
    key,
    label: CATEGORY_LABELS[key],
    color: CATEGORY_COLORS[key],
  }));
};
