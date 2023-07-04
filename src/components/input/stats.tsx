'use client'

import clsx from 'clsx'
import { useAtom } from 'jotai'
import { useCallback, ChangeEventHandler } from 'react'
import { StatSource, Stats, stats } from '@/store/builds/schema'
import { activeBuildAtom } from '@/store/builds/builds'
import {
	InputExtraProps,
	NumberInput,
	SliderInput,
} from '@/components/input/shared'

type HTMLInputProps = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
>

type InputProps = {
	id: keyof Stats
	source: StatSource
	label: string
	kind: 'slider' | 'number'
	unit?: string
} & HTMLInputProps

type InputContainerProps = Pick<InputProps, 'id' | 'label' | 'source'> & {
	children: React.ReactNode
}

export function StatInput({ source }: { source: StatSource }) {
	return (
		<>
			{stats.map((stat) => {
				return (
					<InputContainer
						key={stat.id}
						id={stat.id}
						label={stat.label}
						source={source}
					>
						<StatsInput
							kind={stat.id === 'critChance' ? 'slider' : 'number'}
							source={source}
							{...stat}
							max={stat.id === 'critChance' ? 100 : undefined}
							step={stat.id === 'critChance' ? '0.1' : undefined}
						/>
					</InputContainer>
				)
			})}
		</>
	)
}

function InputContainer({ id, label, source, children }: InputContainerProps) {
	return (
		<div className='flex items-center justify-between gap-12'>
			<label
				htmlFor={`${source}-${id}`}
				className='font-medium leading-none'
			>
				{label}
			</label>
			{children}
		</div>
	)
}

function StatsInput({ id, source, unit, kind, ...inputProps }: InputProps) {
	const [build, setBuild] = useAtom(activeBuildAtom)
	const stats = build[source]
	const baseValue = build.char[id]
	const wornItem = build.wornItem

	const error = wornItem === source && baseValue < stats[id]
	const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(ev) => setBuild({ [source]: { [id]: Number(ev.currentTarget.value) } }),
		[setBuild, source, id],
	)

	return (
		<div
			className={clsx(
				'relative',
				kind === 'slider' && 'w-32 justify-between md:w-64',
			)}
		>
			{unit && kind === 'number' && (
				<div className='absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400'>
					{unit}
				</div>
			)}

			<NumberOrSliderInput
				kind={kind}
				id={`${source}-${id}`}
				error={error}
				onChange={onChange}
				value={stats[id].toString()}
				{...inputProps}
			/>

			{kind === 'slider' && (
				<div
					className={clsx(
						'flex items-center px-3',
						error ? 'text-error selection:bg-error/50' : 'text-stone-400',
					)}
				>
					{unit && <span>{unit}&ensp;</span>}
					<span className='font-mono'>{stats[id].toFixed(1)}</span>
				</div>
			)}
		</div>
	)
}

function NumberOrSliderInput({
	kind,
	...props
}: HTMLInputProps & InputExtraProps & Pick<InputProps, 'kind'>) {
	return kind === 'slider' ? (
		<SliderInput {...props} />
	) : (
		<NumberInput {...props} />
	)
}
