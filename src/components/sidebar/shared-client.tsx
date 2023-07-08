'use client'

import { atom, useSetAtom } from 'jotai'
import { useCallback, ChangeEventHandler } from 'react'

export const sidebarStateAtom = atom({ open: false })

export function SidebarCheckbox() {
	const setOpen = useSetAtom(sidebarStateAtom)

	const preventBodyScroll = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(ev) => {
			const checked = ev.currentTarget.checked
			setOpen({ open: checked })
			document.body.classList[checked ? 'add' : 'remove']('modal-open')
		},
		[setOpen],
	)

	return (
		<input
			onChange={preventBodyScroll}
			id='settings'
			type='checkbox'
			className='fixed h-0 w-0 appearance-none opacity-0 peer'
		/>
	)
}
