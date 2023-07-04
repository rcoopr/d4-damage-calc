import { StatSource, BuildSource } from '@/store/builds/schema'

export function clamp(number: number, min: number, max: number) {
	return Math.min(max, Math.max(min, number))
}

export const mapSourceToBuilds: Record<StatSource, BuildSource> = {
	char: 'char',
	item1: 'build1',
	item2: 'build2',
}

export function resetWindowLocationToOrigin() {
	window.history.replaceState(null, '', new URL(window.location.origin))
}

export function noop() {
	void 0
}
