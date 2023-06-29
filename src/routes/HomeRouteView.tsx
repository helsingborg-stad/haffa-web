import React, { FC } from 'react'
import { Layout } from '../layout'
import { AdvertsView } from '../adverts/components/AdvertsView'

export const HomeRouteView: FC = () => (
    <Layout>
        <AdvertsView />
    </Layout>
)
