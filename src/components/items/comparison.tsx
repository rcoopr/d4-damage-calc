'use client'

import clsx from 'clsx'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback, ChangeEventHandler } from 'react'
import { DpsFormat, DpsDesaturate } from '@/components/text/heatmap'
import { activeBuildAtom } from '@/lib/store/builds/builds'
import { computedStatsAtom } from '@/lib/store/builds/computed'
import { ItemSource } from '@/lib/store/builds/schema'
import { isDefaultStats } from '@/lib/store/builds/utils'

export function ItemComparison({ item }: { item: ItemSource }) {
	const [build, setBuild] = useAtom(activeBuildAtom)
	const isUnused = isDefaultStats(item, build[item])

	const handleClick = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(ev) => {
			setBuild({ wornItem: ev.currentTarget.checked && item ? item : null })
		},
		[setBuild, item],
	)

	const computedStats = useAtomValue(computedStatsAtom)

	const label = `Item ${item.charAt(item.length - 1)}`
	const itemDps = computedStats.dps[item]
	const compareWith = computedStats.dps[item === 'item1' ? 'item2' : 'item1']

	const hide = build.wornItem === item ? false : isUnused

	const dpsDiff =
		item === 'item1'
			? computedStats.comparison.item
			: 0 - computedStats.comparison.item

	return (
		<div className='flex flex-col'>
			<div className='flex items-end text-lg font-medium text-stone-400 transition-opacity'>
				<h2 className='pr-8 md:pr-16 lg:pr-24'>{label}</h2>
				<div
					aria-hidden={hide}
					className='flex h-full items-center gap-3 opacity-100 transition-opacity aria-hidden:select-none aria-hidden:opacity-0'
				>
					<span className='text-sm text-stone-400'>Worn?</span>
					<input
						id={`worn-${item}`}
						checked={build.wornItem === item}
						disabled={hide}
						onChange={handleClick}
						className='checkbox checkbox-sm rounded disabled:cursor-default'
						type='checkbox'
					/>
				</div>
				<div
					aria-hidden={hide}
					className='relative ml-auto flex items-end text-xl opacity-100 transition-opacity aria-hidden:select-none aria-hidden:opacity-0'
				>
					<DpsFormat dps={itemDps} diff={itemDps - compareWith} />
					<div
						className={clsx(
							'pl-2 text-sm transition-opacity',
							'absolute flex items-center',
							'bottom-full right-0',
							compareWith && itemDps > compareWith
								? 'opacity-100'
								: 'opacity-0',
						)}
					>
						<DpsDesaturate diff={dpsDiff}>
							<DpsFormat
								dps={dpsDiff}
								diff={dpsDiff}
								className='underline underline-offset-[3px]'
								opts={{ sign: true, asPercent: true }}
							/>
						</DpsDesaturate>
					</div>
				</div>
			</div>
		</div>
	)
}
