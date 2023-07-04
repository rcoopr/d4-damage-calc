import copyTextToClipboard from 'copy-text-to-clipboard'
import { useAtomValue } from 'jotai'
import { activeBuildAtom, buildStorageAtom } from '@/store/builds/builds'
import { keys } from '@/store/builds/constants'
import { Build, StatSource, Stats, sources, stats } from '@/store/builds/schema'
import { isDefaultStats } from '@/store/builds/utils'

export function useExportBuild(
	buildName?: string,
): { success: true; copy: () => void } | { success: false } {
	const activeBuild = useAtomValue(activeBuildAtom)
	const builds = useAtomValue(buildStorageAtom)

	if (buildName && !(buildName in builds)) {
		return { success: false }
	}

	const build = buildName ? builds[buildName] : activeBuild

	const url = new URL(window.location.origin)
	const log = {} as Record<StatSource | 'wornItem', Stats | string>

	return {
		success: true,
		copy: () => {
			for (const source of sources) {
				const serializedStats = serializeStats(build, source)
				if (serializedStats) {
					url.searchParams.set(source, serializedStats)
					log[source] = build[source]
				}
			}

			if (build.wornItem) {
				url.searchParams.set(keys.wornItem, build.wornItem)
				log['wornItem'] = build.wornItem
			}

			console.group('export')
			console.table(log)
			console.groupEnd()
			copyTextToClipboard(url.toString())
		},
	}
}

function serializeStats(build: Build, source: StatSource) {
	const isUnused = isDefaultStats(source, build[source])

	return isUnused
		? ''
		: stats
				.map((stat) => formatForSearchParam(build[source][stat.id]))
				.join(',')
}

function formatForSearchParam(number: number) {
	return number.toFixed(2).replace(/[.,]00$/, '')
}
