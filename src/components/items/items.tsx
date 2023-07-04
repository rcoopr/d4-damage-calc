import { StatInput } from '@/components/input/stats'
import { ItemComparison } from '@/components/items/comparison'

export function ItemsSection() {
	return (
		<div className='flex flex-col'>
			<h2 className='mb-6 text-2xl font-bold'>Item Comparison</h2>
			<div className='grid gap-x-12 gap-y-2 relative'>
				<ItemComparison item='item1' />
				<StatInput source='item1' />

				<div className='divider' />

				<ItemComparison item='item2' />
				<StatInput source='item2' />
			</div>
		</div>
	)
}
