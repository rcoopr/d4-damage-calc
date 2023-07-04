import clsx from 'clsx'

type HTMLInputProps = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
>

export type InputExtraProps = { className?: string; error?: boolean }

export function NumberInput({
	className,
	error,
	...inputProps
}: HTMLInputProps & InputExtraProps) {
	return (
		<input
			type='number'
			inputMode='decimal'
			min='0'
			{...inputProps}
			className={clsx(
				'border w-32 md:w-64 rounded-md block px-2.5 py-1.5 pl-8 placeholder-stone-400 text-stone-100 outline-none focus:ring-2',
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
	...inputProps
}: HTMLInputProps & InputExtraProps) {
	return (
		<input
			type='range'
			min='0'
			{...inputProps}
			className={clsx(
				'w-full range range-xs mt-3 mb-1 block h-4 cursor-pointer appearance-none overflow-hidden bg-transparent rounded-full',
				error ? 'range-error' : 'range-primary',
				className,
			)}
		/>
	)
}
