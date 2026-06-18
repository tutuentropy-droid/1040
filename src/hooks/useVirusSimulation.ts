import { useReducer, useCallback, useEffect, useRef } from 'react';
import type { VirusSimState, VirusLogEntry, HybridSchool } from '@/types';
import { thoughtViruses, virusPopulations, hybridRecipes } from '@/data/philosophyVirus';

const HYBRID_THRESHOLD = 50;
const SEED_LEVEL = 45;
const MAX_LOG = 40;

const virusById: Record<string, (typeof thoughtViruses)[number]> = Object.fromEntries(
  thoughtViruses.map((v) => [v.id, v]),
);
const popById: Record<string, (typeof virusPopulations)[number]> = Object.fromEntries(
  virusPopulations.map((p) => [p.id, p]),
);

const recipeByPair = new Map<string, HybridSchool>();
hybridRecipes.forEach((r) => {
  const [a, b] = [...r.virusIds].sort();
  recipeByPair.set(`${a}|${b}`, r);
});

const pairKey = (a: string, b: string) => {
  const [x, y] = [a, b].sort();
  return `${x}|${y}`;
};

const genLogId = () => `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const createInitialState = (): VirusSimState => {
  const populations: VirusSimState['populations'] = {};
  virusPopulations.forEach((p) => {
    populations[p.id] = { id: p.id, infections: {}, hybrids: [] };
  });
  return { populations, tick: 0, isRunning: false, speed: 900, discoveredHybrids: [], log: [] };
};

type Action =
  | { type: 'SEED'; popId: string; virusId: string }
  | { type: 'TICK' }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'SET_SPEED'; speed: number };

const clonePopulations = (state: VirusSimState): VirusSimState['populations'] => {
  const next: VirusSimState['populations'] = {};
  Object.entries(state.populations).forEach(([id, ps]) => {
    next[id] = { id, infections: { ...ps.infections }, hybrids: [...ps.hybrids] };
  });
  return next;
};

function step(state: VirusSimState): VirusSimState {
  const nextPop = clonePopulations(state);
  const newLogs: VirusLogEntry[] = [];
  const discovered = new Set(state.discoveredHybrids);

  virusPopulations.forEach((pop) => {
    const ps = nextPop[pop.id];
    const inf = ps.infections;
    Object.entries(inf).forEach(([virusId, level]) => {
      const virus = virusById[virusId];
      if (!virus || level <= 0) return;

      const internalAccept = pop.susceptibility[virus.category];
      const growth = virus.infectivity * 0.6 * internalAccept;
      inf[virusId] = Math.min(100, level + growth);

      pop.connections.forEach((nbrId) => {
        const nbr = popById[nbrId];
        const nbrPs = nextPop[nbrId];
        if (!nbr || !nbrPs) return;
        const accept = nbr.susceptibility[virus.category];
        const spreadChance = (virus.infectivity / 10) * (level / 100) * accept * 0.9;
        if (Math.random() < spreadChance) {
          const prev = nbrPs.infections[virusId] ?? 0;
          const gain = virus.infectivity * accept * 6 + 4;
          nbrPs.infections[virusId] = Math.min(100, prev + gain);
          if (prev < 1) {
            newLogs.push({
              id: genLogId(),
              tick: state.tick,
              type: 'spread',
              text: `${virus.name} 由「${pop.name}」传入「${nbr.name}」`,
            });
          }
        }
      });
    });
  });

  virusPopulations.forEach((pop) => {
    const ps = nextPop[pop.id];
    const active = thoughtViruses
      .filter((v) => (ps.infections[v.id] ?? 0) >= HYBRID_THRESHOLD)
      .map((v) => v.id);
    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        const recipe = recipeByPair.get(pairKey(active[i], active[j]));
        if (!recipe) continue;
        if (!discovered.has(recipe.id)) {
          discovered.add(recipe.id);
          newLogs.push({
            id: genLogId(),
            tick: state.tick,
            type: 'hybrid',
            text: `新学派诞生：「${recipe.name}」（于 ${pop.name}）`,
          });
        }
        if (!ps.hybrids.includes(recipe.id)) {
          ps.hybrids.push(recipe.id);
        }
      }
    }
  });

  const log = [...newLogs.reverse(), ...state.log].slice(0, MAX_LOG);
  return {
    ...state,
    populations: nextPop,
    tick: state.tick + 1,
    discoveredHybrids: Array.from(discovered),
    log,
  };
}

function reducer(state: VirusSimState, action: Action): VirusSimState {
  switch (action.type) {
    case 'SEED': {
      const ps = state.populations[action.popId];
      if (!ps) return state;
      const virus = virusById[action.virusId];
      if (!virus) return state;
      const nextPop = { ...state.populations };
      nextPop[action.popId] = {
        ...ps,
        infections: {
          ...ps.infections,
          [action.virusId]: Math.max(ps.infections[action.virusId] ?? 0, SEED_LEVEL),
        },
      };
      const pop = popById[action.popId];
      const entry: VirusLogEntry = {
        id: genLogId(),
        tick: state.tick,
        type: 'info',
        text: `植入「${virus.name}」于 ${pop?.name ?? action.popId}`,
      };
      return { ...state, populations: nextPop, log: [entry, ...state.log].slice(0, MAX_LOG) };
    }
    case 'TICK':
      return step(state);
    case 'PLAY':
      return { ...state, isRunning: true };
    case 'PAUSE':
      return { ...state, isRunning: false };
    case 'RESET':
      return createInitialState();
    case 'SET_SPEED':
      return { ...state, speed: action.speed };
    default:
      return state;
  }
}

export function useVirusSimulation() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (!state.isRunning) return;
    const timer = setInterval(() => {
      const s = stateRef.current;
      const hasInfection = Object.values(s.populations).some((ps) =>
        Object.values(ps.infections).some((l) => l > 0),
      );
      if (!hasInfection) {
        dispatch({ type: 'PAUSE' });
        return;
      }
      dispatch({ type: 'TICK' });
    }, state.speed);
    return () => clearInterval(timer);
  }, [state.isRunning, state.speed]);

  const seed = useCallback((popId: string, virusId: string) => dispatch({ type: 'SEED', popId, virusId }), []);
  const tick = useCallback(() => dispatch({ type: 'TICK' }), []);
  const play = useCallback(() => dispatch({ type: 'PLAY' }), []);
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const setSpeed = useCallback((speed: number) => dispatch({ type: 'SET_SPEED', speed }), []);

  return { state, seed, tick, play, pause, reset, setSpeed };
}
