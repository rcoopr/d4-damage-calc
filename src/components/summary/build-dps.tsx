'use client'

import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { mapSourceToBuilds } from '@/lib/utils'
import { activeBuildAtom } from '@/lib/store/builds/builds'
import { DpsDesaturate, DpsFormat } from '@/components/text/heatmap'
import { computedStatsAtom } from '@/lib/store/builds/computed/atom'
import { StatSource, sources } from '@/lib/store/builds/schema'
import { getDpsDiff, isDefaultStats } from '@/lib/store/builds/utils'
import { DpsLine } from '@/components/summary/components/dps-line'

const labels: Record<StatSource, string> = {
	char: 'Base DPS',
	item1: 'With Item 1:',
	item2: 'With Item 2:',
}

export function BuildSummary() {
	return (
		<div className='mb-12 flex flex-col gap-1 text-xl font-medium text-stone-400'>
			{sources.map((source) => (
				<DpsLineBuilder
					key={source}
					source={source}
					label={labels[source]}
				/>
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

function DpsLineBuilder({
	label,
	source,
}: {
	label: string
	source: StatSource
}) {
	const [width, setWidth] = useState(100)

	const activeBuild = useAtomValue(activeBuildAtom)
	const isUnused = isDefaultStats('item2', activeBuild[source])

	const computedStats = useAtomValue(computedStatsAtom)
	const build = mapSourceToBuilds[source]

	const buildDps = computedStats.dps[build]
	const diff = getDpsDiff(computedStats.comparison, source)

	const maxDps = Math.max(computedStats.dps.build1, computedStats.dps.build2)
	const widthPercent = (buildDps / maxDps) * 100

	useEffect(() => {
		setWidth(widthPercent)
	}, [widthPercent, setWidth])

	return (
		<DpsLine
			hide={build !== 'char' && isUnused}
			source={source}
			diff={diff}
			buildDps={buildDps}
			width={width}
			label={label}
		/>
	)
}
