import clsx from 'clsx'
import { DpsFormatOptions, formatDps } from '@/lib/format'
import { clamp } from '@/lib/utils'

export const MAX_SATURATION = 3
export const MAX_SATURATION_AT = 10

type Options = {
	dps: number
	diff: number
	opts?: DpsFormatOptions
	className?: string
	clamp?: boolean
	children: React.ReactNode
}

export function DpsDesaturate({
	diff,
	clamp: clamped,
	children,
}: Pick<Options, 'diff' | 'clamp' | 'children'>) {
	const value = clamped ? diff : Math.abs(diff)
	const remappedValue = (value * MAX_SATURATION) / MAX_SATURATION_AT
	const saturation = clamp(remappedValue, 0, MAX_SATURATION)

	return (
		<span style={{ filter: `saturate(${saturation.toFixed(2)})` }}>
			{children}
		</span>
	)
}

export function DpsColor({
	diff,
	className,
	children,
}: Pick<Options, 'diff' | 'className' | 'children'>) {
	return (
		<span
			className={clsx(
				'transition-opacity font-mono',
				diff === 0
					? 'text-primary'
					: diff > 0
					? 'font-bold text-success'
					: 'font-extralight text-error opacity-80',
				className,
			)}
		>
			{children}
		</span>
	)
}

export function DpsFormat({
	dps,
	diff,
	opts,
	className,
}: Omit<Options, 'children'>) {
	return (
		<DpsColor diff={diff} className={className}>
			{formatDps(dps, opts)}
		</DpsColor>
	)
}
