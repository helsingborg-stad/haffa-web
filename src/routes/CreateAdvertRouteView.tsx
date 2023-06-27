import { FC } from 'react'
import { CreateAdvert } from '../adverts/components/CreateAdvert'
import { Layout } from '../layout'
import { AdvertTerms } from '../adverts/types'
import { useLoaderData } from 'react-router-dom'

export const CreateAdvertRouteView: FC = () => {
	const { terms } = useLoaderData() as {terms: AdvertTerms}
	return (
		<Layout renderAppbarControls={() => null}>
			<CreateAdvert terms={terms}/>
		</Layout>)
}