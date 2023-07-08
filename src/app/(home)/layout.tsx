import { Suspense } from 'react'
import { Sidebar } from '@/components/sidebar/shared'
import { SidebarContent } from '@/components/sidebar/content'
import { SidebarHandle } from '@/components/sidebar/handle'
import { SearchParamHider } from '@/components/utils/search-param-hider'

export const metadata = {
	twitter: {
		card: 'summary_large_image',
	},
}

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<main className='flex flex-col items-center bg-stone-900 font-sans text-stone-300 selection:bg-primary/50'>
			<Sidebar.Checkbox />

			<div className='z-0 transition-transform duration-500 ease-out-quart peer-checked:-translate-x-20 peer-checked:overflow-hidden'>
				{children}
			</div>

			<Sidebar.Backdrop />
			<Sidebar.Drawer>
				<SidebarContent />
				<SidebarHandle />
			</Sidebar.Drawer>

			<Suspense fallback={null}>
				<SearchParamHider />
			</Suspense>
		</main>
	)
}
