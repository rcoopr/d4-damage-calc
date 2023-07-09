import { reservedBuildNames } from '../constants'
import { DpsStats, Build, BuildStorage } from './schema'

// Define values for very first page load
export const defaultBaseStats: DpsStats = {
	weaponDps: 1000,
	mainStat: 0,
	additive: 0,
	vulnerable: 20,
	critDamage: 50,
	critChance: 5,
}

export const defaultItemStats: DpsStats = {
	weaponDps: 0,
	mainStat: 0,
	additive: 0,
	vulnerable: 0,
	critDamage: 0,
	critChance: 0,
}

export const emptyBuild: Build = {
	char: defaultBaseStats,
	item1: defaultItemStats,
	item2: defaultItemStats,
	wornItem: null,
}

export const emptyStorage: BuildStorage = {
	[reservedBuildNames.default]: emptyBuild,
}
