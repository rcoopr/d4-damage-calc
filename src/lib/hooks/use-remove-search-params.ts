'use client'

import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'

export const useHideSearchParams = (url?: string) => {
	const router = useRouter()
	const pathname = usePathname()

	console.log({ pathname })
	// router.replace(url, )
}
