import isEqual from 'lodash.isequal'
import { keys, reservedBuildNames } from '../constants'
import {
	Build,
	BuildStorage,
	ItemSource,
	StatSource,
	DpsStats,
	buildStorageSchema,
	sources,
	stats,
	statsSchema,
	BuildSource,
} from './schema'
import { defaultBaseStats, defaultItemStats, emptyBuild } from './defaults'
import { isSSR } from '@/lib/utils'
import { ComputedStats } from '@/lib/store/builds/computed/atom'

export function isStatSource(
	potentialSource: string,
): potentialSource is StatSource {
	return sources.includes(potentialSource as StatSource)
}

export function isWornItem(item: string | null): item is ItemSource | null {
	return item === null || item === 'item1' || item === 'item2'
}

export function getInitialBuilds(
	key: string,
	opts: { fallback: BuildStorage; decodedBuild?: string },
) {
	const localBuilds = getLocalBuilds(key, opts.fallback)

	// Ensure default build exists
	if (!(reservedBuildNames.default in localBuilds)) {
		localBuilds[reservedBuildNames.default] = emptyBuild
	}

	if (opts.decodedBuild) {
		const importedBuild = getImportBuild(opts.decodedBuild)
		localBuilds[reservedBuildNames.import] = importedBuild
	}

	return localBuilds
}

export function getLocalBuilds(key: string, fallback: BuildStorage) {
	if (isSSR()) return fallback
	const storedValue = localStorage.getItem(key)

	try {
		return buildStorageSchema.parse(JSON.parse(storedValue ?? ''))
	} catch (e) {
		if (process.env.DEV) console.log(e)
		return fallback
	}
}

export function getImportBuild(decodedBuild?: string): Build {
	const url = new URL(`https://base/?${decodedBuild}`)
	const importedBuild: Partial<Build> = {}

	for (const source of sources) {
		const param = url.searchParams.get(source)

		if (param && typeof param === 'string') {
			const paramStats = param.split('-')
			const statsObject = Object.fromEntries(
				stats.map((stat, index) => [stat.id, paramStats[index]]),
			)
			const parsedStats = statsSchema.safeParse(statsObject)

			if (parsedStats.success) {
				importedBuild[source] = parsedStats.data
			}
		}
	}

	const wornItem = url.searchParams.get(keys.wornItem)
	if (isWornItem(wornItem)) {
		importedBuild.wornItem = wornItem
	}

	const build = Object.assign({}, emptyBuild, importedBuild)

	if (console.groupCollapsed) {
		console.groupCollapsed('Import')
		console.table(importedBuild)
		console.groupEnd()
	} else {
		console.log({ importedBuild })
	}

	return build
}

export function isDefaultStats(source: StatSource, stats: DpsStats) {
	return isEqual(
		stats,
		source === 'char' ? defaultBaseStats : defaultItemStats,
	)
}

export function getDpsDiff(
	comparison: ComputedStats['comparison'],
	source: StatSource | BuildSource,
) {
	switch (source) {
		case 'build1':
			return comparison.build
		case 'build2':
			return 0 - comparison.build
		case 'item1':
			return comparison.item
		case 'item2':
			return 0 - comparison.item
		default:
			return 0
	}
}
