'use client'

import { useAtomValue, useAtom, useSetAtom } from 'jotai'
import { useCallback, MouseEventHandler, useEffect, useState } from 'react'
import { buildNamesAtom, activeBuildNameAtom } from '@/lib/store/builds/builds'
import { reservedBuildNames } from '@/lib/store/builds/constants'
import { sidebarStateAtom } from '@/components/sidebar/shared-client'

export function BuildsQuickAccess() {
	const buildNames = useAtomValue(buildNamesAtom)
	const setSidebarState = useSetAtom(sidebarStateAtom)

	const onNewBuildClick = useCallback<MouseEventHandler<HTMLElement>>(() => {
		// TOOD: do this in a more reacty-way?
		const sidebarCheckbox =
			document.querySelector<HTMLInputElement>('input#settings')
		const buildNameInput = document.querySelector<HTMLInputElement>(
			'input#save-build-name',
		)
		const buildSettingsSection =
			document.querySelector<HTMLElement>('#settings-builds')

		if (sidebarCheckbox) sidebarCheckbox.checked = true
		if (buildSettingsSection) buildSettingsSection.dataset.open = 'true'
		if (buildNameInput) buildNameInput.focus()
		setSidebarState({ open: true })
	}, [setSidebarState])

	const customBuilds = buildNames.filter(
		(name) =>
			name !== reservedBuildNames.default &&
			name !== reservedBuildNames.import,
	)

	return (
		<div className='flex flex-col items-center gap-2 px-2'>
			<h4 className='-order-3 my-2 text-sm font-bold writing-vertical-rl orientation-upright'>
				BUILDS
			</h4>
			{buildNames.includes(reservedBuildNames.default) && (
				<BuildButton name={reservedBuildNames.default} />
			)}
			{buildNames.includes(reservedBuildNames.import) && (
				<BuildButton name={reservedBuildNames.import} />
			)}
			{customBuilds.length > 0 && <div className='divider mx-2 my-0' />}
			{customBuilds.map((name) => (
				<BuildButton key={name} name={name} />
			))}
			<div className='divider mx-2 my-0' />
			<div
				onClick={onNewBuildClick}
				className='btn-ghost btn-square btn-sm btn grid place-content-center rounded-md p-2 hover:scale-110 hover:text-stone-300'
			>
				<div className='grid h-8 w-8 place-content-center rounded border-2 border-current font-bold'>
					+
				</div>
			</div>
		</div>
	)
}

function BuildButton({ name }: { name: string }) {
	const [activeBuild, setActiveBuild] = useAtom(activeBuildNameAtom)

	const onClick = useCallback<MouseEventHandler<HTMLElement>>(
		(ev) => {
			if (ev.currentTarget.dataset.build)
				setActiveBuild(ev.currentTarget.dataset.build)
		},
		[setActiveBuild],
	)

	const [hasMounted, setHasMounted] = useState(false)

	useEffect(() => {
		setHasMounted(true)
	}, [])

	if (!hasMounted) {
		return null
	}

	const words = name.split(' ')
	const initials =
		words.length > 1
			? `${words[0].charAt(0)}${words[1].charAt(0)}`
			: name.charAt(0)

	return (
		<div>
			{/* <div className='tooltip tooltip-left' data-tip={name} >  */}
			<button
				data-build={name}
				data-active={name === activeBuild}
				onClick={onClick}
				className='btn-ghost btn-square btn-sm btn grid place-content-center rounded-md p-2 hover:scale-110 hover:text-stone-300 data-[active="true"]:text-primary'
			>
				<div className='grid h-8 w-8 place-content-center rounded border-2 border-current font-bold'>
					{name === reservedBuildNames.import ? (
						<span className='h-6 w-6 inline-block i-solar-import-linear' />
					) : (
						<span>{initials}</span>
					)}
				</div>
			</button>
		</div>
	)
}
