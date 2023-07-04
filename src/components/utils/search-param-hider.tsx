'use client'

import { useCallback } from 'react'
import { useHideSearchParams } from '@/lib/hooks/use-remove-search-params'

type RouterCondition = Parameters<typeof useHideSearchParams>[0]

// { when }: { when: RouterCondition }
export function SearchParamHider() {
	const when = useCallback<RouterCondition>(({ pathname, searchParams }) => {
		return pathname === '/' && searchParams.toString() !== ''
	}, [])

	useHideSearchParams(when)
	return null
}
