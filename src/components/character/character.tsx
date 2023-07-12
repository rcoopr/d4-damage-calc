import { RelativeStatValues } from '@/components/character/relative-worth'
import { ItemSuggestions } from '@/components/hero/item-suggestions'
import { StatInput } from '@/components/input/stats'

export function CharacterSection() {
	return (
		<div className='flex flex-col'>
			<h2 className='mb-6 text-2xl font-bold'>Character Stats</h2>
			<div className='relative grid gap-x-12 gap-y-2'>
				<h3 className='text-3xl max-lg:hidden lg:invisible' aria-hidden>
					&ensp;
				</h3>
				<StatInput source='char' />
				<ItemSuggestions />
				<div className='divider' />
				<RelativeStatValues />
			</div>
		</div>
	)
}
