'use client'

import { useAtomValue } from 'jotai'
import { formatDps } from '@/lib/format'
import { computedStatsAtom } from '@/lib/store/builds/computed'
import { StatSource } from '@/lib/store/builds/schema'

const calculateRelativeValue = (bucket1: number, bucket2: number) => {
	return (1 + bucket2) / (1 + bucket1)
}

export function RelativeStatValues({ source }: { source: StatSource }) {
	const computedStats = useAtomValue(computedStatsAtom)
	const s = computedStats.statsTotal[source]

	const buckets = [
		s.mainStat / 10,
		s.additive,
		s.vulnerable,
		(s.critDamage * Math.min(s.critChance, 100)) / 100,
	]

	const weaponILevelRelativePower =
		1 / calculateRelativeValue(buckets[0] / 5, 10)

	const relativeValues = buckets.map((bucket) =>
		calculateRelativeValue(s.mainStat / 10, bucket),
	)

	const largestRelativeValue = Math.max(...relativeValues)
	const normalizedRelativeValues = relativeValues.map(
		(value) => value / largestRelativeValue ?? 0.001,
	)
	const relativeElementWidths = normalizedRelativeValues.map(
		(value) => `${(value * 100).toFixed(2)}%`,
	)

	const relativeCritDamage = (relativeValues[3] * 100) / s.critChance
	const relativeCritChance = (relativeValues[3] * 100) / s.critDamage

	const fmtRelativeCritDamage = formatDps(relativeCritDamage, {
		asPercent: true,
		compact: true,
	})
	const fmtRelativeCritChance = formatDps(relativeCritChance, {
		asPercent: true,
		compact: true,
	})

	return (
		<>
			<div className='mt-6 flex items-center'>
				<h2 className='pr-4 text-2xl font-bold'>Relative Values</h2>
				<span className='text-sm text-stone-400/80'>
					(Prioritize the smallest bars)
				</span>
			</div>
			<RelativeValue
				width={relativeElementWidths[0]}
				label='10 Mainstat Equals...'
			/>
			<RelativeValue
				width={relativeElementWidths[1]}
				label={`${relativeValues[1].toFixed(2)} Additive`}
			/>
			<RelativeValue
				width={relativeElementWidths[2]}
				label={`${relativeValues[2].toFixed(2)} Vulnerable`}
			/>
			<RelativeValue
				width={relativeElementWidths[3]}
				label={() => (
					<span>
						{fmtRelativeCritDamage} Crit Dmg{' '}
						<span className='text-xs'>OR</span> {fmtRelativeCritChance}{' '}
						Crit Chance
					</span>
				)}
			/>
			<RelativeValue
				label={`${weaponILevelRelativePower.toFixed(2)} Item Levels`}
			/>
		</>
	)
}

function RelativeValue({
	width,
	label: Label,
}: {
	width?: string
	label?: string | (() => React.ReactNode)
}) {
	return (
		<div className='relative flex items-center'>
			{width && (
				<div
					style={{ width }}
					className='absolute inset-y-0 left-0 rounded-r-md bg-primary will-change-transform'
				/>
			)}
			{(Label || width) && (
				<div className='relative flex items-center px-5 py-1.5'>
					<span className='rounded bg-stone-800 px-2'>
						{typeof Label === 'function' ? <Label /> : Label || width}
					</span>
				</div>
			)}
		</div>
	)
}

// const damageMultiplier = buckets.reduce((product, bucket) => product * (1 + bucket / 100), 1);
// const contributions = buckets.map((bucket) => bucket / 100 / damageMultiplier);
// const contributionSum = contributions.reduce((a, b) => a + b, 0);
// const proportions = contributions.map((value) => value / contributionSum ?? 1);
// const proportionsElementWidths = proportions.map((value) => `${(value * 100).toFixed(2)}%`);
// {
/* <RelativeValue />
      <RelativeValue label="Damage Contribution" />
      <RelativeValue width={proportionsElementWidths[0]} />
      <RelativeValue width={proportionsElementWidths[1]} />
      <RelativeValue width={proportionsElementWidths[2]} />
      <RelativeValue width={proportionsElementWidths[3]} />
      <RelativeValue /> */
// }
