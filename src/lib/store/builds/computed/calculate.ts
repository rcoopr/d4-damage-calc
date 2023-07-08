import { ComputedStats } from '@/lib/store/builds/computed/atom'
import { Build, DpsStats } from '@/lib/store/builds/schema'

export function computeStats(build: Build): ComputedStats {
	const baseStats = build.char
	const item1Stats = build.item1
	const item2Stats = build.item2

	const wornItem = build.wornItem
	const wornStats = wornItem ? build[wornItem] : undefined

	const statsWithoutItems = adjustStats(
		baseStats,
		wornStats,
		wornItem ? -1 : 0,
	)
	const statsWithItem1 = adjustStats(statsWithoutItems, item1Stats)
	const statsWithItem2 = adjustStats(statsWithoutItems, item2Stats)

	const { dps: baseDps, multipliers: baseMultipliers } =
		calculateDps(statsWithoutItems)
	const { dps: build1Dps, multipliers: build1Multipliers } =
		calculateDps(statsWithItem1)
	const { dps: build2Dps, multipliers: build2Multipliers } =
		calculateDps(statsWithItem2)

	const item1Dps = build1Dps - baseDps
	const item2Dps = build2Dps - baseDps

	const itemDpsDifference =
		wornItem === 'item2'
			? item1Dps === 0
				? 0
				: (100 * (item2Dps - item1Dps)) / item1Dps
			: item2Dps === 0
			? 0
			: (100 * (item1Dps - item2Dps)) / item2Dps
	const buildDpsDifference =
		wornItem === 'item2'
			? build1Dps === 0
				? 0
				: (100 * (build2Dps - build1Dps)) / build1Dps
			: build2Dps === 0
			? 0
			: (100 * (build1Dps - build2Dps)) / build2Dps

	const build1DpsIncrease = (100 * item1Dps) / baseDps
	const build2DpsIncrease = (100 * item2Dps) / baseDps

	return {
		statsTotal: {
			char: statsWithoutItems,
			item1: statsWithItem1,
			item2: statsWithItem2,
		},
		dps: {
			char: baseDps,
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
		multipliers: {
			char: baseMultipliers,
			build1: build1Multipliers,
			build2: build2Multipliers,
		},
	}
}

function calculateDps(stats: DpsStats) {
	const buckets = [
		stats.mainStat / 10,
		stats.additive,
		stats.vulnerable,
		(stats.critDamage * Math.min(stats.critChance, 100)) / 100,
	]

	const multipliers = buckets.map((bucket) => 1 + bucket / 100)
	const damageMultiplier = multipliers.reduce(
		(product, multiplier) => product * multiplier,
		1,
	)

	return { dps: stats.weaponDps * damageMultiplier, multipliers }
}

function adjustStats(
	stats: DpsStats,
	adjustment?: DpsStats,
	sign = 1,
): DpsStats {
	if (!adjustment) return stats
	return Object.fromEntries(
		Object.keys(stats).map((key) => [
			key,
			Math.max(
				0,
				stats[key as keyof DpsStats] +
					sign * adjustment[key as keyof DpsStats],
			),
		]),
	) as DpsStats
}
