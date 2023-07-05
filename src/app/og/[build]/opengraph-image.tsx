import { OpengraphImage } from '@/components/opengraph/image-generator'
import { getImportBuild } from '@/lib/store/builds/utils'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'D4 Calc'
export const size = {
	width: 1200,
	height: 630,
}

export const contentType = 'image/png'

type Params = { params: { build?: string } }

// Image generation
export default async function Image({ params }: Params) {
	const build = params.build
		? getImportBuild(decodeURIComponent(params.build))
		: undefined
	return OpengraphImage({ size, build })
}
