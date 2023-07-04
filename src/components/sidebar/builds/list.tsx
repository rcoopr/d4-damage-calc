'use client'

import { useAtomValue } from 'jotai'
import { buildNamesAtom } from '@/store/builds/builds'
import { BuildNameInputForm } from '@/components/sidebar/builds/forms/rename'

export function BuildList() {
	const names = useAtomValue(buildNamesAtom)

	return (
		<ul className='mb-4 flex flex-col'>
			{names.map((name) => (
				<li key={name}>
					<BuildNameInputForm name={name} />
				</li>
			))}
		</ul>
	)
}
