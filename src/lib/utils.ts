import { StatSource, BuildSource } from '@/lib/store/builds/schema'

export function clamp(number: number, min: number, max: number) {
	return Math.min(max, Math.max(min, number))
}

export const mapSourceToBuilds: Record<StatSource, BuildSource> = {
	char: 'char',
	item1: 'build1',
	item2: 'build2',
}

export const mapSourcesToLabels: Record<StatSource, string> = {
	char: 'Base',
	item1: 'Item 1',
	item2: 'Item 2',
}

export function noop() {
	void 0
}

export function isSSR() {
	return typeof window === 'undefined'
}
