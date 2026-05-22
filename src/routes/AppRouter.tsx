import { AboutView } from 'about'
import { createAdminTabs } from 'admin/admin-tabs'
import { AdvertFieldsContext } from 'advert-field-config'
import type { AdvertFieldRepository } from 'advert-field-config/types'
import {
    AdvertDetailsView,
    AdvertsContext,
    type AdvertsRepository,
    AdvertsView,
    CreateAdvertView,
    EditAdvertView,
    MyReservationsView,
} from 'adverts'
import { AdvertsDashboardView } from 'adverts/dashboard/AdvertsDashboardView'
import { AuthContext, type AuthContextType, type HaffaUserRoles } from 'auth'
import { UnauthorizedView } from 'auth/components/UnathorizedView'
import { CategoriesContext } from 'categories'
import type { CategoriesRepository } from 'categories/types'
import { ContentContext } from 'content'
import type { ContentRepository } from 'content/types'
import { HomeView } from 'home'
import { Layout } from 'layout'
import { LocationContext } from 'locations'
import type { LocationRepository } from 'locations/types'
import { PhraseContext, type PhraseContextType } from 'phrases'
import { PickupLocationContext } from 'pickup-locations'
import type { PickupLocationRepository } from 'pickup-locations/types'
import {
    EditProfileView,
    ProfileContext,
    type ProfileRepository,
    ProfileView,
    RemoveProfileView,
} from 'profile'
import { ScanQrCodeView } from 'qr-code-navigation/ScanQrCodeView'
import { type FC, type PropsWithChildren, useContext, useState } from 'react'
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    type RouteProps,
    RouterProvider,
    useLoaderData,
} from 'react-router-dom'
import { StatisticsContext } from 'statistics'
import type { StaticsticsProvider } from 'statistics/types'
import { MySubscriptionsView } from 'subscriptions'
import { SubscriptionView } from 'subscriptions/components/SubscriptionView'
import { TagsContext } from 'tags'
import type { TagsRepository } from 'tags/types'
import { TermsContext } from 'terms'
import type { TermsRepository } from 'terms/types'
import { ErrorRouteView } from './ErrorRouteView'

const UnpackLoaderData: FC<{ render: (loaderData: any) => React.JSX.Element }> = ({
    render,
}) => {
    const loaderData = useLoaderData()
    return render(loaderData)
}

const RouteLayout: FC<
    PropsWithChildren & { ifRoles: (roles: HaffaUserRoles) => boolean }
> = ({ ifRoles, children }) => {
    const { roles } = useContext(AuthContext)

    return ifRoles(roles) ? (
        <Layout key="a">{children}</Layout>
    ) : (
        <Layout key="u">
            <UnauthorizedView />
        </Layout>
    )
}

