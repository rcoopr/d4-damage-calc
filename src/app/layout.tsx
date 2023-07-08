import './globals.css'

import { Space_Grotesk, Space_Mono } from 'next/font/google'
import { ToastOptions, Toaster } from 'react-hot-toast'
import { DevTools } from '@/components/utils/devtools'
import { AtomProvider } from '@/components/utils/atoms'

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
	display: 'auto',
	variable: '--font-space-grotesk',
})

const spaceMono = Space_Mono({
	subsets: ['latin'],
	display: 'auto',
	weight: ['400', '700'],
	style: ['normal', 'italic'],
	variable: '--font-space-mono',
})

export const metadata = {
	// metadataBase: new URL('http://d4calc.info'),
	alternates: {
		canonical: '/',
	},
	title: 'D4 Calc',
	description: 'Diablo 4 Item Comparison & Dps Evaluation Tool',
	themeColor: '#f97316',
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
				<AtomProvider>
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
				</AtomProvider>
			</body>
		</html>
	)
}
