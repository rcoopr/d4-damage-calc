import clsx from 'clsx'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { MouseEventHandler, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { getHumanReadableErrorMessage, isValidObjectKey } from './shared'
import {
	buildStorageAtom,
	activeBuildNameAtom,
	buildNamesAtom,
} from '@/lib/store/builds/builds'
import { reservedBuildNames } from '@/lib/store/builds/constants'
import { useExportBuild } from '@/components/hero/use-export-build'

const notifySuccess = () => toast.success('Build URL copied to clipboard!')
const notifyErrorInvalidBuild = () =>
	toast.error('Build could not be exported. Invalid build name')

type FormData = {
	name: string
}

export async function BuildNameInputForm({ name }: { name: string }) {
	const [editing, setEditing] = useState(false)

	const setStorage = useSetAtom(buildStorageAtom)
	const [activeBuidName, setActiveBuildName] = useAtom(activeBuildNameAtom)
	const buildNames = useAtomValue(buildNamesAtom)

	const exportBuild = useExportBuild()

	const DO_NOT_TOUCH =
		name === reservedBuildNames.default || name === reservedBuildNames.import

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

	const deleteBuild = useCallback<MouseEventHandler>(
		(ev) => {
			ev.preventDefault()
			setStorage((storage) => {
				const clone = { ...storage }
				delete clone[name]

				return clone
			})
			setActiveBuildName(reservedBuildNames.default)
		},
		[setStorage, name, setActiveBuildName],
	)

	const shareBuild = useCallback<MouseEventHandler>(
		(ev) => {
			ev.preventDefault()
			if (!exportBuild.success) {
				notifyErrorInvalidBuild()
				return
			}

			exportBuild.copy()
			notifySuccess()
		},
		[exportBuild],
	)

	return (
		<form method='dialog' onSubmit={handleSubmit(onSubmit)}>
			<div className='flex flex-col py-1'>
				<div className='flex items-center gap-1'>
					<div
						className={clsx(
							'join relative flex',
							name === activeBuidName &&
								!editing &&
								'after:pointer-events-none after:absolute after:inset-0 after:rounded-md after:border after:border-primary after:gradient-mask-r-0',
						)}
					>
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
								'peer join-item w-full rounded-md border px-2.5 py-1 text-stone-100 placeholder-stone-400 outline-none focus:ring-2',
								errorMessage
									? 'border-error selection:bg-error/50 focus:border-error focus:ring-error'
									: 'border-stone-600 selection:bg-success/50 focus:border-success focus:ring-success',
							)}
						/>

						<button
							onClick={toggleEdit}
							className={clsx(
								'join-item relative grid w-12 place-content-center border bg-stone-700 enabled:cursor-pointer disabled:bg-stone-900',
								'peer-disabled:[&>span]:i-solar-pen-line-duotone [&>span]:disabled:text-stone-600',
								errorMessage
									? 'border-error bg-error [&>span]:i-solar-close-circle-bold [&>span]:text-stone-900'
									: 'border-stone-600',
							)}
						>
							<span className='i-solar-check-circle-linear inline-block text-sm text-success' />
						</button>
					</div>

					<div>
						<button
							disabled={DO_NOT_TOUCH}
							onClick={deleteBuild}
							className='relative grid h-8 w-8 shrink-0 place-content-center rounded focus:ring-2 focus:ring-stone-300 enabled:cursor-pointer enabled:hover:text-primary disabled:opacity-30'
						>
							<span className='i-solar-trash-bin-2-outline inline-block' />
						</button>
					</div>
					<div>
						<button
							onClick={shareBuild}
							className='relative grid h-8 w-8 shrink-0 cursor-pointer place-content-center rounded hover:text-primary focus:ring-2 focus:ring-stone-300'
						>
							<span className='i-solar-link-round-angle-line-duotone inline-block' />
						</button>
					</div>
				</div>
				<div
					className={clsx(
						errorMessage && 'auto-height-open',
						'mb-1 pt-1 text-sm text-error auto-height',
					)}
				>
					<div>{getHumanReadableErrorMessage(errors.name)}</div>
				</div>
			</div>
		</form>
	)
}
