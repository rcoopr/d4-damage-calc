'use client'

import { useAtomValue } from 'jotai'
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
	const hasImport = buildNames.includes(reservedBuildNames.import)
	const builds = [
		reservedBuildNames.default,
		hasImport ? reservedBuildNames.import : undefined,
		...customBuilds,
	].filter(Boolean) as string[]

	return (
		<ul className='mb-4 flex flex-col'>
			{builds.map((name) => (
				<li key={name}>
					<BuildNameInputForm name={name} />
				</li>
			))}
		</ul>
	)
}
