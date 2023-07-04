import { z } from 'zod'
import { isWornItem } from './utils'

export type StatSource = (typeof sources)[number]
export type ItemSource = Exclude<StatSource, 'char'>
export type BuildSource = 'char' | 'build1' | 'build2'

export const sources = ['char', 'item1', 'item2'] as const
export function isSource(string: StatSource | string): string is StatSource {
	return sources.includes(string as StatSource)
}

export const stats = [
	{ id: 'weaponDps', label: 'Weapon DPS' },
	{ id: 'mainStat', label: 'Main Stat' },
	{ id: 'additive', label: 'Additive', unit: '%' },
	{ id: 'vulnerable', label: 'Vulnerable', unit: '%' },
	{ id: 'critDamage', label: 'Crit Damage', unit: '%' },
	{ id: 'critChance', label: 'Crit Chance', unit: '%' },
] as const

export type StatName = (typeof stats)[number]['id']

export type DpsStats = z.infer<typeof statsSchema>
export type Build = z.infer<typeof buildSchema>
export type BuildStorage = z.infer<typeof buildStorageSchema>

export const statsSchema = z.object({
	weaponDps: z.coerce
		.number()
		.min(0)
		.transform((n) => Math.max(0, n)),
	mainStat: z.coerce
		.number()
		.min(0)
		.transform((n) => Math.max(0, n)),
	additive: z.coerce
		.number()
		.min(0)
		.transform((n) => Math.max(0, n)),
	vulnerable: z.coerce
		.number()
		.min(0)
		.transform((n) => Math.max(0, n)),
	critDamage: z.coerce
		.number()
		.min(0)
		.transform((n) => Math.max(0, n)),
	critChance: z.coerce
		.number()
		.min(0)
		.transform((n) => Math.max(0, n)),
})

export const buildSchema = z.object({
	char: statsSchema,
	item1: statsSchema,
	item2: statsSchema,
	wornItem: z
		.string()
		.nullable()
		.transform((s) => (isWornItem(s) ? s : null)),
})

export const buildStorageSchema = z.record(z.string(), buildSchema)
