'use client'

import { MouseEventHandler, useCallback, useRef } from 'react'

export function UsageHint() {
	const ref = useRef<HTMLDialogElement>(null)

	const openModal = useCallback<MouseEventHandler<HTMLButtonElement>>(
		() => ref.current?.showModal(),
		[ref],
	)
	const closeModal = useCallback<MouseEventHandler<HTMLDialogElement>>(
		() => ref.current?.close(),
		[ref],
	)
	const stopPropagation = useCallback<MouseEventHandler>(
		(e) => e.stopPropagation(),
		[],
	)

	return (
		<div>
			<button
				className='btn md:btn-sm btn-secondary rounded tracking-wide font-medium capitalize'
				onClick={openModal}
			>
				How do I use this?
			</button>
			<dialog ref={ref} className='modal backdrop-blur' onClick={closeModal}>
				<form
					method='dialog'
					className='modal-box border-2 border-secondary max-w-[75ch] px-16 leading-snug shadow-xl shadow-stone-950/25 text-stone-300'
					onClick={stopPropagation}
				>
					<div className='flex w-full justify-between mb-6 items-center'>
						<h2 className='font-bold text-2xl'>Info</h2>
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
						<span className='mx-10'>Steps for comparing items</span>
					</h3>
					<ol className='list-decimal pl-8 mb-4 leading-relaxed'>
						<li>Equip all of your gear</li>
						<li>
							For weapons, use{' '}
							<span className='text-stone-100'>Weapon DPS</span> from the{' '}
							<span className='text-stone-100'>
								item tooltip in-game
							</span>
						</li>
						<li>
							Enter your{' '}
							<span className='text-info italic font-mono'>
								Character Stats
							</span>{' '}
							as you see in the stats tab in-game
						</li>
						<li>
							Add the stats of the item which you want to compare in{' '}
							<span className='text-info italic font-mono'>Item 1</span>
						</li>
						<li>
							Tick{' '}
							<span className='text-secondary italic font-mono'>
								Worn
							</span>{' '}
							on{' '}
							<span className='text-info italic font-mono'>Item 1</span>
						</li>
						<li>
							Add the new item stats in{' '}
							<span className='text-info italic font-mono'>Item 2</span>
						</li>
					</ol>
					<p className='mb-4'>
						If dual-wielding, Weapon DPS in the{' '}
						<span className='text-info italic font-mono'>
							Character Stats
						</span>{' '}
						panel should be the{' '}
						<span className='text-stone-100'>
							sum of both weapons (or divide your sheet damage by weapon
							speed)
						</span>
						, and individual Weapon DPS goes in each{' '}
						<span className='text-info italic font-mono'>Item</span>
					</p>
					<p className='mb-8'>
						Addititve means all of the damage stats from{' '}
						<span className='text-stone-100'>All Damage and below</span>{' '}
						in the in-game stats tab
					</p>

					<h3 className='font-bold text-lg py-2 bg-stone-800 -mx-16 mb-2'>
						<span className='mx-10'>Relative Stats info</span>
					</h3>
					<p className='mb-4'>
						The Relative Stats show how much each of each{' '}
						<span className='text-stone-100'>bucket</span> you would need
						for a 1% overall DPS increase. Each{' '}
						<span className='text-info italic font-mono'>
							Character / Item stat
						</span>{' '}
						is a <span className='text-stone-100'>bucket</span>
					</p>
					<p className='mb-4'>
						A <span className='text-stone-100'>bucket</span> is a
						collection of stats which, in the damage formula, are lumped
						together and contribute to each other{' '}
						<span className='text-stone-100'>additively</span>. Each{' '}
						<span className='text-stone-100'>bucket</span> is
						multiplicative with each other
					</p>
					<p className='mb-4'>
						The bars behind each{' '}
						<span className='text-stone-100'>bucket</span> show how much
						of your overall DPS is coming from that{' '}
						<span className='text-stone-100'>bucket</span>, relative to
						the others. This means you should{' '}
						<span className='text-primary italic font-mono'>
							prioristise the bucket with the smallest bars
						</span>{' '}
						to get the most dps out of your items
					</p>
					<p>
						If every <span className='text-stone-100'>bucket</span> was
						equally easy to get stats for, the highest DPS would come from
						balancing all <span className='text-stone-100'>buckets</span>
					</p>
				</form>
			</dialog>
		</div>
	)
}
