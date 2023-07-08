import { Suspense } from 'react'
import { CharacterSection } from '@/components/character/character'
import { Hero } from '@/components/hero/hero'
import { ItemsSection } from '@/components/items/items'
import { BuildSummary } from '@/components/summary/build-dps'
import { DetailedStatsSummary } from '@/components/summary/detailed-stats'
import { Hydrate } from '@/components/utils/atoms'

type HomepageParams = { build?: string }

function getDecodedBuild(build: HomepageParams['build']) {
	if (!build || typeof build !== 'string') {
		return undefined
	}
	return decodeURIComponent(build)
}

export function Homepage({ build }: HomepageParams) {
	const decodedBuild = getDecodedBuild(build)

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
