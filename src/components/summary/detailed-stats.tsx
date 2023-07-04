'use client'

import { useAtomValue } from 'jotai'
import { DpsColor } from '@/components/text/heatmap'
import { formatDps } from '@/lib/format'
import { mapSourceToBuilds } from '@/lib/utils'
import { computedStatsAtom } from '@/store/builds/computed'
import { StatSource, stats } from '@/store/builds/schema'

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
		<div className='rounded-lg border-stone-700 border flex flex-col overflow-hidden'>
			<Heading item={item} />
			<Stats source={source} />
			<Footer source={source} item={item} />
		</div>
	)
}

function Heading({ item }: { item?: number }) {
	const header = item ? `Stats with Item ${item}` : 'Stats without items'

	return <div className='px-4 py-2 font-bold'>{header}</div>
}

function Stats({ source }: { source: StatSource }) {
	const computedStats = useAtomValue(computedStatsAtom)

	return stats.map((stat) => {
		const statValue = computedStats.statsTotal[source][stat.id]
		const statDisplay =
			stat.id === 'critChance'
				? statValue.toFixed(1)
				: formatDps(statValue, { compact: true })

		return (
			<div
				key={stat.id}
				className='border-t px-4 py-1 gap-8 flex items-center justify-between border-stone-700 bg-stone-800 text-stone-400'
			>
				<div>{stat.label}</div>
				<div className='font-mono min-w-[4rem] shrink-0 text-right'>
					{statDisplay}
				</div>
			</div>
		)
	})
}

function Footer({ source, item }: { source: StatSource; item: 0 | 1 | 2 }) {
	const computedStats = useAtomValue(computedStatsAtom)
	const build = mapSourceToBuilds[source]

	return (
		<>
			<div className='flex items-center justify-between px-4 py-2 border-t border-stone-700'>
				<div className='font-bold'>DPS</div>
				<div>{formatDps(computedStats.dps[build])}</div>
			</div>
			{item === 0 ? null : <BuildDiff item={item} />}
		</>
	)
}

function BuildDiff({ item }: { item: 1 | 2 }) {
	const computedStats = useAtomValue(computedStatsAtom)
	const diff = computedStats.increase[`build${item}`]

	return (
		<div className='flex items-center justify-end px-4 -mt-2 mb-2'>
			<DpsColor diff={diff}>
				{formatDps(diff, { asPercent: true, compact: true })}
			</DpsColor>
		</div>
	)
}
