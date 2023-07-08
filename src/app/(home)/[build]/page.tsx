import { Homepage } from '@/app/(home)/home'

type PageParams = { build?: string }

export default function HomePage({ params }: { params: PageParams }) {
	return <Homepage build={params.build} />
}
