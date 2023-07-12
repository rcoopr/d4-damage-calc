'use client'

import { MouseEventHandler, useCallback, useRef, useState } from 'react'
import { ItemAffixes } from '@/components/items/affixes/affixes'

export function ItemSuggestions() {
	const [open, setOpen] = useState(false)
	const ref = useRef<HTMLDialogElement>(null)

	const openModal = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
		setOpen(true)
		ref.current?.showModal()
	}, [ref, setOpen])
	const closeModal = useCallback<MouseEventHandler<HTMLDialogElement>>(() => {
		setOpen(false)
		ref.current?.close()
	}, [ref, setOpen])
	const stopPropagation = useCallback<MouseEventHandler>(
		(e) => e.stopPropagation(),
		[],
	)

	return (
		<div className='flex items-center'>
			<button
				className='btn md:btn-sm btn-secondary rounded tracking-wide font-medium capitalize'
				onClick={openModal}
			>
				Item Suggestions
			</button>
			<dialog ref={ref} className='modal backdrop-blur' onClick={closeModal}>
				<form
					method='dialog'
					className='modal-box border-2 border-secondary max-w-[75ch] px-16 leading-snug shadow-xl shadow-stone-950/25 text-stone-300'
					onClick={stopPropagation}
				>
					<div className='flex w-full justify-between mb-6 items-center'>
						<h2 className='font-bold text-2xl'>Item Suggestions</h2>
						{/* if there is a button in form, it will close the modal */}
						<button
							// This was picking up focus when tabbing while the modal was closed. This is a bit of a hack
							// Modal can still be closed with escape
							tabIndex={-1}
							className='btn rounded btn-neutral tracking-wide font-normal capitalize'
						>
							Close
						</button>
					</div>

					<h3 className='font-bold text-lg py-2 bg-stone-800 -mx-16 mb-2'>
						<span className='mx-10'>Item Affixes</span>
					</h3>
					{open && <ItemAffixes />}

					<h3 className='font-bold text-lg py-2 bg-stone-800 -mx-16 mb-2'>
						<span className='mx-10'>Disclaimer</span>
					</h3>
					<p className='mb-4'>
						This is based on your character stats and we assume full
						effectiveness of conditional damage boosts such as{' '}
						<span className='italic font-mono'>
							Damage to Crowd Controlled
						</span>
					</p>
					<p className='mb-4'>
						There are many variables which change the answer to the
						question{' '}
						<span className='text-info italic font-mono'>
							what stats give me the most damage
						</span>
						. This suggestion tries to give a generic answer that works
						great for most situations. Some skill interactions and builds
						may work better with different stats.
					</p>
				</form>
			</dialog>
		</div>
	)
}
