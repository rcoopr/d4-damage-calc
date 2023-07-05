'use client'

import { useHydrateAtoms } from 'jotai/utils'
import { Provider } from 'jotai'
import {
	buildStorageAtom,
	activeBuildNameAtom,
} from '@/lib/store/builds/builds'
import { keys, reservedBuildNames } from '@/lib/store/builds/constants'
import { emptyStorage } from '@/lib/store/builds/defaults'
import { getInitialBuilds } from '@/lib/store/builds/utils'

export function Hydrate({ decodedBuild }: { decodedBuild?: string }) {
	useHydrateAtoms([
		[
			buildStorageAtom,
			getInitialBuilds(keys.builds, {
				fallback: emptyStorage,
				decodedBuild,
			}),
		],
		[
			activeBuildNameAtom,
			decodedBuild ? reservedBuildNames.import : reservedBuildNames.default,
		],
	])

	return null
}

export function AtomProvider({ children }: { children: React.ReactNode }) {
	return <Provider>{children}</Provider>
}
