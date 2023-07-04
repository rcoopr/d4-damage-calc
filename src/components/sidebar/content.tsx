import { SaveBuildForm } from '@/components/sidebar/builds/forms/new'
import { BuildList } from '@/components/sidebar/builds/list'
import { SidebarSection } from '@/components/sidebar/section'
import { Sponsor } from '@/components/sidebar/sponsor'

export function SidebarContent() {
	return (
		<aside className='absolute inset-0 flex flex-col bg-stone-950/90 p-8 pt-5'>
			<SidebarSection id='settings-builds' title='Builds' startOpen>
				<BuildList />
				<SaveBuildForm />
			</SidebarSection>
			<div className='mt-auto w-full'>
				<Sponsor />
			</div>
		</aside>
	)
}
