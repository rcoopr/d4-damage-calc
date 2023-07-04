import { CharacterSection } from '@/components/character/character'
import { Hero } from '@/components/hero/hero'
import { BuildSummary } from '@/components/summary/build-dps'
import { ItemsSection } from '@/components/items/items'
import { DetailedStatsSummary } from '@/components/summary/detailed-stats'

export default function Home() {
	return (
		<div className='mr-16 flex min-h-screen flex-col items-center px-8 md:px-16 lg:px-24'>
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
		</div>
	)
}
