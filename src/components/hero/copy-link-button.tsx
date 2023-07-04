import { useState, useRef, useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useExportBuild } from './use-export-build'

// const notifySuccess = () => toast.success("Build URL copied to clipboard!")
const notifyErrorInvalidBuild = () =>
	toast.error('Build could not be exported. Invalid build name')

export function CopyLinkButton() {
	const [open, setOpen] = useState(false)
	const timeout = useRef<number>()
	const exportBuild = useExportBuild()

	const onClick = useCallback(() => {
		setOpen(true)

		if (!exportBuild.success) {
			notifyErrorInvalidBuild()
			return
		}

		exportBuild.copy()

		if (timeout.current) {
			window.clearTimeout(timeout.current)
		}

		timeout.current = window.setTimeout(() => setOpen(false), 1800)
	}, [exportBuild])

	useEffect(() => {
		return () => {
			if (timeout.current) window.clearTimeout(timeout.current)
		}
	}, [])

	return (
		<div
			className='relative tooltip tooltip-top'
			data-tip='Click to Copy Link'
		>
			<div data-open={open} className='copy-tip-right copy-tip-scale'>
				<div data-open={open} className='copy-tip-rotate'>
					<div className='copy-tail-right'>Copied!</div>
				</div>
			</div>
			<button
				className='btn btn-neutral items-center md:btn-sm rounded tracking-wide font-normal capitalize'
				onClick={onClick}
			>
				<span>Share Comparison</span>
				<span className='text-base hidden sm:inline'>
					<ClipboardIcon />
				</span>
			</button>
		</div>
	)
}

function ClipboardIcon() {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='1.25em'
			height='1.25em'
			viewBox='0 0 24 24'
		>
			<path
				fill='currentColor'
				d='M17 9H7V7h10m0 6H7v-2h10m-3 6H7v-2h7M12 3a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m7 0h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z'
			/>
		</svg>
	)
}
