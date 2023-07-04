'use client'

import clsx from 'clsx'
import { useAtomValue, useAtom } from 'jotai'
import { useCallback, MouseEventHandler } from 'react'
import { buildNamesAtom, activeBuildNameAtom } from '@/lib/store/builds/builds'

export function BuildsQuickAccess() {
	const buildNames = useAtomValue(buildNamesAtom)
	const [activeBuild, setActiveBuild] = useAtom(activeBuildNameAtom)

	const onBuildIconClick = useCallback<MouseEventHandler<HTMLElement>>(
		(ev) => {
			if (ev.currentTarget.dataset.build)
				setActiveBuild(ev.currentTarget.dataset.build)
		},
		[setActiveBuild],
	)

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
	}, [])

	return (
		<div className='flex flex-col items-center gap-2'>
			<h4 className='my-2 text-sm font-bold writing-vertical-rl orientation-upright'>
				BUILDS
			</h4>
			{buildNames.map((name) => (
				<div className='tooltip tooltip-left' key={name} data-tip={name}>
					<button
						data-build={name}
						onClick={onBuildIconClick}
						className='btn-ghost btn-square btn-sm btn grid place-content-center rounded-md p-2 hover:scale-110 hover:text-stone-300'
					>
						<div
							className={clsx(
								'grid h-8 w-8 place-content-center rounded border-2 border-current font-bold',
								name === activeBuild && 'text-primary',
							)}
						>
							{name.charAt(0)}
						</div>
					</button>
				</div>
			))}
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
