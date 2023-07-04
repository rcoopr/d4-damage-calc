'use client'

import clsx from 'clsx'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { emptyBuild } from '@/store/builds/defaults'
import {
	buildNamesAtom,
	activeBuildNameAtom,
	buildStorageAtom,
} from '@/store/builds/builds'
import {
	getHumanReadableErrorMessage,
	isValidObjectKey,
} from '@/components/sidebar/builds/forms/shared'

type FormData = {
	buildName: string
}

const defaultFormData: FormData = { buildName: 'My Build' }

export function SaveBuildForm() {
	const buildNames = useAtomValue(buildNamesAtom)
	const [activeBuildName, setActiveBuildName] = useAtom(activeBuildNameAtom)

	const setStorage = useSetAtom(buildStorageAtom)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({ mode: 'onChange' })
	const errorMessage = getHumanReadableErrorMessage(errors.buildName)
	const validate = useCallback(
		(v: string) => !buildNames.includes(v) && isValidObjectKey(v),
		[buildNames],
	)

	const onSubmit = useCallback(
		(data: FormData) => {
			// TODO / Warning: Validation on setStorage could fail, causing a mismatch in activeBuildName and buildStorage
			setStorage((storage) => {
				const newStorage = { ...storage }
				const copiedBuild = Object.getOwnPropertyDescriptor(
					newStorage,
					activeBuildName,
				)
				Object.defineProperty(
					newStorage,
					data.buildName,
					copiedBuild ?? emptyBuild,
				)
				console.log({ newStorage, copiedBuild, name: data.buildName })
				return newStorage
			})
			setActiveBuildName(data.buildName)
		},
		[activeBuildName, setActiveBuildName, setStorage],
	)

	return (
		<form method='dialog' onSubmit={handleSubmit(onSubmit)}>
			<div className='flex flex-col'>
				<div className='flex justify-between items-end mb-2'>
					<label htmlFor='save-build-name' className='mb-0.5'>
						Create a Build
					</label>
					<input
						disabled={!!errorMessage}
						type='submit'
						value='Save'
						className='btn btn-sm btn-success rounded'
					/>
				</div>
				<input
					id='save-build-name'
					type='text'
					placeholder={defaultFormData.buildName}
					{...register('buildName', {
						required: true,
						maxLength: 80,
						validate,
					})}
					aria-invalid={errorMessage ? 'true' : 'false'}
					aria-errormessage={errorMessage}
					className={clsx(
						'peer border rounded-md block px-2.5 py-1.5 mb-1 placeholder-stone-400 text-stone-100 outline-none focus:ring-2',
						errorMessage
							? 'focus:ring-error focus:border-error border-error bg-error-content selection:bg-error/50'
							: 'focus:ring-success focus:border-success border-stone-600 focus:bg-success/10 bg-stone-700 selection:bg-success/50',
					)}
				/>
				<div className='peer-aria-[invalid="true"]:auto-height-open auto-height text-sm text-error'>
					<div>{getHumanReadableErrorMessage(errors.buildName)}</div>
				</div>
			</div>
		</form>
	)
}
