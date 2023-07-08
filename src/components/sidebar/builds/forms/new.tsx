'use client'

import clsx from 'clsx'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import {
	buildNamesAtom,
	activeBuildNameAtom,
	buildStorageAtom,
} from '@/lib/store/builds/builds'
import {
	getHumanReadableErrorMessage,
	isValidObjectKey,
} from '@/components/sidebar/builds/forms/shared'
import { emptyBuild } from '@/lib/store/builds/defaults'

type FormData = {
	buildName: string
}

const defaultFormData: FormData = { buildName: 'Build Name' }

export function SaveBuildForm() {
	const buildNames = useAtomValue(buildNamesAtom)
	const [activeBuildName, setActiveBuildName] = useAtom(activeBuildNameAtom)

	const setStorage = useSetAtom(buildStorageAtom)

	const {
		register,
		handleSubmit,
		formState: { errors },
		resetField,
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
				return newStorage
			})
			resetField('buildName')
			setActiveBuildName(data.buildName)
		},
		[activeBuildName, setActiveBuildName, setStorage, resetField],
	)

	return (
		<form method='dialog' onSubmit={handleSubmit(onSubmit)}>
			<div className='flex flex-col'>
				<div className='mb-2 flex items-end justify-between'>
					<label htmlFor='save-build-name' className='mb-0.5'>
						Save current build
					</label>
					<input
						disabled={!!errorMessage}
						type='submit'
						value='Save'
						className='btn-success btn-sm btn rounded'
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
						'peer mb-1 block rounded-md border px-2.5 py-1.5 text-stone-100 placeholder-stone-400 outline-none focus:ring-2',
						errorMessage
							? 'border-error bg-error-content selection:bg-error/50 focus:border-error focus:ring-error'
							: 'border-stone-600 bg-stone-700 selection:bg-success/50 focus:border-success focus:bg-success/10 focus:ring-success',
					)}
				/>
				<div className='text-sm text-error auto-height peer-aria-[invalid="true"]:auto-height-open'>
					<div>{getHumanReadableErrorMessage(errors.buildName)}</div>
				</div>
			</div>
		</form>
	)
}
