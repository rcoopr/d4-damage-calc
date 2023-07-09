import { atomWithStorage } from 'jotai/utils'
import { z } from 'zod'
import { keys } from '@/lib/store/constants'
import { isSSR, noop } from '@/lib/utils'

const settingsSchema = z.object({
	sliders: z.boolean().default(false),
	inputSize: z
		.literal('small')
		.or(z.literal('medium'))
		.or(z.literal('large'))
		.default('medium'),
})

export type Settings = z.infer<typeof settingsSchema>

const defaultSettings: Settings = {
	sliders: false,
	inputSize: 'medium',
}

export const settingsAtom = atomWithStorage(keys.settings, defaultSettings, {
	getItem(key, initialValue) {
		try {
			const storedValue = localStorage.getItem(key)
			return settingsSchema.parse(JSON.parse(storedValue ?? ''))
		} catch {
			return initialValue
		}
	},
	setItem(key, value) {
		!isSSR() && localStorage.setItem(key, JSON.stringify(value))
	},
	removeItem(key) {
		!isSSR() && localStorage.removeItem(key)
	},
	subscribe(key, callback, initialValue) {
		if (isSSR() || typeof window.addEventListener === 'undefined') {
			return noop
		}
		const listener = (ev: StorageEvent) => {
			if (ev.storageArea === localStorage && ev.key === key) {
				let newValue
				try {
					newValue = settingsSchema.parse(JSON.parse(ev.newValue ?? ''))
				} catch {
					newValue = initialValue
				}
				callback(newValue)
			}
		}
		window.addEventListener('storage', listener)
		return () => window.removeEventListener('storage', listener)
	},
})
