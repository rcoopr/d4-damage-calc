'use client'

import { useAtomValue } from 'jotai'
import clsx from 'clsx'
import { buildNamesAtom } from '@/lib/store/builds/builds'
import { BuildNameInputForm } from '@/components/sidebar/builds/forms/edit'
import { reservedBuildNames } from '@/lib/store/builds/constants'

export function BuildList() {
	const buildNames = useAtomValue(buildNamesAtom)
	const customBuilds = buildNames.filter(
		(name) =>
			name !== reservedBuildNames.default &&
			name !== reservedBuildNames.import,
	)

	return (
		<ul className='mb-4 flex flex-col'>
			{buildNames.includes(reservedBuildNames.default) && (
				<li>
					<BuildNameInputForm name={reservedBuildNames.default} />
				</li>
			)}
			{buildNames.includes(reservedBuildNames.import) && (
				<li>
					<BuildNameInputForm name={reservedBuildNames.import} />
				</li>
			)}
			{customBuilds.map((name) => (
				<li
					key={name}
					className={clsx(
						name === reservedBuildNames.default
							? '-order-2'
							: name === reservedBuildNames.import && '-order-1',
					)}
				>
					<BuildNameInputForm name={name} />
				</li>
			))}
		</ul>
	)
}
