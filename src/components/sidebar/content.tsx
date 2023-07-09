import { SaveBuildForm } from '@/components/sidebar/builds/forms/new'
import { BuildList } from '@/components/sidebar/builds/list'
import { SidebarSection } from '@/components/sidebar/section'
import { Settings } from '@/components/sidebar/settings/settings'
import { Sponsor } from '@/components/sidebar/sponsor'

export function SidebarContent() {
	return (
		<>
			<div className='absolute inset-0 flex flex-col overflow-y-auto bg-stone-950/90 p-8 pt-5'>
				<div className='flex flex-col'>
					<SidebarSection id='settings-builds' title='Builds' startOpen>
						<BuildList />
						<SaveBuildForm />
					</SidebarSection>
					<SidebarSection
						id='settings-preferences'
						title='Preferences'
						startOpen
					>
						<Settings />
					</SidebarSection>
				</div>
				<div className='sticky bottom-0 mt-auto z-20'>
					<div className='-mx-8 h-8 bg-gradient-to-t from-stone-950 from-10% px-8' />
					<div className='-mx-8 bg-stone-950 px-8 pt-4 shadow-[0_2rem_0_2rem] shadow-stone-950'>
						<Sponsor />
					</div>
				</div>
			</div>
		</>
	)
}
