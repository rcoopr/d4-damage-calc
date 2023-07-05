import { atom } from 'jotai'
import { BuildSource, StatSource, DpsStats } from '../schema'
import { activeBuildAtom } from '../builds'
import { computeStats } from '@/lib/store/builds/computed/calculate'

export type ComputedStats = {
	statsTotal: Record<StatSource, DpsStats>
	dps: Record<StatSource | BuildSource, number>
	comparison: Record<'item' | 'build', number>
	increase: Record<Exclude<BuildSource, 'char'>, number>
}

export const computedStatsAtom = atom<ComputedStats>((get) => {
	const build = get(activeBuildAtom)
	return computeStats(build)
})
