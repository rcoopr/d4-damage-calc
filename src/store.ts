import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StatName =
  | 'weaponDps'
  | 'mainStat'
  | 'additive'
  | 'vulnerable'
  | 'critDamage'
  | 'critChance';

export type Stats = Record<StatName, number>;

type SetStats = { [K in keyof Stats as `set${Capitalize<K>}`]: (value: number) => void };

const statFactory = (name: string) =>
  create<Stats & SetStats>()(
    persist(
      (set) => ({
        weaponDps: 1,
        mainStat: 1,
        additive: 1,
        vulnerable: 20,
        critDamage: 50,
        critChance: 5,
        setWeaponDps: (value) => set((state) => ({ ...state, weaponDps: value })),
        setMainStat: (value) => set((state) => ({ ...state, mainStat: value })),
        setAdditive: (value) => set((state) => ({ ...state, additive: value })),
        setVulnerable: (value) => set((state) => ({ ...state, vulnerable: value })),
        setCritDamage: (value) => set((state) => ({ ...state, critDamage: value })),
        setCritChance: (value) => set((state) => ({ ...state, critChance: value })),
      }),
      { name }
    )
  );

export const useStats = {
  base: statFactory('base'),
  item1: statFactory('item1'),
  item2: statFactory('item2'),
};

export type StatSource = keyof typeof useStats;

export function useBuckets(name: StatSource) {
  const stats = useStats[name]();

  const buckets = [
    stats.mainStat,
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
    baseStats.mainStat + itemStats.mainStat,
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
