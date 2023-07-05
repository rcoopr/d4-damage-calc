import { formatDps } from '@/lib/format'
import { computeStats } from '@/lib/store/builds/computed/calculate'
import {
	Build,
	sources,
	DpsStats,
	stats as allStats,
	StatSource,
} from '@/lib/store/builds/schema'
import { isDefaultStats } from '@/lib/store/builds/utils'
import { mapSourceToBuilds } from '@/lib/utils'

const labels: Record<StatSource, string> = {
	char: 'Base',
	item1: '+Item 1',
	item2: '+Item 2',
}

export function OpengraphComparison({ build }: { build: Build }) {
	const computedStats = computeStats(build)

	const maxDps = Math.max(computedStats.dps.build1, computedStats.dps.build2)
	const mostDps =
		computedStats.dps.build1 > computedStats.dps.build2 ? 'item1' : 'item2'

	const isItem1Unused = isDefaultStats('item1', build.item1)
	const isItem2Unused = isDefaultStats('item2', build.item2)

	return (
		<div
			style={{
				background: 'linear-gradient(to bottom right, #1c1917, #0c0a09)',
			}}
			tw='flex flex-col justify-between text-6xl p-16 w-full h-full'
		>
			<div tw='flex h-full justify-between'>
				<div tw='grow flex flex-col justify-between'>
					{!isItem1Unused && (
						<ItemSummary label='Item 1' stats={build.item1} />
					)}
					{!isItem1Unused && !isItem2Unused && (
						<div tw='h-0.5 my-4 mx-16 bg-white/10 flex justify-center' />
					)}
					{!isItem2Unused && (
						<ItemSummary label='Item 2' stats={build.item2} />
					)}
				</div>

				<div
					style={{
						width: '0.125rem',
					}}
					tw='bg-white mx-6 my-16 opacity-10'
				/>

				<div tw='flex flex-col justify-between'>
					<div
						style={{ fontFamily: 'Space Mono' }}
						tw='italic text-stone-400 !font-mono text-right flex justify-end'
					>
						D4Calc.info
					</div>

					<div tw='flex flex-col'>
						{sources.map((source) => {
							const buildKind = mapSourceToBuilds[source]
							const widthPercent =
								(computedStats.dps[buildKind] / maxDps) * 100
							const isUnused =
								source !== 'char' &&
								isDefaultStats(source, build[source])

							return isUnused ? null : (
								<DpsLine
									key={source}
									label={labels[source]}
									dps={computedStats.dps[buildKind]}
									percentIncrease={
										buildKind === 'char'
											? 0
											: computedStats.increase[buildKind]
									}
									change={
										source === 'char'
											? '0'
											: mostDps === source
											? '+'
											: '-'
									}
									width={widthPercent}
								/>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}

function ItemSummary({ label, stats }: { label: string; stats: DpsStats }) {
	return (
		<div tw='flex flex-col grow overflow-hidden min-h-[8rem]'>
			<div tw='mb-4 text-orange-500'>{label}</div>
			<div tw='flex flex-col text-4xl text-stone-400'>
				{allStats.map(
					(stat) =>
						stats[stat.id] !== 0 && (
							<div
								key={stat.id}
								style={{ gap: '3rem' }}
								tw='flex justify-between'
							>
								<div tw='flex'>{stat.label}</div>
								<div
									style={{ fontFamily: 'Space Mono' }}
									tw='flex !font-mono'
								>
									{stats[stat.id]}
								</div>
							</div>
						),
				)}
			</div>
		</div>
	)
}

function DpsLine({
	label,
	dps,
	percentIncrease,
	width,
	change,
}: {
	label: string
	dps: number
	percentIncrease: number
	width: number
	change: '+' | '-' | '0'
}) {
	return (
		<div tw='w-full grow relative flex justify-between py-2 mb-3'>
			<div tw='text-stone-400 flex items-center text-5xl pr-16'>{label}</div>
			<div
				style={{
					fontFamily: 'Space Mono',
					color:
						change === '0'
							? '#d6d3d1'
							: change === '+'
							? '#34d399'
							: '#fb7185',
				}}
				tw='flex flex-col items-end !font-mono pr-8'
			>
				<div>{formatDps(dps, { compact: false })}</div>
				{percentIncrease !== 0 && (
					<div style={{ fontSize: '0.7em' }}>
						{formatDps(percentIncrease, {
							compact: false,
							asPercent: true,
							sign: true,
						})}
					</div>
				)}
			</div>
			<div
				style={{
					background: `linear-gradient(to left, ${
						change === '0'
							? '#a8a29e'
							: change === '+'
							? '#34d399'
							: '#fb7185'
					}, ${
						change === '0'
							? '#a8a29e00'
							: change === '+'
							? '#34d39900'
							: '#fb718500'
					} 60%)`,
					width: `${width.toFixed(2)}%`,
				}}
				tw='absolute top-0 left-0 right-0 bottom-0 rounded-2xl opacity-20'
			/>
		</div>
	)
}
