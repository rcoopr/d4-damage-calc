'use client'

import { useCallback, ChangeEventHandler } from 'react'

export function SidebarCheckbox() {
  const preventBodyScroll = useCallback<ChangeEventHandler<HTMLInputElement>>((ev) => {
    const checked = ev.currentTarget.checked
    document.body.classList[checked ? "add" : "remove"]("modal-open")
  }, []) 

	return (
		<input
    onChange={preventBodyScroll}
			id='settings'
			type='checkbox'
			className='fixed h-0 w-0 appearance-none opacity-0 peer'
		/>
	)
}