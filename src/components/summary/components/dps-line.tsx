import clsx from 'clsx'
import { DpsFormat } from '@/components/text/heatmap'
import { StatSource } from '@/lib/store/builds/schema'

export function DpsLine({
	hide,
	source,
	diff,
	buildDps,
	width,
	label,
}: {
	hide: boolean
	source: StatSource
	diff: number
	buildDps: number
	width: number
	label: string
}) {
	return (
		<div
			className={clsx(
				'relative flex items-center transition-opacity',
				hide ? 'opacity-0' : 'opacity-100',
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
