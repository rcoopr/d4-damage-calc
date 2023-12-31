'use client'

import { CopyLinkButton } from '@/components/hero/copy-link-button'
import { UsageHint } from '@/components/hero/usage-hint'

export function Hero() {
	return (
		<>
			<div className='mt-12 mb-2 text-stone-300 flex items-center'>
				<h1 className='text-3xl font-bold'>Diablo 4 Damage Calculator</h1>
			</div>
			<div className='flex my-4 gap-6 md:gap-24 mb-8'>
				<UsageHint />
				<CopyLinkButton />
			</div>
		</>
	)
}
