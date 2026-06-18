import type { PhilosopherNPC, PhilosophyNode, PhilosophyCategory } from '../types';
import { philosopherNPCs } from '../data/philosophers';
import { philosophyNodes } from '../data/nodes';

export interface TimelineItem {
  id: string;
  name: string;
  type: 'philosopher' | 'school';
  category: PhilosophyCategory;
  era: string;
  startYear: number;
  endYear: number;
  midYear: number;
  title?: string;
  description?: string;
  quote?: string;
  coreIdeas?: string[];
}

export interface DynastyPeriod {
  id: string;
  name: string;
  nameEn: string;
  startYear: number;
  endYear: number;
  color: string;
}

export const DYNASTY_PERIODS: DynastyPeriod[] = [
  { id: 'ancient_greece', name: '古希腊时期', nameEn: 'Ancient Greece', startYear: -600, endYear: -200, color: '#E67E22' },
  { id: 'hellenistic_rome', name: '希腊化与罗马', nameEn: 'Hellenistic & Rome', startYear: -300, endYear: 500, color: '#D35400' },
  { id: 'medieval', name: '中世纪', nameEn: 'Medieval', startYear: 500, endYear: 1400, color: '#8E44AD' },
  { id: 'renaissance', name: '文艺复兴', nameEn: 'Renaissance', startYear: 1400, endYear: 1600, color: '#F39C12' },
  { id: 'early_modern', name: '近代早期', nameEn: 'Early Modern', startYear: 1600, endYear: 1780, color: '#3498DB' },
  { id: 'enlightenment', name: '启蒙时代', nameEn: 'Enlightenment', startYear: 1700, endYear: 1820, color: '#27AE60' },
  { id: 'late_modern', name: '近代晚期', nameEn: 'Late Modern', startYear: 1800, endYear: 1900, color: '#C0392B' },
  { id: 'contemporary', name: '现当代', nameEn: 'Contemporary', startYear: 1900, endYear: 2100, color: '#9B59B6' },
];

const parseEra = (era: string): { startYear: number; endYear: number } => {
  if (!era) return { startYear: 0, endYear: 0 };

  const cleanEra = era.replace(/年/g, '').trim();

  const bcMatch = cleanEra.match(/公元前(\d+(?:-\d+)*)?/);
  if (bcMatch) {
    const parts = cleanEra.split(/[至\-—–]/);
    let startYear = 0;
    let endYear = 0;

    parts.forEach((part, idx) => {
      const bcPart = part.match(/公元前(\d+)/);
      const plainNum = part.match(/(\d+)/);
      if (bcPart) {
        const year = -parseInt(bcPart[1], 10);
        if (idx === 0) startYear = year;
        else endYear = year;
      } else if (plainNum) {
        const year = -parseInt(plainNum[1], 10);
        if (idx === 0) startYear = year;
        else endYear = year;
      }
    });

    if (endYear === 0) endYear = startYear;
    return { startYear: Math.min(startYear, endYear), endYear: Math.max(startYear, endYear) };
  }

  const rangeMatch = cleanEra.match(/^(\d+)\s*[-–—至]\s*(\d+)$/);
  if (rangeMatch) {
    const startYear = parseInt(rangeMatch[1], 10);
    const endYear = parseInt(rangeMatch[2], 10);
    return { startYear, endYear };
  }

  const singleMatch = cleanEra.match(/^(\d+)$/);
  if (singleMatch) {
    const year = parseInt(singleMatch[1], 10);
    return { startYear: year, endYear: year };
  }

  const centuryBcMatch = cleanEra.match(/公元前(\d+)世纪/);
  if (centuryBcMatch) {
    const century = parseInt(centuryBcMatch[1], 10);
    return { startYear: -century * 100, endYear: -(century - 1) * 100 };
  }

  const centuryMatch = cleanEra.match(/(\d+)世纪/);
  if (centuryMatch) {
    const century = parseInt(centuryMatch[1], 10);
    return { startYear: (century - 1) * 100, endYear: century * 100 };
  }

  const multiMatch = cleanEra.match(/(\d+)[^\d]*(\d+)/);
  if (multiMatch) {
    const startYear = parseInt(multiMatch[1], 10);
    const endYear = parseInt(multiMatch[2], 10);
    return { startYear, endYear };
  }

  return { startYear: 0, endYear: 0 };
};

export const buildTimelineItems = (): TimelineItem[] => {
  const items: TimelineItem[] = [];

  philosopherNPCs.forEach((p: PhilosopherNPC) => {
    const { startYear, endYear } = parseEra(p.era);
    items.push({
      id: `p_${p.id}`,
      name: p.name,
      type: 'philosopher',
      category: p.category,
      era: p.era,
      startYear,
      endYear,
      midYear: (startYear + endYear) / 2,
      title: p.title,
      quote: p.quote,
      description: p.portrait,
      coreIdeas: p.thoughtProfile,
    });
  });

  philosophyNodes.forEach((n: PhilosophyNode) => {
    const { startYear, endYear } = parseEra(n.era);
    items.push({
      id: `n_${n.id}`,
      name: n.name,
      type: 'school',
      category: n.category,
      era: n.era,
      startYear,
      endYear,
      midYear: (startYear + endYear) / 2,
      description: n.description,
      coreIdeas: n.coreIdeas,
    });
  });

  return items.sort((a, b) => a.midYear - b.midYear);
};

export const formatYear = (year: number): string => {
  if (year < 0) return `公元前${Math.abs(year)}年`;
  return `公元${year}年`;
};

export const getDynastyForYear = (year: number): DynastyPeriod | undefined => {
  return DYNASTY_PERIODS.find((d) => year >= d.startYear && year <= d.endYear);
};
