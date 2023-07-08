'use client'

import { DevTools as JotaiDevTools } from 'jotai-devtools'
import dynamic from 'next/dynamic'

const InternalDevTools = () => (
	<div className='fixed bottom-2.5 left-2.5 h-16 w-16'>
		<JotaiDevTools />
	</div>
)

export const DevTools = dynamic(
	() =>
		Promise.resolve(
			process.env.NODE_ENV === 'development' ? InternalDevTools : () => null,
		),
	{
		ssr: false,
	},
)
