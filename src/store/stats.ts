import { atomWithStorage } from 'jotai/utils';
import isEqual from 'lodash.isequal';
import { StatSource } from './item-selection';

function defaultStatValidator(value?: string | number) {
  const asNumber = Number(value);
  return Math.max(0, Number.isNaN(asNumber) ? 0 : asNumber);
}

export const stats = [
  { id: 'weaponDps', label: 'Weapon DPS', validator: defaultStatValidator },
  { id: 'mainStat', label: 'Main Stat', validator: defaultStatValidator },
  { id: 'additive', label: 'Additive', unit: '%', validator: defaultStatValidator },
  { id: 'vulnerable', label: 'Vulnerable', unit: '%', validator: defaultStatValidator },
  { id: 'critDamage', label: 'Crit Damage', unit: '%', validator: defaultStatValidator },
  { id: 'critChance', label: 'Crit Chance', unit: '%', validator: defaultStatValidator },
] as const;

export type Stats = Record<StatName, number>;
export type StatName = typeof stats[number]['id'];

const defaultBaseStats: Stats = {
  weaponDps: 1000,
  mainStat: 0,
  additive: 0,
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

export const statsAtoms = {
  base: atomWithStorage('base-stats', defaultBaseStats),
  item1: atomWithStorage('item1-stats', defaultItemStats),
  item2: atomWithStorage('item2-stats', defaultItemStats),
} satisfies Record<StatSource, unknown>;

export function isDefaultStats(source: StatSource, stats: Stats) {
  return isEqual(stats, source === 'base' ? defaultBaseStats : defaultItemStats);
}
