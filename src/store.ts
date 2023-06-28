/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import isEqual from 'lodash.isequal';

function defaultStatValidator(value?: string | number) {
  const asNumber = Number(value);
  return Math.max(0, Number.isNaN(asNumber) ? 0 : asNumber);
}

export const stats = [
  { id: 'weaponDps', label: 'Weapon DPS', validator: defaultStatValidator },
  { id: 'mainStat', label: 'Main Stat', unit: '', validator: defaultStatValidator },
  { id: 'additive', label: 'Additive', unit: '%', validator: defaultStatValidator },
  { id: 'vulnerable', label: 'Vulnerable', unit: '%', validator: defaultStatValidator },
  { id: 'critDamage', label: 'Crit Damage', unit: '%', validator: defaultStatValidator },
  { id: 'critChance', label: 'Crit Chance', unit: '%', validator: defaultStatValidator },
] as const;

export type StatName = typeof stats[number]['id'];

export type Stats = Record<StatName, number>;

type SetStats = { [K in keyof Stats as `set${Capitalize<K>}`]: (value: number) => void } & {
  setAll: (stats: Stats) => void;
};

const defaultBaseStats: Stats = {
  weaponDps: 1,
  mainStat: 1,
  additive: 1,
  vulnerable: 20,
  critDamage: 50,
  critChance: 5,
};

const defaultItemStats: Stats = {
  weaponDps: 0,
  mainStat: 0,
  additive: 0,
  vulnerable: 0,
  critDamage: 0,
  critChance: 0,
};

export function isDefaultStats(source: StatSource, stats: Stats & SetStats) {
  const statValues = Object.fromEntries(
    Object.entries(stats).filter(([key]) => !key.startsWith('set'))
  );

  return isEqual(statValues, source === 'base' ? defaultBaseStats : defaultItemStats);
}

const statFactory = (name: string, base?: boolean) =>
  create<Stats & SetStats>()(
    persist(
      (set) => ({
        ...(base ? defaultBaseStats : defaultItemStats),
        setWeaponDps: (value) => set((state) => ({ ...state, weaponDps: value })),
        setMainStat: (value) => set((state) => ({ ...state, mainStat: value })),
        setAdditive: (value) => set((state) => ({ ...state, additive: value })),
        setVulnerable: (value) => set((state) => ({ ...state, vulnerable: value })),
        setCritDamage: (value) => set((state) => ({ ...state, critDamage: value })),
        setCritChance: (value) => set((state) => ({ ...state, critChance: value })),
        setAll: (stats) => set((state) => ({ ...state, ...stats })),
      }),
      { name }
    )
  );

export const sources = ['base', 'item1', 'item2'] as const;

export const useStats = {
  base: statFactory('base', true),
  item1: statFactory('item1'),
  item2: statFactory('item2'),
};

export type StatSource = typeof sources[number];

export function useBuckets(name: StatSource) {
  const stats = useStats[name]();

  const buckets = [
    stats.mainStat / 10,
    stats.additive,
    stats.vulnerable,
    (stats.critDamage * Math.min(stats.critChance, 100)) / 100,
  ];

  const damageMultiplier = buckets.reduce((product, bucket) => product * (1 + bucket / 100), 1);

  return { buckets, damageMultiplier };
}

export function useCombinedBuckets(name: StatSource) {
  const baseStats = useStats.base();
  const itemStats = useStats[name]();

  const buckets = [
    (baseStats.mainStat + itemStats.mainStat) / 10,
    baseStats.additive + itemStats.additive,
    baseStats.vulnerable + itemStats.vulnerable,
    ((baseStats.critDamage + itemStats.critDamage) *
      Math.min(baseStats.critChance + itemStats.critChance, 100)) /
      100,
  ];

  const damageMultiplier = buckets.reduce((product, bucket) => product * (1 + bucket / 100), 1);

  return { buckets, damageMultiplier };
}

type ItemSelection = {
  item: number;
  setItem: (value: number) => void;
};

export const useItemSelection = create<ItemSelection>()((set) => ({
  item: 1,
  setItem: (value) => set((state) => ({ ...state, item: value })),
}));
