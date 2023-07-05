import { Suspense } from 'react'
import { CharacterSection } from '@/components/character/character'
import { Hero } from '@/components/hero/hero'
import { ItemsSection } from '@/components/items/items'
import { BuildSummary } from '@/components/summary/build-dps'
import { DetailedStatsSummary } from '@/components/summary/detailed-stats'
import { Hydrate } from '@/components/utils/atoms'

export const metadata = {
	twitter: {
		card: 'summary_large_image',
	},
}

type PageParams = { build?: string }

function getDecodedBuild(params: PageParams) {
	if (!params.build || typeof params.build !== 'string') {
		return undefined
	}
	return decodeURIComponent(params.build)
}

export default function HomePage({ params }: { params: PageParams }) {
	const decodedBuild = getDecodedBuild(params)

	return (
		<div className='mr-16 flex min-h-screen flex-col items-center px-8 md:px-16 lg:px-24'>
			<Suspense fallback={null}>
				<Hydrate decodedBuild={decodedBuild} />
				<Hero />

				<div className='mb-36 flex flex-col'>
					<BuildSummary />
					<div className='mb-16 flex flex-col justify-center gap-x-8 gap-y-2 lg:flex-row'>
						<CharacterSection />
						<div className='divider lg:divider-horizontal' />
						<ItemsSection />
					</div>
					<DetailedStatsSummary />
				</div>
			</Suspense>
		</div>
	)
}
