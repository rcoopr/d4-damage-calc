import { Hero } from '@/components/hero/hero'
import { BuildSummary } from '@/components/hero/summary'

export default function Home() {
	return (
		<div className='mr-16 flex min-h-screen flex-col items-center px-8 md:px-16 lg:px-24'>
			<Hero />

			<div className='mb-36 flex flex-col'>
				<BuildSummary />
				<div className='mb-16 flex flex-col justify-center gap-x-8 gap-y-2 lg:flex-row'>
					<div className='flex flex-col'>
						<h2 className='mb-6 text-2xl font-bold'>Character Stats</h2>
						<div className='relative grid gap-x-12 gap-y-2'>
							<h3
								className='text-3xl max-lg:hidden lg:invisible'
								aria-hidden
							>
								&ensp;
							</h3>
							{/* <StatInput source="char" />
        <RelativeStatValues source="char" /> */}
						</div>
					</div>
					<div className='divider lg:divider-horizontal' />
					<div className='flex flex-col'>
						<h2 className='mb-6 text-2xl font-bold'>Item Comparison</h2>
						{/* <ItemStatsSection /> */}
					</div>
				</div>
				<div className='flex flex-col flex-wrap items-center justify-center gap-4 md:flex-row md:items-start'>
					{/* <BuildSummary source="char" />
      <BuildSummary source="item1" />
      <BuildSummary source="item2" /> */}
				</div>
			</div>
		</div>
	)
}
