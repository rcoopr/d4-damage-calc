'use client'

import { useAtom } from 'jotai'
import { ChangeEventHandler, useCallback } from 'react'
import { Settings, settingsAtom } from '@/lib/store/settings/settings'

// type SettingsByValue<T> = {
// 	[K in keyof Settings as Settings[K] extends T ? K : never]: Settings[K]
// }

// type BooleanSettings = SettingsByValue<boolean>

// type StringSettings = SettingsByValue<string>

export function Settings() {
	// const settings = useAtomValue(settingsAtom)
	const [settings, setSettings] = useAtom(settingsAtom)

	const onChangeSliders = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(ev) =>
			setSettings((s) => ({ ...s, sliders: !!ev.currentTarget.checked })),
		[setSettings],
	)
	const onChangeInputSize = useCallback<ChangeEventHandler<HTMLSelectElement>>(
		(ev) =>
			setSettings((s) => ({
				...s,
				inputSize: ev.currentTarget.value as Settings['inputSize'],
			})),
		[setSettings],
	)

	return (
		<div className='flex flex-col gap-2 mb-4'>
			<label className='flex items-center justify-between'>
				<div>Use Sliders</div>
				<input
					className='checkbox checkbox-sm rounded disabled:cursor-default'
					type='checkbox'
					checked={settings.sliders}
					onChange={onChangeSliders}
				/>
			</label>
			<label className='flex items-center justify-between'>
				<div>Input Size</div>
				<select
					className='select select-bordered bg-stone-800 select-md rounded'
					value={settings.inputSize}
					onChange={onChangeInputSize}
				>
					<option value='small'>Small</option>
					<option value='medium'>Medium</option>
					<option value='large'>Large</option>
				</select>
			</label>
		</div>
	)
	// return Object.entries(settings).map(([setting, value]) => (
	// 	<Setting key={setting} name={setting as keyof Settings} value={value} />
	// ))
}

// function Setting({
// 	name,
// 	value,
// }: {
// 	name: keyof Settings
// 	value: Settings[keyof Settings]
// }) {
// 	if (typeof value === 'boolean') {
// 		return <Checkbox name={name as keyof BooleanSettings} />
// 	}

// 	if (typeof value === 'string') {
// 		return <Select name={name as keyof StringSettings} />
// 	}

// 	return <input id={name} value={value} />
// }

// function Checkbox({ name }: { name: keyof BooleanSettings }) {
// 	const [settings, setSettings] = useAtom(settingsAtom)

// 	const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
// 		(ev) => {
// 			setSettings((settings) => ({
// 				...settings,
// 				name: !!ev.currentTarget.checked,
// 			}))
// 		},
// 		[setSettings],
// 	)
// 	return (
// 		<input
// 			type='checkbox'
// 			id={`setting-${name}`}
// 			checked={settings[name]}
// 			onChange={onChange}
// 		/>
// 	)
// }

// function Select({ name }: { name: keyof BooleanSettings }) {
// 	const [settings, setSettings] = useAtom(settingsAtom)

// 	const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
// 		(ev) => {
// 			setSettings((settings) => ({
// 				...settings,
// 				name: !!ev.currentTarget.checked,
// 			}))
// 		},
// 		[setSettings],
// 	)
// 	return (
// 		<input
// 			type='checkbox'
// 			id={`setting-${name}`}
// 			checked={settings[name]}
// 			onChange={onChange}
// 		/>
// 	)
// }
