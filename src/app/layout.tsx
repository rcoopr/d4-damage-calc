'use client'

import './globals.css'

import { Space_Grotesk, Space_Mono } from 'next/font/google'
import { ToastOptions, Toaster } from 'react-hot-toast'
import { DevTools } from '@/components/devtools'

type FullToastOptions = ToastOptions &
	Partial<Record<'success' | 'error' | 'loading' | 'custom', ToastOptions>>

const toastOptions: FullToastOptions = {
	className: 'px-8',
	success: {
		className: 'py-8',
	},
}

const spaceGrotesk = Space_Grotesk({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-space-grotesk',
})

const spaceMono = Space_Mono({
	subsets: ['latin'],
	display: 'swap',
	weight: ['400', '700'],
	style: ['normal', 'italic'],
	variable: '--font-space-mono',
})

export const metadata = {
	title: 'D4 Calc',
	description: 'Diablo 4 Item Comparison & Dps Evaluation Tool',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html
			lang='en'
			className={`${spaceGrotesk.variable} ${spaceMono.variable}`}
		>
			<body>
				{children}
				<Toaster
					position='bottom-left'
					reverseOrder={false}
					gutter={8}
					toastOptions={toastOptions}
				/>
				<div className='fixed bottom-2.5 left-2.5 h-16 w-16'>
					<DevTools />
				</div>
			</body>
		</html>
	)
}
