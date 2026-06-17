import type { EdgeRelation } from '@/types';

const getEdgeColor = (relation: EdgeRelation): string => {
  switch (relation) {
    case '继承':
      return '#4ade80';
    case '批判':
      return '#f87171';
    case '发展':
      return '#60a5fa';
    case '影响':
      return '#a78bfa';
    case '对立':
      return '#fb923c';
    case '融合':
      return '#34d399';
    default:
      return '#9ca3af';
  }
};

export const getArrowMarkers = () => {
  const relations: EdgeRelation[] = ['继承', '批判', '发展', '影响', '对立', '融合'];
  return relations.map((rel) => (
    <marker
      key={rel}
      id={`arrow-${rel}`}
      viewBox="0 0 10 10"
      refX={8}
      refY={5}
      markerWidth={6}
      markerHeight={6}
      orient="auto-start-reverse"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" fill={getEdgeColor(rel)} />
    </marker>
  ));
};

export { getEdgeColor };
