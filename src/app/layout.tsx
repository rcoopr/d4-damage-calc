'use client'

import './globals.css'

import { DevTools } from 'jotai-devtools'

import { Space_Grotesk, Space_Mono } from 'next/font/google'

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
				<DevTools />
				{children}
			</body>
		</html>
	)
}
