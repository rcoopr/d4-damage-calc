import clsx from 'clsx'
import { SidebarCheckbox } from '@/components/sidebar/shared-client'

export const Sidebar = {
	Handle,
	Drawer,
	Checkbox: SidebarCheckbox,
	Backdrop,
	Toggle,
}

function Handle({
	className,
	children,
}: {
	className?: string
	children?: React.ReactNode
}) {
	return (
		<div className={clsx('fixed bottom-0 right-full top-0 w-16', className)}>
			{children}
		</div>
	)
}

function Drawer({ children }: { children?: React.ReactNode }) {
	return (
		<aside className='fixed bottom-0 right-0 top-0 w-80 translate-x-80 border-l border-stone-500 transition-transform duration-300 ease-out-quart peer-checked:translate-x-0'>
			{children}
		</aside>
	)
}

function Backdrop() {
	return (
		<label
			htmlFor='settings'
			className='fixed inset-0 hidden bg-stone-950/30 peer-checked:block'
		/>
	)
}

function Toggle({
	className,
	children,
}: {
	className?: string
	children: React.ReactNode
}) {
	return (
		<label
			htmlFor='settings'
			className={clsx(
				'relative z-10 cursor-pointer text-stone-500 hover:text-stone-300',
				className,
			)}
		>
			{children}
		</label>
	)
}
