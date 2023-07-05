export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className='fixed inset-0 grid place-content-center bg-black'>
			<div className='w-[1200px] h-[630px]'>{children}</div>
		</div>
	)
}
