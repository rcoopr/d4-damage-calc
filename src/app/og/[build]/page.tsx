import { OpengraphComparison } from '@/components/opengraph/comparison-preview'
import { getImportBuild } from '@/lib/store/builds/utils'

export const metadata = {
	twitter: {
		card: 'summary_large_image',
	},
}

export default function Page({ params }: { params: { build: string } }) {
	if (!params.build) {
		return null
	}

	const build = getImportBuild(decodeURIComponent(params.build))

	return build && <OpengraphComparison build={build} />
}
