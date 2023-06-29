import { FC } from 'react'
import { useLoaderData } from 'react-router-dom'
import { Advert } from '../adverts/types'
import { AdvertDetails } from '../adverts/components/AdvertDetails'
import { Layout } from '../layout'

export const AdvertRouteView: FC = () => {
    const { advert } = useLoaderData() as { advert: Advert }
    return (
        <Layout>
            <AdvertDetails advert={advert as Advert} />
        </Layout>
    )
}
