export type StatSource = typeof sources[number];
export type ItemSource = Exclude<StatSource, 'char'>;
export type BuildSource = 'char' | 'build1' | 'build2';

export const sources = ['char', 'item1', 'item2'] as const;
export function isSource(string: StatSource | string): string is StatSource {
  return sources.includes(string as StatSource);
}

export const stats = [
  { id: 'weaponDps', label: 'Weapon DPS' },
  { id: 'mainStat', label: 'Main Stat' },
  { id: 'additive', label: 'Additive', unit: '%' },
  { id: 'vulnerable', label: 'Vulnerable', unit: '%' },
  { id: 'critDamage', label: 'Crit Damage', unit: '%' },
  { id: 'critChance', label: 'Crit Chance', unit: '%' },
] as const;

export type StatName = typeof stats[number]['id'];
