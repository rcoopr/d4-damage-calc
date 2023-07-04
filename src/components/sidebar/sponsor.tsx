import clsx from 'clsx'

export function Sponsor() {
	return (
		<div
			className={clsx(
				'bg-gradient-to-t from-secondary/20 to-secondary/5',
				'relative flex cursor-pointer justify-end rounded-md text-stone-300 ring-secondary hover:text-secondary hover:ring-2',
				'after:absolute after:inset-0 after:rounded-md after:border-t-2 after:border-secondary/30',
				'before:absolute before:inset-0 before:rounded-md before:border-b-2 before:border-stone-950/50',
			)}
		>
			<a
				className='relative z-10 flex w-full items-center justify-center py-4 text-center font-semibold ring-secondary'
				href='https://www.buymeacoffee.com/rcoopr'
			>
				<span>Support my work</span>
				<span className='i-solar-tea-cup-bold-duotone mb-1 ml-2 inline-block' />
			</a>
		</div>
	)
}
