import { FC, useContext, useState } from 'react'
import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom'
import { ProfileContext } from 'profile/ProfileContext'
import { ProfileRepository } from 'profile/types'
import { AdvertsContext } from '../adverts/AdvertsContext'
import { AdvertsRepository } from '../adverts/types'
import { AdvertRouteView } from './AdvertRouteView'
import { ErrorRouteView } from './ErrorRouteView'
import { CreateAdvertRouteView } from './CreateAdvertRouteView'
import { HomeRouteView } from './HomeRouteView'
import { ProfileRouteView } from './ProfileRouteView'
import { EditAdvertRouteView } from './EditAdvertRouteView'
import { EditProfileRouteView } from './EditProfileRouteView'

const createRouter = (
    { getAdvert, getTerms }: AdvertsRepository,
    { getProfile }: ProfileRepository
) =>
    createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" errorElement={<ErrorRouteView />}>
                <Route path="" element={<HomeRouteView />} />
                <Route path="advert">
                    <Route
                        path=":advertId"
                        loader={({ params: { advertId } }) =>
                            getAdvert(advertId as string).then((advert) => ({
                                advert,
                            }))
                        }
                        Component={AdvertRouteView}
                    />
                </Route>
                <Route
                    path="new-advert"
                    loader={() => getTerms().then((terms) => ({ terms }))}
                    element={<CreateAdvertRouteView />}
                />
                <Route path="edit-advert">
                    <Route
                        path=":advertId"
                        loader={({ params: { advertId } }) =>
                            Promise.all([
                                getAdvert(advertId as string),
                                getTerms(),
                            ]).then(([advert, terms]) => ({ advert, terms }))
                        }
                        element={<EditAdvertRouteView />}
                    />
                </Route>
                <Route
                    path="profile/edit"
                    loader={() => getProfile().then((profile) => ({ profile }))}
                    element={<EditProfileRouteView />}
                />
                <Route
                    path="profile"
                    loader={() => getProfile().then((profile) => ({ profile }))}
                    element={<ProfileRouteView />}
                />
            </Route>
        )
    )

export const AppRouter: FC = () => {
    const adverts = useContext(AdvertsContext)
    const profiles = useContext(ProfileContext)
    const [router] = useState(createRouter(adverts, profiles))
    return <RouterProvider router={router} />
}
