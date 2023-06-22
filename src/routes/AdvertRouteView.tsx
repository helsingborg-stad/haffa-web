import { FC } from 'react'
import { useLoaderData } from 'react-router-dom'
import { Advert } from '../lib/adverts/types'
import { AdvertDetails } from '../adverts/AdvertDetails'
import { Layout } from '../layout'

export const AdvertRouteView: FC = () => {
	const { advert } = useLoaderData() as {advert: Advert}
	return (
		<Layout>
			<AdvertDetails advert={advert as Advert}/>
		</Layout>)
}