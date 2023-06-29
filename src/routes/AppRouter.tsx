import React, { FC, useContext, useState } from 'react'
import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom'
import { AdvertsContext } from '../adverts/AdvertsContext'
import { AdvertsRepository } from '../adverts/types'
import { AdvertRouteView } from './AdvertRouteView'
import { ErrorRouteView } from './ErrorRouteView'
import { CreateAdvertRouteView } from './CreateAdvertRouteView'
import { HomeRouteView } from './HomeRouteView'
import { ProfileRouteView } from './ProfileRouteView'
import { EditAdvertRouteView } from './EditAdvertRouteView copy'

const createRouter = ({ getAdvert, getTerms }: AdvertsRepository) =>
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
                <Route path="profile" element={<ProfileRouteView />} />
            </Route>
        )
    )

export const AppRouter: FC = () => {
    const adverts = useContext(AdvertsContext)
    const [router] = useState(createRouter(adverts))
    return <RouterProvider router={router} />
}