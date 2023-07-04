'use client'

import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { mapSourceToBuilds } from '@/lib/utils'
import { activeBuildAtom } from '@/lib/store/builds/builds'
import { DpsDesaturate, DpsFormat } from '@/components/text/heatmap'
import { computedStatsAtom, ComputedStats } from '@/lib/store/builds/computed'
import { StatSource, sources, BuildSource } from '@/lib/store/builds/schema'
import { isDefaultStats } from '@/lib/store/builds/utils'

const labels: Record<StatSource, string> = {
	char: 'Base DPS',
	item1: 'With Item 1:',
	item2: 'With Item 2:',
}

export function BuildSummary() {
	return (
		<div className='mb-12 flex flex-col gap-1 text-xl font-medium text-stone-400'>
			{sources.map((source) => (
				<DpsLine key={source} source={source} label={labels[source]} />
			))}
			<div className='flex items-center self-end'>
				<span className='pr-4 text-sm'>OVERALL DPS CHANGE: </span>
				<DpsDiff />
			</div>
		</div>
	)
}

function DpsDiff() {
	const build = useAtomValue(activeBuildAtom)
	const isItem2Empty = isDefaultStats('item2', build.item2)

	const computedStats = useAtomValue(computedStatsAtom)

	const diff = isItem2Empty
		? computedStats.comparison.build
		: 0 - computedStats.comparison.build

	return (
		<DpsDesaturate diff={diff}>
			<DpsFormat
				dps={diff}
				diff={diff}
				opts={{ asPercent: true, sign: true }}
				className='inline-block min-w-[6rem] text-right underline underline-offset-[5px]'
			/>
		</DpsDesaturate>
	)
}

function DpsLine({ label, source }: { label: string; source: StatSource }) {
	const activeBuild = useAtomValue(activeBuildAtom)
	const isUnused = isDefaultStats('item2', activeBuild[source])

	const computedStats = useAtomValue(computedStatsAtom)
	const build = mapSourceToBuilds[source]

	const buildDps = computedStats.dps[build]
	const diff = getDpsDiff(computedStats.comparison, source)

	const maxDps = Math.max(computedStats.dps.build1, computedStats.dps.build2)
	const width = (buildDps / maxDps) * 100

	return (
		<div
			className={clsx(
				'relative flex items-center transition-opacity',
				build !== 'char' && isUnused ? 'opacity-0' : 'opacity-100',
			)}
		>
			<div className='animate-in fade-in absolute inset-y-0 -right-2 left-0'>
				<div
					className={clsx(
						'absolute inset-0 rounded-r-lg bg-gradient-to-l to-60%',
						// 'after:absolute after:inset-0 after:pattern-diagonal-lines after:pattern-black after:pattern-bg-white after:pattern-size-4 after:pattern-opacity-50 after:mix-blend-multiply',
						source === 'char'
							? 'from-primary/20'
							: diff > 0
							? 'from-success/20'
							: 'from-error/20',
					)}
					style={{ width: `${width.toFixed(2)}%` }}
				/>
			</div>
			<h2 className='pr-8 md:pr-16 lg:pr-24'>{label}</h2>
			<DpsValue dps={buildDps} diff={diff} />
		</div>
	)
}

function DpsValue({ dps, diff }: { dps: number; diff: number }) {
	return (
		<div className='relative ml-auto flex items-end text-3xl'>
			<DpsFormat dps={dps} diff={diff} />
		</div>
	)
}

function getDpsDiff(
	comparison: ComputedStats['comparison'],
	source: StatSource | BuildSource,
) {
	switch (source) {
		case 'build1':
			return comparison.build
		case 'build2':
			return 0 - comparison.build
		case 'item1':
			return comparison.item
		case 'item2':
			return 0 - comparison.item
		default:
			return 0
	}
}
