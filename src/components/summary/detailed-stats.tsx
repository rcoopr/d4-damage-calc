'use client'

import { useAtomValue } from 'jotai'
import clsx from 'clsx'
import { DpsColor } from '@/components/text/heatmap'
import { formatDps } from '@/lib/format'
import { mapSourceToBuilds } from '@/lib/utils'
import { StatSource, stats } from '@/lib/store/builds/schema'
import { computedStatsAtom } from '@/lib/store/builds/computed/atom'

export function DetailedStatsSummary() {
	return (
		<div className='flex flex-col flex-wrap items-center justify-center gap-4 md:flex-row md:items-start'>
			<BuildSummary source='char' />
			<BuildSummary source='item1' />
			<BuildSummary source='item2' />
		</div>
	)
}

function BuildSummary({ source }: { source: StatSource }) {
	const item =
		source === 'char'
			? 0
			: (Number(source.charAt(source.length - 1)) as 0 | 1 | 2)

	return (
		<div className='flex flex-col overflow-hidden rounded-lg border border-stone-700'>
			<Heading item={item} />
			<Stats source={source} />
			<Footer source={source} item={item} />
		</div>
	)
}

function Heading({ item }: { item?: number }) {
	const header = item ? `Stats with Item ${item}` : 'Stats without items'

	return (
		<div className='px-4 py-2 font-bold flex items-center justify-between'>
			<div className=''>{header}</div>
			<div className='text-xs uppercase'>Multiplier</div>
		</div>
	)
}

function Stats({ source }: { source: StatSource }) {
	const computedStats = useAtomValue(computedStatsAtom)
	const build = mapSourceToBuilds[source]

	return stats.map((stat, i) => {
		const statValue = computedStats.statsTotal[source][stat.id]
		const statDisplay =
			stat.id === 'critChance'
				? statValue.toFixed(1)
				: formatDps(statValue, { compact: true })

		return (
			<div
				key={stat.id}
				className='flex items-center justify-between gap-4 border-t border-stone-700 bg-stone-800 px-4 py-1 text-stone-400'
			>
				<div className='w-[13ch]'>{stat.label}</div>
				<div className='min-w-[4rem] shrink-0 text-right font-mono'>
					{statDisplay}
				</div>
				<div
					className={clsx(
						'w-12 flex justify-end',
						i === stats.length - 2 && 'translate-y-4',
					)}
				>
					<div className='-mx-2 px-2 bg-stone-800'>
						{i === 0 || i === stats.length - 1
							? ''
							: `${formatDps(computedStats.multipliers[build][i - 1], {
									compact: true,
							  })}x`}
					</div>
				</div>
			</div>
		)
	})
}

function Footer({ source, item }: { source: StatSource; item: 0 | 1 | 2 }) {
	const computedStats = useAtomValue(computedStatsAtom)
	const build = mapSourceToBuilds[source]
	const totalMult = computedStats.multipliers[build].reduce(
		(total, mult) => total * mult,
		1,
	)

	return (
		<>
			<div className='flex items-center justify-between border-t border-stone-700 px-4 py-2 gap-4'>
				<div className='font-bold grow'>DPS</div>
				<div>{formatDps(computedStats.dps[build])}</div>
				<div className='w-12 text-right'>
					{formatDps(totalMult, { compact: true })}x
				</div>
			</div>
			{item === 0 ? null : <BuildDiff item={item} />}
		</>
	)
}

function BuildDiff({ item }: { item: 1 | 2 }) {
	const computedStats = useAtomValue(computedStatsAtom)
	const diff = computedStats.increase[`build${item}`]

	return (
		<div className='-mt-2 mb-2 flex items-center justify-end px-4'>
			<DpsColor diff={diff}>
				{formatDps(diff, { asPercent: true, compact: true })}
			</DpsColor>
		</div>
	)
}
