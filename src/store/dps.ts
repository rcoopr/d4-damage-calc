import { atom } from 'jotai';
import { wornItemAtom } from './item-selection';
import { statsAtoms, Stats } from './stats';

export const computedStats = atom((get) => {
  const baseStats = get(statsAtoms.base);
  const item1Stats = get(statsAtoms.item1);
  const item2Stats = get(statsAtoms.item2);

  const wornItem = get(wornItemAtom);
  const wornStats = wornItem ? get(statsAtoms[wornItem]) : undefined;

  const statsWithoutItems = adjustStats(baseStats, wornStats, wornItem ? -1 : 0);
  const statsWithItem1 = adjustStats(statsWithoutItems, item1Stats, wornItem === 'item1' ? 0 : 1);
  const statsWithItem2 = adjustStats(statsWithoutItems, item2Stats, wornItem === 'item2' ? 0 : 1);

  return {
    statsTotal: {
      base: statsWithoutItems,
      item1: statsWithItem1,
      item2: statsWithItem2,
    },
    dps: {
      base: calculateDps(statsWithoutItems),
      item1: calculateDps(statsWithItem1),
      item2: calculateDps(statsWithItem2),
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
