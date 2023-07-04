import isEqual from 'lodash.isequal'
import { keys, reservedBuildNames } from './constants'
import {
	Build,
	BuildStorage,
	ItemSource,
	StatSource,
	Stats,
	buildStorageSchema,
	sources,
	stats,
	statsSchema,
} from './schema'
import { defaultBaseStats, defaultItemStats, emptyBuild } from './defaults'
import { clamp } from '@/lib/utils'

export function isWornItem(item: string | null): item is ItemSource | null {
	return item === null || item === 'item1' || item === 'item2'
}

export function getInitialBuilds(key: string, fallback: BuildStorage) {
	const localBuilds = getLocalBuilds(key, fallback)

	if (!(reservedBuildNames.default in localBuilds)) {
		localBuilds[reservedBuildNames.default] = emptyBuild
	}

	if (window.location.search !== '') {
		const importedBuild = getImportBuild()
		localBuilds[reservedBuildNames.import] = importedBuild
	}

	// localStorage.setItem(key, JSON.stringify(localBuilds));

	return localBuilds
}

export function getLocalBuilds(key: string, fallback: BuildStorage) {
	const storedValue = localStorage.getItem(key)

	try {
		return buildStorageSchema.parse(JSON.parse(storedValue ?? ''))
	} catch (e) {
		if (process.env.DEV) console.log(e)
		return fallback
	}
}

export function getImportBuild(): Build {
	const searchParams = new URLSearchParams(window.location.search)
	const importedBuild: Partial<Build> = {}

	for (const source of sources) {
		const param = searchParams.get(source)

		if (param && typeof param === 'string') {
			const paramStats = param.split(',')
			const statsObject = Object.fromEntries(
				stats.map((stat, index) => [stat.id, paramStats[index]]),
			)
			const parsedStats = statsSchema.safeParse(statsObject)

			if (parsedStats.success) {
				importedBuild[source] = parsedStats.data
			}
		}
	}

	const wornParam = Number(searchParams.get(keys.wornItem))
	const wornItemNumber = Number.isNaN(wornParam) ? 0 : clamp(wornParam, 0, 2)
	const wornItem = wornItemNumber === 0 ? null : `item${wornItemNumber}`
	if (isWornItem(wornItem)) {
		importedBuild.wornItem = wornItem
	}

	const build = Object.assign({}, emptyBuild, importedBuild)

	console.groupCollapsed('import')
	console.table(importedBuild)
	console.groupEnd()

	return build
}

export function isDefaultStats(source: StatSource, stats: Stats) {
	return isEqual(
		stats,
		source === 'char' ? defaultBaseStats : defaultItemStats,
	)
}
