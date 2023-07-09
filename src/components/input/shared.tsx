'use client'

import clsx from 'clsx'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, ChangeEventHandler, useState } from 'react'
import { settingsAtom } from '@/lib/store/settings/settings'
import { activeBuildAtom } from '@/lib/store/builds/builds'
import { StatSource } from '@/lib/store/builds/schema'

type HTMLInputProps = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
>

export type InputExtraProps = {
	source: StatSource
	id: string
	className?: string
	error?: boolean
}

export function NumberInput({
	className,
	error,
	source,
	id,
	...inputProps
}: HTMLInputProps & InputExtraProps) {
	const { inputSize } = useAtomValue(settingsAtom)

	const setBuild = useSetAtom(activeBuildAtom)
	const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(ev) => setBuild({ [source]: { [id]: Number(ev.currentTarget.value) } }),
		[setBuild, source, id],
	)

	return (
		<input
			type='number'
			inputMode='decimal'
			min='0'
			onChange={onChange}
			id={`${source}-${id}`}
			{...inputProps}
			className={clsx(
				'border w-32 md:w-64 rounded-md block pl-8 placeholder-stone-400 text-stone-100 outline-none focus:ring-2',
				inputSize === 'small'
					? 'px-2 py-0.5'
					: inputSize === 'medium'
					? 'px-2.5 py-1.5'
					: 'px-3.5 py-2 text-lg',
				error
					? 'focus:ring-error focus:border-error border-error bg-error-content selection:bg-error/50'
					: 'focus:ring-primary focus:border-primary border-stone-600 bg-stone-700',
				className,
			)}
		/>
	)
}

export function SliderInput({
	className,
	error,
	source,
	id,
	...inputProps
}: HTMLInputProps & InputExtraProps) {
	const { inputSize } = useAtomValue(settingsAtom)

	const setBuild = useSetAtom(activeBuildAtom)
	const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(ev) => setBuild({ [source]: { [id]: Number(ev.currentTarget.value) } }),
		[setBuild, source, id],
	)

	return (
		<input
			type='range'
			min='0'
			onChange={onChange}
			id={`${source}-${id}`}
			{...inputProps}
			className={clsx(
				'w-full range mt-3 mb-1 block h-4 cursor-pointer appearance-none overflow-hidden bg-transparent rounded-full',
				inputSize === 'large' ? 'range-sm' : 'range-xs',
				error ? 'range-error' : 'range-primary',
				className,
			)}
		/>
	)
}

export function TextAsNumberInput({
	className,
	error,
	source,
	id,
	value,
	...inputProps
}: HTMLInputProps & InputExtraProps) {
	const { inputSize } = useAtomValue(settingsAtom)

	const [input, setInput] = useState((value ?? 0).toString())
	const setBuild = useSetAtom(activeBuildAtom)

	const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(ev) => {
			const string = ev.currentTarget.value || '0'

			const isRegexNum = string.match(/^([0-9]+([.,][0-9]*)?|[.,][0-9]+)$/)
			if (isRegexNum) {
				const inputMin = Number(inputProps.min ?? 0)
				const min = Number.isNaN(inputMin) ? 0 : inputMin

				const withoutLeadingZeroes = string.replace(/^(0+)([0-9])/, '$2')
				const withPeriods = withoutLeadingZeroes.replace(',', '.')
				const asNum = Number(withPeriods)

				const safeNum = Number.isNaN(asNum) ? 0 : Math.max(min, asNum)

				setInput(withoutLeadingZeroes)
				setBuild({ [source]: { [id]: safeNum } })
				console.log({
					withoutLeadingZeroes,
					set: { [source]: { [id]: safeNum } },
				})
			}
		},
		[setBuild, setInput, source, id, inputProps.min],
	)

	return (
		<input
			type='text'
			inputMode='decimal'
			min='0'
			id={`${source}-${id}`}
			{...inputProps}
			value={input}
			onChange={onChange}
			className={clsx(
				'border w-32 md:w-64 rounded-md block pl-8 placeholder-stone-400 text-stone-100 outline-none focus:ring-2',
				inputSize === 'small'
					? 'px-2 py-0.5'
					: inputSize === 'medium'
					? 'px-2.5 py-1.5'
					: 'px-3.5 py-2 text-lg',
				error
					? 'focus:ring-error focus:border-error border-error bg-error-content selection:bg-error/50'
					: 'focus:ring-primary focus:border-primary border-stone-600 bg-stone-700',
				className,
			)}
		/>
	)
}
