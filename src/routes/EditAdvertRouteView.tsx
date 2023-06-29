import { FC } from 'react'
import { useLoaderData } from 'react-router-dom'
import { Layout } from '../layout'
import { Advert, AdvertTerms } from '../adverts/types'
import { EditAdvert } from '../adverts/components/EditAdvert'

export const EditAdvertRouteView: FC = () => {
    const { advert, terms } = useLoaderData() as {
        advert: Advert
        terms: AdvertTerms
    }
    return (
        <Layout renderAppbarControls={() => null}>
            <EditAdvert advert={advert} terms={terms} />
        </Layout>
    )
}
