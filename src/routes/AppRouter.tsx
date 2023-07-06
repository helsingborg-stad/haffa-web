import { FC, useContext, useState } from 'react'
import {
    Route,
    RouteProps,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
    useLoaderData,
} from 'react-router-dom'
import { ProfileRepository } from 'profile/types'
import { Layout } from 'layout'
import { AdvertDetails } from 'adverts/components/AdvertDetails'
import { AdvertsContext } from 'adverts/AdvertsContext'
import { ProfileContext } from 'profile/ProfileContext'
import { CreateAdvert } from 'adverts/components/CreateAdvert'
import { EditAdvert } from 'adverts/components/EditAdvert'
import { EditProfile } from 'profile/components/EditProfile'
import { ProfileView } from 'profile/components/ProfileView'
import { AdvertsView } from 'adverts/components/AdvertsView'
import { AdvertsRepository } from '../adverts/types'
import { ErrorRouteView } from './ErrorRouteView'

const UnpackLoaderData: FC<{ render: (loaderData: any) => JSX.Element }> = ({
    render,
}) => {
    const loaderData = useLoaderData()
    return render(loaderData)
}

const createRouter = (
    { getAdvert, getTerms }: AdvertsRepository,
    { getProfile }: ProfileRepository
) => {
    // So many of the routes relies on
    // - an async fetch of some data
    // - an eventual unpacking of the data (via useLoaderData())
    // - progatation of loaded data to a rendering component
    // In order to avoid trivial separate components for this orchestration
    // we introduce AsyncRouteConfig and simple functions to orchestrate
    // this router/async/load/render mess
    type AsyncRouteConfig = Pick<RouteProps, 'element' | 'loader'>

    /**
     * path: /
     */
    const createHomeProps = (): AsyncRouteConfig => ({
        element: (
            <Layout>
                <AdvertsView />
            </Layout>
        ),
    })
    /**
     * path: /'advert/create
     */
    const createAdvertProps = (): AsyncRouteConfig => ({
        loader: () => getTerms().then((terms) => ({ terms })),
        element: (
            <UnpackLoaderData
                render={({ terms }) => (
                    <Layout renderAppbarControls={() => null}>
                        <CreateAdvert terms={terms} />
                    </Layout>
                )}
            />
        ),
    })

    /**
     * path: /advert/edit
     */
    const editAdvertProps = (): AsyncRouteConfig => ({
        loader: ({ params: { advertId } }) =>
            Promise.all([getAdvert(advertId as string), getTerms()]).then(
                ([advert, terms]) => ({ advert, terms })
            ),
        element: (
            <UnpackLoaderData
                render={({ advert, terms }) => (
                    <Layout renderAppbarControls={() => null}>
                        <EditAdvert advert={advert} terms={terms} />
                    </Layout>
                )}
            />
        ),
    })

    /**
     * path: /advert/:advertId
     */
    const viewAdvertProps = (): AsyncRouteConfig => ({
        loader: ({ params: { advertId } }) =>
            getAdvert(advertId as string).then((advert) => ({
                advert,
            })),
        element: (
            <UnpackLoaderData
                render={({ advert }) => (
                    <Layout>
                        <AdvertDetails advert={advert} />
                    </Layout>
                )}
            />
        ),
    })

    /**
     * path: /profile/edit
     */
    const editProfileProps = (): AsyncRouteConfig => ({
        loader: () => getProfile().then((profile) => ({ profile })),
        element: (
            <UnpackLoaderData
                render={({ profile }) => (
                    <Layout>
                        <EditProfile profile={profile} />
                    </Layout>
                )}
            />
        ),
    })

    /**
     * path: /profile
     */
    const viewProfileProps = (): AsyncRouteConfig => ({
        loader: () => getProfile().then((profile) => ({ profile })),
        element: (
            <UnpackLoaderData
                render={({ profile }) => (
                    <Layout>
                        <ProfileView profile={profile} />
                    </Layout>
                )}
            />
        ),
    })

    return createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" errorElement={<ErrorRouteView />}>
                <Route path="" {...createHomeProps()} />
                <Route path="advert/create" {...createAdvertProps()} />
                <Route path="advert/edit">
                    <Route path=":advertId" {...editAdvertProps()} />
                </Route>
                <Route path="advert">
                    <Route path=":advertId" {...viewAdvertProps()} />
                </Route>
                <Route path="profile/edit" {...editProfileProps()} />
                <Route path="profile" {...viewProfileProps()} />
            </Route>
        )
    )
}

export const AppRouter: FC = () => {
    const adverts = useContext(AdvertsContext)
    const profiles = useContext(ProfileContext)
    const [router] = useState(createRouter(adverts, profiles))
    return <RouterProvider router={router} />
}
