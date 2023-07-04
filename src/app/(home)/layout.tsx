'use client'

import { Sidebar } from '@/components/sidebar/shared'
import { SidebarContent } from '@/components/sidebar/content'
import { SidebarHandle } from '@/components/sidebar/handle'

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<main className='flex flex-col items-center overflow-x-auto bg-stone-900 font-sans text-stone-300 selection:bg-primary/50'>
			<Sidebar.Checkbox />

			<div className='z-0 transition-transform duration-500 ease-out-quart peer-checked:-translate-x-20'>
				{children}
			</div>

			<Sidebar.Backdrop />
			<Sidebar.Drawer>
				<SidebarContent />
				<SidebarHandle />
			</Sidebar.Drawer>
		</main>
	)
}
