import { useState, useEffect, DetailedHTMLProps, HTMLAttributes } from 'react'

type Props = {
	children: React.ReactNode
} & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLDivElement>

export const ClientOnly: React.FC<Props> = ({ children, ...delegated }) => {
	const [hasMounted, setHasMounted] = useState(false)

	useEffect(() => {
		setHasMounted(true)
	}, [])

	if (!hasMounted) {
		return null
	}

	return <div {...delegated}>{children}</div>
}
