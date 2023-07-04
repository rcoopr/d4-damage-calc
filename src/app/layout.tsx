'use client'

import './globals.css'

import { DevTools } from 'jotai-devtools'

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
		<html lang='en'>
			<body>
				<DevTools />
				{children}
			</body>
		</html>
	)
}
