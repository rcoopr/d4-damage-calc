import copyTextToClipboard from 'copy-text-to-clipboard'
import { useAtomValue } from 'jotai'
import { activeBuildAtom, buildStorageAtom } from '@/lib/store/builds/builds'
import { keys } from '@/lib/store/constants'
import {
	StatSource,
	sources,
	Build,
	stats,
	DpsStats,
} from '@/lib/store/builds/schema'
import { isDefaultStats } from '@/lib/store/builds/utils'
import { isSSR } from '@/lib/utils'

export function useExportBuild(
	buildName?: string,
): { success: true; copy: () => void } | { success: false } {
	const activeBuild = useAtomValue(activeBuildAtom)
	const builds = useAtomValue(buildStorageAtom)

	if (isSSR() || (buildName && !(buildName in builds))) {
		return { success: false }
	}

	const build = buildName ? builds[buildName] : activeBuild

	const url = new URL(window.location.origin)

	const utilisedBuildParts = {} as Record<
		StatSource | 'wornItem',
		DpsStats | string
	>

	return {
		success: true,
		copy: () => {
			for (const source of sources) {
				const serializedStats = serializeStats(build, source)
				if (serializedStats) {
					url.searchParams.set(source, serializedStats)
					utilisedBuildParts[source] = build[source]
				}
			}

			if (build.wornItem) {
				url.searchParams.set(keys.wornItem, build.wornItem)
				utilisedBuildParts['wornItem'] = build.wornItem
			}

			console.group('export')
			console.table(utilisedBuildParts)
			console.groupEnd()

			const urlWithBuildPath = url.origin + '/' + url.searchParams.toString()

			copyTextToClipboard(urlWithBuildPath.toString())
		},
	}
}

function serializeStats(build: Build, source: StatSource) {
	const isUnused = isDefaultStats(source, build[source])

	return isUnused
		? ''
		: stats
				.map((stat) => formatForSearchParam(build[source][stat.id]))
				.join('-')
}

function formatForSearchParam(number: number) {
	return number.toFixed(2).replace(/[.,]00$/, '')
}
