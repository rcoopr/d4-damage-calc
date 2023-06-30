import { atom } from 'jotai';
import { Build, StatSource, wornItemAtom } from './item-selection';
import { statsAtoms, Stats } from './stats';

export type ComputedStats = {
  statsTotal: Record<StatSource, Stats>;
  dps: Record<StatSource | Build, number>;
  comparison: Record<'item' | 'build', number>;
  increase: Record<Exclude<Build, 'base'>, number>;
};

export const computedStatsAtom = atom<ComputedStats>((get) => {
  const baseStats = get(statsAtoms.base);
  const item1Stats = get(statsAtoms.item1);
  const item2Stats = get(statsAtoms.item2);

  const wornItem = get(wornItemAtom);
  const wornStats = wornItem ? get(statsAtoms[wornItem]) : undefined;

  const statsWithoutItems = adjustStats(baseStats, wornStats, wornItem ? -1 : 0);
  const statsWithItem1 = adjustStats(statsWithoutItems, item1Stats);
  const statsWithItem2 = adjustStats(statsWithoutItems, item2Stats);

  const baseDps = calculateDps(statsWithoutItems);
  const build1Dps = calculateDps(statsWithItem1);
  const build2Dps = calculateDps(statsWithItem2);

  const item1Dps = build1Dps - baseDps;
  const item2Dps = build2Dps - baseDps;

  const itemDpsDifference =
    wornItem === 'item2'
      ? item1Dps === 0
        ? 0
        : (100 * (item2Dps - item1Dps)) / item1Dps
      : item2Dps === 0
      ? 0
      : (100 * (item1Dps - item2Dps)) / item2Dps;
  const buildDpsDifference =
    wornItem === 'item2'
      ? build1Dps === 0
        ? 0
        : (100 * (build2Dps - build1Dps)) / build1Dps
      : build2Dps === 0
      ? 0
      : (100 * (build1Dps - build2Dps)) / build2Dps;

  const build1DpsIncrease = (100 * item1Dps) / baseDps;
  const build2DpsIncrease = (100 * item2Dps) / baseDps;

  return {
    statsTotal: {
      base: statsWithoutItems,
      item1: statsWithItem1,
      item2: statsWithItem2,
    },
    dps: {
      base: baseDps,
      item1: item1Dps,
      item2: item2Dps,
      build1: build1Dps,
      build2: build2Dps,
    },
    comparison: {
      item: itemDpsDifference,
      build: buildDpsDifference,
    },
    increase: {
      build1: build1DpsIncrease,
      build2: build2DpsIncrease,
    },
  };
});

function calculateDps(stats: Stats) {
  const buckets = [
    stats.mainStat / 10,
    stats.additive,
    stats.vulnerable,
    (stats.critDamage * Math.min(stats.critChance, 100)) / 100,
  ];
  const damageMultiplier = buckets.reduce((product, bucket) => product * (1 + bucket / 100), 1);

  return stats.weaponDps * damageMultiplier;
}

function adjustStats(stats: Stats, adjustment?: Stats, sign = 1): Stats {
  if (!adjustment) return stats;
  return Object.fromEntries(
    Object.keys(stats).map((key) => [
      key,
      Math.max(0, stats[key as keyof Stats] + sign * adjustment[key as keyof Stats]),
    ])
  ) as Stats;
}
