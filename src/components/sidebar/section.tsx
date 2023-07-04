'use client'

import { useState, useCallback } from 'react'

export function SidebarSection({
	id,
	title,
	children,
	startOpen,
}: {
	id?: string
	title: string
	children: React.ReactNode
	startOpen?: boolean
}) {
	const [open, setOpen] = useState(startOpen ?? false)
	const toggle = useCallback(() => setOpen((o) => !o), [setOpen])

	return (
		<>
			<section id={id} className='group' data-open={open}>
				<div
					role='button'
					onClick={toggle}
					className='-mx-3 my-1.5 flex items-center justify-between rounded-md px-3 py-1.5 text-lg hover:bg-stone-900'
				>
					<h3 className='font-bold uppercase tracking-widest text-stone-400'>
						{title}
					</h3>
					<div className='i-solar-alt-arrow-down-linear -rotate-90 transition-transform group-data-[open="true"]:rotate-0'></div>
				</div>
				<div className='-mx-1 auto-height group-data-[open="true"]:auto-height-open'>
					<div className='px-1'>{children}</div>
				</div>
			</section>
			<div className='divider my-0 last:hidden' />
		</>
	)
}
