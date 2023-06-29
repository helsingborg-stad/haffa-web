import { FC } from 'react'
import { useLoaderData } from 'react-router-dom'
import { CreateAdvert } from '../adverts/components/CreateAdvert'
import { Layout } from '../layout'
import { AdvertTerms } from '../adverts/types'

export const CreateAdvertRouteView: FC = () => {
    const { terms } = useLoaderData() as { terms: AdvertTerms }
    return (
        <Layout renderAppbarControls={() => null}>
            <CreateAdvert terms={terms} />
        </Layout>
    )
}
