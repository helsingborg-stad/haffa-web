import { FC, PropsWithChildren, useContext, useState } from 'react'
import {
    Route,
    RouteProps,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
    useLoaderData,
} from 'react-router-dom'
import { Layout } from 'layout'
import {
    AdvertsRepository,
    AdvertsContext,
    CreateAdvertView,
    EditAdvertView,
    AdvertsView,
    AdvertDetailsView,
    MyAdvertsView,
    MyReservationsView,
} from 'adverts'
import {
    EditProfileView,
    ProfileContext,
    ProfileRepository,
    ProfileView,
} from 'profile'
import { AdvertQrCodeView } from 'adverts/components/details'
import { AuthContext, HaffaUserRoles } from 'auth'
import { UnauthorizedView } from 'auth/components/UnathorizedView'
import { EditCategoriesView, EditLoginPoliciesView } from 'admin'
import { ErrorRouteView } from './ErrorRouteView'
import { SettingsContext } from '../settings'
import { SettingsRepository } from '../settings/types'

const UnpackLoaderData: FC<{ render: (loaderData: any) => JSX.Element }> = ({
    render,
}) => {
    const loaderData = useLoaderData()
    return render(loaderData)
}

const RequireRole: FC<
    PropsWithChildren & { predicate: (roles: HaffaUserRoles) => boolean }
> = ({ predicate, children }) => {
    const { roles } = useContext(AuthContext)

    return <Layout>{predicate(roles) ? children : <UnauthorizedView />}</Layout>
}

const createRouter = (
    { getAdvert, getTerms }: AdvertsRepository,
    { getProfile }: ProfileRepository,
    { getCategories }: SettingsRepository
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
            <Layout key="home">
                <AdvertsView />
            </Layout>
        ),
    })
    /**
     * path: /my-adverts
     */
    const createMyAdvertsProps = (): AsyncRouteConfig => ({
        element: (
            <Layout key="my-adverts">
                <MyAdvertsView />
            </Layout>
        ),
    })
    /**
     * path: /my-reservations
     */
    const createMyReservationsProps = (): AsyncRouteConfig => ({
        element: (
            <Layout key="my-reservations">
                <MyReservationsView />
            </Layout>
        ),
    })
    /**
     * path: /'advert/create
     */
    const createAdvertProps = (): AsyncRouteConfig => ({
        loader: () =>
            Promise.all([getProfile(), getTerms(), getCategories()]).then(
                ([profile, terms, categories]) => ({
                    profile,
                    terms,
                    categories,
                })
            ),
        element: (
            <UnpackLoaderData
                key="create-advert"
                render={({ profile, terms, categories }) => (
                    <Layout renderAppbarControls={() => null}>
                        <CreateAdvertView
                            profile={profile}
                            terms={terms}
                            categories={categories}
                        />
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
            Promise.all([
                getAdvert(advertId as string),
                getTerms(),
                getCategories(),
            ]).then(([advert, terms, categories]) => ({
                advert,
                terms,
                categories,
            })),
        element: (
            <UnpackLoaderData
                key="edit-advert"
                render={({ advert, terms, categories }) => (
                    <Layout renderAppbarControls={() => null}>
                        <EditAdvertView
                            advert={advert}
                            terms={terms}
                            categories={categories}
                        />
                    </Layout>
                )}
            />
        ),
    })

    /**
     * path: /advert/qrcode/:advertId
     */
    const viewAdvertQrCodeProps = (): AsyncRouteConfig => ({
        loader: ({ params: { advertId } }) =>
            getAdvert(advertId as string).then((advert) => ({
                advert,
            })),
        element: (
            <UnpackLoaderData
                key="view-advert"
                render={({ advert }) => <AdvertQrCodeView advert={advert} />}
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
                key="view-advert"
                render={({ advert }) => (
                    <Layout>
                        <AdvertDetailsView advert={advert} />
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
                key="edit-profile"
                render={({ profile }) => (
                    <Layout>
                        <EditProfileView profile={profile} />
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
                key="view-profile"
                render={({ profile }) => (
                    <Layout>
                        <ProfileView profile={profile} />
                    </Layout>
                )}
            />
        ),
    })

    /**
     * path: /admin/logins
     */
    const viewAdminLoginsProps = (): AsyncRouteConfig => ({
        element: (
            <RequireRole predicate={(r) => !!r.canEditSystemLoginPolicies}>
                <EditLoginPoliciesView />
            </RequireRole>
        ),
    })
    /**
     * path: /admin/categories
     */
    const viewAdminCategoriesProps = (): AsyncRouteConfig => ({
        element: (
            <RequireRole predicate={(r) => !!r.canEditSystemCategories}>
                <EditCategoriesView />
            </RequireRole>
        ),
    })

    return createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" errorElement={<ErrorRouteView />}>
                <Route path="" {...createHomeProps()} />
                <Route
                    path="my-reservations"
                    {...createMyReservationsProps()}
                />
                <Route path="my-adverts" {...createMyAdvertsProps()} />
                <Route path="advert/create" {...createAdvertProps()} />
                <Route path="advert/edit/:advertId" {...editAdvertProps()} />
                <Route
                    path="advert/qrcode/:advertId"
                    {...viewAdvertQrCodeProps()}
                />
                <Route path="advert/:advertId" {...viewAdvertProps()} />
                <Route path="profile/edit" {...editProfileProps()} />
                <Route path="profile" {...viewProfileProps()} />
                <Route path="admin/logins" {...viewAdminLoginsProps()} />
                <Route
                    path="admin/categories"
                    {...viewAdminCategoriesProps()}
                />
            </Route>
        )
    )
}

export const AppRouter: FC = () => {
    const adverts = useContext(AdvertsContext)
    const profiles = useContext(ProfileContext)
    const settings = useContext(SettingsContext)
    const [router] = useState(createRouter(adverts, profiles, settings))
    return <RouterProvider router={router} />
}
