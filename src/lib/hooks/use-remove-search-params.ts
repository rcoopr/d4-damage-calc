'use client'

import {
	useRouter,
	usePathname,
	useSearchParams,
	ReadonlyURLSearchParams,
} from 'next/navigation'
import { useEffect } from 'react'

type RouterCondition = (args: {
	pathname: string
	searchParams: ReadonlyURLSearchParams
}) => boolean

export const useHideSearchParams = (condition: RouterCondition) => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	useEffect(() => {
		if (condition({ pathname, searchParams })) {
			router.replace(pathname)
		}
	}, [pathname, searchParams, router, condition])
}
