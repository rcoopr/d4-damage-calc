import { ImageResponse } from 'next/server'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'D4 Calc'
export const size = {
	width: 1200,
	height: 630,
}

export const contentType = 'image/png'

export const title = 'og:title'
export const description = 'og:description'
export const site_name = 'og:site_name'
export const siteName = 'og:siteName'

// Font
const spaceGrotesk = fetch(
	new URL('../../public/SpaceGrotesk-Regular.ttf', import.meta.url),
).then((res) => res.arrayBuffer())

// Image generation
export default async function Image() {
	return new ImageResponse(
		(
			// ImageResponse JSX element
			<div
				style={{
					fontSize: 128,
					background: 'white',
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				D4 Calc
			</div>
		),
		// ImageResponse options
		{
			...size,
			fonts: [
				{
					name: 'Space Grotest',
					data: await spaceGrotesk,
					style: 'normal',
					weight: 400,
				},
			],
		},
	)
}
