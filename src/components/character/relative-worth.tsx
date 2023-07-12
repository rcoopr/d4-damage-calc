'use client'

import { atom, useAtom, useAtomValue } from 'jotai'
import { ChangeEventHandler, useCallback } from 'react'
import { formatDps } from '@/lib/format'
import { computedStatsAtom } from '@/lib/store/builds/computed/atom'
import { StatSource, sources } from '@/lib/store/builds/schema'
import { mapSourceToBuilds, mapSourcesToLabels } from '@/lib/utils'
import { isStatSource } from '@/lib/store/builds/utils'

const target = 1.01
const iLevelPerPercentInc = (5 * Math.log(target)) / Math.log(1.02)

const statSourceAtom = atom<StatSource>(sources[0])

export function RelativeStatValues() {
	const computedStats = useAtomValue(computedStatsAtom)
	const [source, setSource] = useAtom(statSourceAtom)
	const build = mapSourceToBuilds[source]

	const s = computedStats.statsTotal[source]

	const buckets = [
		s.mainStat / 10,
		s.additive,
		s.vulnerable,
		(s.critDamage * Math.min(s.critChance, 100)) / 100,
	]

	const logMultipliers = computedStats.multipliers[build].map((mult) =>
		Math.log(mult),
	)
	const logTotalMultiplier = logMultipliers.reduce((a, b) => a + b, 0)

	const contributions = logMultipliers.map(
		(logMult) => logMult / logTotalMultiplier,
	)

	const maxContribution = Math.max(...contributions)
	const normalizedContributions = contributions.map(
		(value) => value / maxContribution,
	)

	const relativeElementWidths = normalizedContributions.map(
		(value) => `${(value * 100).toFixed(2)}%`,
	)

	const target = 1.01
	const incToReachTarget = buckets.map(
		(bucket) => 100 * ((1 + bucket / 100) * target - 1) - bucket,
	)

	const relativeCritDamage = (incToReachTarget[3] * 100) / s.critChance
	const relativeCritChance = (incToReachTarget[3] * 100) / s.critDamage

	const fmtRelativeCritDamage = formatDps(relativeCritDamage, {
		asPercent: true,
		compact: true,
	})
	const fmtRelativeCritChance = formatDps(relativeCritChance, {
		asPercent: true,
		compact: true,
	})

	const onSelectChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(
		(ev) => {
			if (isStatSource(ev.currentTarget.value))
				setSource(ev.currentTarget.value)
		},
		[setSource],
	)

	return (
		<>
			<div className='flex items-center justify-between'>
				<h2 className='pr-4 text-2xl font-bold whitespace-nowrap'>
					Relative Values
				</h2>
				<select
					value={source}
					onChange={onSelectChange}
					className='select select-bordered bg-stone-800 select-sm rounded'
				>
					{sources.map((source) => (
						<option key={source} value={source}>
							{mapSourcesToLabels[source]}
						</option>
					))}
				</select>
			</div>
			<div>Amount needed for 1% DPS increase</div>
			<div>Bars display contribution of each stat to overall DPS</div>
			<div className='text-sm text-stone-400/80 -mt-3'>
				(Prioritize the smallest bars)
			</div>
			<RelativeValue
				width={relativeElementWidths[0]}
				label={`${(incToReachTarget[0] * 10).toFixed(2)} Main Stat`}
			/>
			<RelativeValue
				width={relativeElementWidths[1]}
				label={`${incToReachTarget[1].toFixed(2)} Additive`}
			/>
			<RelativeValue
				width={relativeElementWidths[2]}
				label={`${incToReachTarget[2].toFixed(2)} Vulnerable`}
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
			<div
				className='tooltip tooltip-bottom'
				data-tip='Calculated at 1.02x DPS per 5 iLevels'
			>
				<RelativeValue
					label={`${iLevelPerPercentInc.toFixed(2)} Item Levels`}
				/>
			</div>
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
