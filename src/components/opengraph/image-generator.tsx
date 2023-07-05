import { ImageResponse } from 'next/server'
import { Build } from '@/lib/store/builds/schema'
import { OpengraphComparison } from '@/components/opengraph/comparison-preview'
import { OpengraphImageHome } from '@/components/opengraph/home'

const getFont = async (url: URL) => {
	const res = await fetch(url)
	return await res.arrayBuffer()
}

type OpengraphImageProps = {
	size: { width: number; height: number }
	build?: Build
}

export async function OpengraphImage({ size, build }: OpengraphImageProps) {
	if (!build) return new ImageResponse(<OpengraphImageHome />, { ...size })

	return new ImageResponse(
		(
			// ImageResponse JSX element
			<OpengraphComparison build={build} />
		),
		// ImageResponse options
		{
			...size,
			// debug: true,
			fonts: [
				{
					name: 'Space Grotesk',
					data: await getFont(
						new URL('@/fonts/SpaceGrotesk-Regular.ttf', import.meta.url),
					),
					style: 'normal',
					weight: 400,
				},
				{
					name: 'Space Mono',
					data: await getFont(
						new URL('@/fonts/SpaceMono-Regular.ttf', import.meta.url),
					),
					style: 'normal',
					weight: 400,
				},
				{
					name: 'Space Mono',
					data: await getFont(
						new URL('@/fonts/SpaceMono-Italic.ttf', import.meta.url),
					),
					style: 'italic',
					weight: 400,
				},
			],
		},
	)
}