const createRouter = (
    { roles }: Pick<AuthContextType, 'roles'>,
    { phrase }: Pick<PhraseContextType, 'phrase'>,
    { getTerms }: TermsRepository,
    { getAdvert }: AdvertsRepository,
    { getProfile }: ProfileRepository,
    { getCategories }: CategoriesRepository,
    { getComposition }: ContentRepository,
    { getFieldConfig }: AdvertFieldRepository,
    { getLocations }: LocationRepository,
    { getTagDescriptions }: TagsRepository,
    { getPickupLocationsByAdvert }: PickupLocationRepository,
    { getSummaries }: StaticsticsProvider
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
        loader: () =>
            Promise.all([getComposition(), getSummaries()]).then(
                ([composition, summaries]) => ({ composition, summaries })
            ),
        element: (
            <UnpackLoaderData
                key="home"
                render={({ composition, summaries }) => (
                    <Layout key="home">
                        <HomeView
                            composition={composition}
                            summaries={summaries}
                        />
                    </Layout>
                )}
            />
        ),
    })

    /**
     * path: /browse
     */
    const createBrowseProps = (): AsyncRouteConfig => ({
        element: (
            <Layout key="browse">
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
                <AdvertsDashboardView />
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
            Promise.all([
                getProfile(),
                getTerms(),
                getCategories(),
                getFieldConfig(),
                getLocations(),
            ]).then(([profile, terms, categories, fields, locations]) => ({
                profile,
                terms,
                categories,
                fields,
                locations,
            })),
        element: (
            <UnpackLoaderData
                key="create-advert"
                render={({ profile, terms, categories, fields, locations }) => (
                    <Layout>
                        <CreateAdvertView
                            profile={profile}
                            terms={terms}
                            categories={categories}
                            fields={fields}
                            locations={locations}
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
                getFieldConfig(),
                getLocations(),
            ]).then(([advert, terms, categories, fields, locations]) => ({
                advert,
                terms,
                categories,
                fields,
                locations,
            })),
        element: (
            <UnpackLoaderData
                key="edit-advert"
                render={({ advert, terms, categories, fields, locations }) => (
                    <Layout>
                        <EditAdvertView
                            advert={advert}
                            terms={terms}
                            categories={categories}
                            fields={fields}
                            locations={locations}
                        />
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
            Promise.all([
                getAdvert(advertId as string),
                getTerms(),
                getCategories(),
                getFieldConfig(),
                getTagDescriptions(),
                getPickupLocationsByAdvert({ id: advertId! }),
            ]).then(
                ([
                    advert,
                    terms,
                    categories,
                    fields,
                    tagDescriptions,
                    pickupLocations,
                ]) => ({
                    advert,
                    terms,
                    categories,
                    fields,
                    tagDescriptions,
                    pickupLocations,
                })
            ),
        element: (
            <UnpackLoaderData
                key="view-advert"
                render={({
                    advert,
                    terms,
                    categories,
                    fields,
                    tagDescriptions,
                    pickupLocations,
                }) => (
                    <Layout>
                        <AdvertDetailsView
                            advert={advert}
                            terms={terms}
                            categories={categories}
                            fields={fields}
                            tagDescriptions={tagDescriptions}
                            pickupLocations={pickupLocations}
                        />
                    </Layout>
                )}
            />
        ),
    })

    /**
     * path: /profile/edit
     */
    const editProfileProps = (): AsyncRouteConfig => ({
        loader: () =>
            Promise.all([getProfile(), getTerms()]).then(
                ([profile, terms]) => ({ profile, terms })
            ),
        element: (
            <UnpackLoaderData
                key="edit-profile"
                render={({ profile, terms }) => (
                    <RouteLayout
                        ifRoles={({ canManageProfile }) => !!canManageProfile}
                    >
                        <EditProfileView profile={profile} terms={terms} />
                    </RouteLayout>
                )}
            />
        ),
    })

    /**
     * path: /profile/remove
     */
    const removeProfileProps = (): AsyncRouteConfig => ({
        loader: () =>
            Promise.all([getProfile()]).then(([profile]) => ({ profile })),
        element: (
            <UnpackLoaderData
                key="remove-profile"
                render={({ profile }) => (
                    <RouteLayout
                        ifRoles={({ canManageProfile }) => !!canManageProfile}
                    >
                        <RemoveProfileView profile={profile} />
                    </RouteLayout>
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
                    <RouteLayout
                        ifRoles={({ canManageProfile }) => !!canManageProfile}
                    >
                        <ProfileView profile={profile} />
                    </RouteLayout>
                )}
            />
        ),
    })

    /**
     * path: /my-subscriptions
     */
    const viewMySubscriptionsProps = (): AsyncRouteConfig => ({
        element: (
            <RouteLayout ifRoles={(r) => !!r.canSubscribe}>
                <MySubscriptionsView />
            </RouteLayout>
        ),
    })

    /**
     * path: /subscription
     */
    const viewSubscriptionProps = (): AsyncRouteConfig => ({
        element: (
            <RouteLayout ifRoles={(r) => !!r.canSubscribe}>
                <SubscriptionView />
            </RouteLayout>
        ),
    })

    /**
     * path: /scan
     */
    const viewScanQrCodeProps = (): AsyncRouteConfig => ({
        element: (
            <Layout>
                <ScanQrCodeView />
            </Layout>
        ),
    })

    /**
     * path: /about
     */
    const viewAboutProps = (): AsyncRouteConfig => ({
        element: (
            <Layout>
                <AboutView />
            </Layout>
        ),
    })

    const adminTabs = createAdminTabs(roles, phrase)

    return createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" errorElement={<ErrorRouteView />}>
                <Route key="home" path="" {...createHomeProps()} />
                <Route key="browse" path="browse" {...createBrowseProps()} />
                <Route
                    key="my-reservations"
                    path="my-reservations"
                    {...createMyReservationsProps()}
                />
                <Route
                    key="my-adverts"
                    path="my-adverts"
                    {...createMyAdvertsProps()}
                />
                <Route
                    key="advert-create"
                    path="advert/create"
                    {...createAdvertProps()}
                />
                <Route
                    key="advert-edit"
                    path="advert/edit/:advertId"
                    {...editAdvertProps()}
                />
                <Route
                    key="advert"
                    path="advert/:advertId"
                    {...viewAdvertProps()}
                />
                <Route
                    key="profile-edit"
                    path="profile/edit"
                    {...editProfileProps()}
                />
                <Route
                    key="profile-remove"
                    path="profile/remove"
                    {...removeProfileProps()}
                />
                <Route key="profile" path="profile" {...viewProfileProps()} />
                <Route
                    key="my-subscriptions"
                    path="my-subscriptions"
                    {...viewMySubscriptionsProps()}
                />
                <Route
                    key="subscription"
                    path="subscription"
                    {...viewSubscriptionProps()}
                />
                <Route key="scan" path="scan" {...viewScanQrCodeProps()} />
                <Route key="about" path="about" {...viewAboutProps()} />

                {adminTabs.map(({ key, component }) => (
                    <Route
                        key={`admin-${key}`}
                        path={`admin/${key}`}
                        element={<Layout>{component}</Layout>}
                    />
                ))}
            </Route>
        )
    )
}

export const AppRouter: FC = () => {
    const terms = useContext(TermsContext)
    const adverts = useContext(AdvertsContext)
    const profiles = useContext(ProfileContext)
    const categories = useContext(CategoriesContext)
    const content = useContext(ContentContext)
    const fields = useContext(AdvertFieldsContext)
    const locations = useContext(LocationContext)
    const auth = useContext(AuthContext)
    const phrase = useContext(PhraseContext)
    const tags = useContext(TagsContext)
    const pickuplocations = useContext(PickupLocationContext)
    const summaries = useContext(StatisticsContext)
    const [router] = useState(
        createRouter(
            auth,
            phrase,
            terms,
            adverts,
            profiles,
            categories,
            content,
            fields,
            locations,
            tags,
            pickuplocations,
            summaries
        )
    )
    return <RouterProvider router={router} />
}
