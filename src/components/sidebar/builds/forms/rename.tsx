import clsx from 'clsx'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getHumanReadableErrorMessage, isValidObjectKey } from './shared'
import {
	buildStorageAtom,
	activeBuildNameAtom,
	buildNamesAtom,
} from '@/store/builds/builds'
import { reservedBuildNames } from '@/store/builds/constants'

type FormData = {
	name: string
}

export function BuildNameInputForm({ name }: { name: string }) {
	const [editing, setEditing] = useState(false)

	const setStorage = useSetAtom(buildStorageAtom)
	const [activeBuidName, setActiveBuildName] = useAtom(activeBuildNameAtom)
	const buildNames = useAtomValue(buildNamesAtom)

	const DO_NOT_TOUCH = name === reservedBuildNames.default

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		setFocus,
	} = useForm<FormData>({ mode: 'onChange', defaultValues: { name } })
	const errorMessage = getHumanReadableErrorMessage(errors.name)
	const validate = useCallback(
		(v: string) =>
			v === name || (!buildNames.includes(v) && isValidObjectKey(v)),
		[buildNames, name],
	)

	const toggleEdit = useCallback(() => {
		setEditing((e) => {
			if (e && errors.name) {
				setValue('name', name)
			} else {
				setTimeout(() => setFocus('name'), 0)
			}
			return !e
		})
	}, [setEditing, setValue, name, errors.name, setFocus])

	const onSubmit = useCallback(
		(data: FormData) => {
			if (!editing) {
				if (name === data.name) {
					console.log('Rename to same value')
				} else if (!buildNames.includes(name)) {
					console.warn('Rename attempted but build could not be found')
				} else {
					let shouldUpdateActiveBuild = name === activeBuidName
					// TODO / Warning: Validation on setStorage could fail, causing a mismatch in activeBuildName and buildStorage
					setStorage((storage) => {
						const newStorage = { ...storage }
						const copiedValue = Object.getOwnPropertyDescriptor(
							newStorage,
							name,
						)

						if (!copiedValue) {
							console.warn('Rename build failed')
							shouldUpdateActiveBuild = false
							return storage
						}
						Object.defineProperty(newStorage, data.name, copiedValue)
						delete newStorage[name]
						return newStorage
					})
					if (shouldUpdateActiveBuild) {
						setActiveBuildName(data.name)
					}
				}
			}
		},
		[
			editing,
			name,
			setStorage,
			activeBuidName,
			buildNames,
			setActiveBuildName,
		],
	)

	return (
		<form method='dialog' onSubmit={handleSubmit(onSubmit)}>
			<div className='flex flex-col py-1'>
				<div className='flex gap-1 items-center'>
					<div className='join flex'>
						<input
							type='text'
							disabled={DO_NOT_TOUCH || !editing}
							placeholder={name}
							{...register('name', {
								required: true,
								maxLength: 80,
								validate,
							})}
							aria-invalid={!!errorMessage}
							aria-errormessage={errorMessage}
							className={clsx(
								'peer w-full join-item border rounded-md px-2.5 py-1 placeholder-stone-400 text-stone-100 outline-none focus:ring-2',
								errorMessage
									? 'focus:ring-error focus:border-error border-error selection:bg-error/50'
									: 'focus:ring-success focus:border-success border-stone-600 selection:bg-success/50',
							)}
						/>

						<button
							disabled={DO_NOT_TOUCH}
							onClick={toggleEdit}
							className={clsx(
								'relative enabled:cursor-pointer w-12 join-item bg-stone-700 disabled:bg-stone-900 border grid place-content-center',
								'peer-disabled:[&>span]:i-solar-pen-line-duotone [&>span]:disabled:text-stone-600',
								errorMessage
									? '[&>span]:i-solar-close-circle-bold [&>span]:text-stone-900 border-error bg-error'
									: 'border-stone-600',
							)}
						>
							<span className='i-solar-check-circle-linear text-success inline-block text-sm' />
						</button>
					</div>

					<div>
						<input
							id={`trash-${name}`}
							disabled={DO_NOT_TOUCH}
							type='submit'
							value='t'
							className='peer fixed h-0 w-0 appearance-none opacity-0'
						/>
						<label
							htmlFor={`trash-${name}`}
							className='relative peer-disabled:opacity-30 peer-enabled:cursor-pointer rounded peer-focus:ring-2 peer-focus:ring-stone-300 shrink-0 w-8 h-8 grid place-content-center peer-enabled:hover:text-primary'
						>
							<span className='i-solar-trash-bin-2-outline inline-block' />
						</label>
					</div>
					<div>
						<input
							id={`share-${name}`}
							type='submit'
							value='s'
							className='peer fixed h-0 w-0 appearance-none opacity-0'
						/>
						<label
							htmlFor={`share-${name}`}
							className='relative rounded peer-focus:ring-2 peer-focus:ring-stone-300 cursor-pointer shrink-0 w-8 h-8 grid place-content-center hover:text-primary'
						>
							<span className='i-solar-link-round-angle-line-duotone inline-block' />
						</label>
					</div>
				</div>
				<div
					className={clsx(
						errorMessage && 'auto-height-open',
						'auto-height text-sm text-error pt-1 mb-1',
					)}
				>
					<div>{getHumanReadableErrorMessage(errors.name)}</div>
				</div>
			</div>
		</form>
	)
}
