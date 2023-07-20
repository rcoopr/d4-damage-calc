'use client'

import { ChangeEventHandler, useCallback, useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import clsx from 'clsx'
import {
	Affix,
	CharClass,
	WeaponId,
	charClassData,
	isCharClass,
	isItem,
	weapons,
} from '@/components/items/affixes/data'
import { activeBuildAtom } from '@/lib/store/builds/builds'
import { DpsStats } from '@/lib/store/builds/schema'
import { formatDps } from '@/lib/format'

const charClasses = Object.entries(charClassData)

function appendAffixWithIncrease(
	affix: Affix,
	weapon: (typeof weapons)[WeaponId],
	charStats: DpsStats,
	efficiency = 1,
) {
	let increase = 0
	let affixRoll = 0

	const roll = affix.range[1]
	const slots = weapon.slots
	affixRoll = roll * slots * efficiency

	if (affix.bucket) {
		const bonus = affix.bucket.value(affixRoll)

		increase = getStatMultiplierComparison(
			affix.bucket.stat,
			charStats,
			bonus,
		)
	}

	const label =
		typeof affix.label === 'string' ? affix.label : affix.label(affixRoll)
	return { ...affix, label, increase }
}

export function ItemAffixes() {
	const [parent] = useAutoAnimate(/* optional config */)
	const [hiddenAffixes, setHiddenAffixes] = useState<string[]>([
		'Fundamental',
		'Guillotine',
		'Pinnacle',
	])
	const { char: charStats } = useAtomValue(activeBuildAtom)
	const [selectedClass, setSelectedClass] = useState<CharClass>('barb')
	const [itemId, setItemId] = useState<WeaponId>('axe')

	const onHideAffix = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(ev) => {
			const value = ev.currentTarget.value
			if (value) {
				setHiddenAffixes((affixes) => {
					const filtered = affixes.filter((aff) => aff !== value)
					console.log(affixes, filtered)
					if (filtered.length === affixes.length) {
						return [...affixes, value]
					} else {
						return filtered
					}
				})
			}
		},
		[setHiddenAffixes],
	)

	const onCharClassSelect = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(ev) => {
			if (isCharClass(ev.currentTarget.value))
				setSelectedClass(ev.currentTarget.value)
		},
		[setSelectedClass],
	)

	const onItemTypeSelect = useCallback<ChangeEventHandler<HTMLSelectElement>>(
		(ev) => {
			if (isItem(ev.currentTarget.value)) setItemId(ev.currentTarget.value)
		},
		[setItemId],
	)

	const weaponOptions = charClassData[selectedClass].items.weapons.kinds

	const selectedIndex = charClasses.findIndex(
		([charClass]) => charClass === selectedClass,
	)

	const weapon = weapons[itemId]

	const data = useMemo(() => {
		return charClassData[selectedClass].items.weapons.affixes
			.map((affix: Affix) => {
				return appendAffixWithIncrease(affix, weapon, charStats)
			})
			.sort((a, b) => b.increase - a.increase)
			.sort((a, b) =>
				hiddenAffixes.includes(a.name)
					? 1
					: hiddenAffixes.includes(b.name)
					? -1
					: 0,
			)
	}, [selectedClass, charStats, weapon, hiddenAffixes])

	const weaponInherentData = appendAffixWithIncrease(
		weapon.inherent.affix,
		weapon,
		charStats,
		weapon.inherent.efficiency,
	)

	return (
		<section className='mb-4 flex flex-col'>
			<div className='flex items-center justify-center gap-4 flex-wrap'>
				<div className='flex items-center relative'>
					{charClasses.map(([classId, charClass]) => (
						<div
							key={classId}
							className='p-2 flex flex-col justify-center'
						>
							<input
								id={`char-class-selection-${classId}`}
								name='char-class-selection'
								type='radio'
								value={classId}
								className='peer appearance-none fixed w-0 h-0'
								onChange={onCharClassSelect}
							/>
							<label
								htmlFor={`char-class-selection-${classId}`}
								className={clsx(
									'w-16 h-16 inline-grid place-content-center text-stone-400 peer-checked:text-primary hover:scale-105 transition-all hover:text-stone-100 cursor-pointer',
									// charClass.icon,
									'capitalize select-none',
								)}
							>
								{classId}
							</label>
						</div>
					))}
					<div
						className='absolute left-2 w-16 h-full top-0 border-b-[3px] rounded-md border-primary transition-transform'
						style={{
							transform: `translateX(calc(5rem * ${selectedIndex}))`,
						}}
					/>
				</div>

				<select
					id='affix-rank-item'
					className='select select-bordered grow'
					defaultValue={0}
					onChange={onItemTypeSelect}
				>
					<option disabled value={0}>
						Item type
					</option>
					{weaponOptions.map((weapon) => (
						<option key={weapon.id} value={weapon.id}>
							{weapon.label}
						</option>
					))}
				</select>
			</div>

			<div
				ref={parent}
				className='flex flex-col gap-0.5 [&>div:nth-child(-n+5)]:from-success/20 [&>div:nth-child(-n+5)]:text-success mt-2 h-96 overflow-y-auto scrollbar-thin relative'
			>
				<div className='flex items-center gap-2 mt-6 !bg-transparent !text-stone-300'>
					<input
						id='hide-inherent'
						value={weaponInherentData.name}
						type='checkbox'
						onChange={onHideAffix}
						checked={hiddenAffixes.includes(weaponInherentData.name)}
						className='peer appearance-none fixed h-0 w-0'
					/>
					<label
						htmlFor='hide-inherent'
						className='inline-block shrink-0 i-solar-eye-line-duotone w-8 cursor-pointer peer-checked:opacity-30'
					/>
					<div className='peer-checked:opacity-30'>
						<span>{weaponInherentData.label}</span>
						<span className='text-stone-500 italic pl-2 text-sm'>
							(Inherent)
						</span>
					</div>
					<div className='grow text-right font-mono pr-2 shrink-0 peer-checked:opacity-30'>
						+
						{formatDps(weaponInherentData.increase, {
							asPercent: true,
						})}
					</div>
				</div>
				{data.map((affix) => (
					<div
						key={affix.name}
						className='flex items-center bg-gradient-to-l py-0.5 gap-2 rounded'
					>
						<input
							id={`hide-affix-${affix.name}`}
							value={affix.name}
							type='checkbox'
							onChange={onHideAffix}
							checked={hiddenAffixes.includes(affix.name)}
							className='peer appearance-none fixed h-0 w-0'
						/>
						<label
							htmlFor={`hide-affix-${affix.name}`}
							className='inline-block shrink-0 i-solar-eye-line-duotone w-8 cursor-pointer peer-checked:opacity-30'
						/>
						<div className='peer-checked:opacity-30'>{affix.label}</div>
						<div className='grow text-right font-mono pr-2 shrink-0 peer-checked:opacity-30'>
							+
							{formatDps(affix.increase, {
								asPercent: true,
							})}
						</div>
					</div>
				))}
				<div className='sticky h-8 bg-gradient-to-t shrink-0 from-stone-900 bottom-0 w-full' />
			</div>
		</section>
	)
}
function getStatMultiplierComparison(
	bucket: keyof DpsStats,
	stats: DpsStats,
	bonus: number,
) {
	let bucketValueBefore = stats[bucket]
	let bucketValueAfter = stats[bucket] + bonus
	if (bucket === 'mainStat') {
		bucketValueBefore = stats.mainStat / 10
		bucketValueAfter = (stats[bucket] + bonus) / 10
	} else if (bucket === 'critChance') {
		bucketValueBefore =
			(stats.critDamage * Math.min(stats.critChance, 100)) / 100
		bucketValueAfter =
			(stats.critDamage * Math.min(stats.critChance + bonus, 100)) / 100
	} else if (bucket === 'critDamage') {
		bucketValueBefore =
			(stats.critDamage * Math.min(stats.critChance, 100)) / 100
		bucketValueAfter =
			((stats.critDamage + bonus) * Math.min(stats.critChance, 100)) / 100
	}

	const multiplierBefore = 1 + bucketValueBefore / 100
	const multiplierAfter = 1 + bucketValueAfter / 100

	return 100 * (multiplierAfter / multiplierBefore) - 100
}
