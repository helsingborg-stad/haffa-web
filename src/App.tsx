import { type FC, useContext, useEffect, useMemo, useState } from 'react'
import './App.css'
import {
    AdvertFieldProvider,
    createAdvertFieldRepository,
    createNotifyingAdvertFieldRepository,
} from 'advert-field-config'
import { createNotifyingAdvertsRepository } from 'adverts'
import { AnalyticsProvider } from 'analytics'
import {
    ApiKeysProvider,
    createApiKeysRepository,
    createNotifyingApiKeysRepository,
} from 'api-keys'
import { AppSettingsProvider } from 'app-settings'
import { BrandingProvider } from 'branding/BrandingProvider'
import {
    CategoriesProvider,
    createCategoriesRepository,
    createNotifyingCategoriesRepository,
} from 'categories'
import { ContentProvider } from 'content/ContentContext'
import { createContentRepository } from 'content/content-repository'
import { createNotifyingContentRepository } from 'content/notifying-content-repository'
import { FetchContext, FetchContextProvider } from 'hooks/fetch/FetchContext'
import {
    createLocationRepository,
    createNotifyingLocationRepository,
    LocationProvider,
} from 'locations'
import {
    createLoginPoliciesRepository,
    createNotifyingLoginPoliciesRepository,
    LoginPoliciesProvider,
} from 'login-policies'
import { NotificationsContext, NotificationsProvider } from 'notifications'
import {
    createNotifyingOptionsRepository,
    createOptionsRepository,
} from 'options'
import { OptionsProvider } from 'options/OptionsContext'
import { PhraseContext } from 'phrases/PhraseContext'
import {
    createNotifyingPickupLocationRepository,
    createPickupLocationRepository,
    PickupLocationProvider,
} from 'pickup-locations'
import {
    createNotifyingProfileRepository,
    createProfileRepository,
    ProfileProvider,
} from 'profile'
import {
    createNotifyingSmsTemplateRepository,
    createSmsTemplateRepository,
    SmsTemplateProvider,
} from 'sms-templates'
import { createStatisticsProvider, StatisticsProvider } from 'statistics'
import {
    createNotifyingSubscriptionsRepository,
    createSubscriptionsRepository,
    SubscriptionsProvider,
} from 'subscriptions'
import { createSyslogProvider, SyslogProvider } from 'syslog'
import { SystemSettingsProvider } from 'system-settings'
import { TagsProvider } from 'tags'
import { createNotifyingTagsRepository } from 'tags/repository/notifying-tags-repository'
import { createTagsRepository } from 'tags/repository/tags-repository'
import {
    createNotifyingTermsRepository,
    createTermsRepository,
    TermsProvider,
} from 'terms'
import { AdvertsProvider } from './adverts/AdvertsContext'
import { createAdvertsRepository } from './adverts/repository/adverts-repository'
import { AuthContext, AuthContextProvider } from './auth'
import { createAuthProvider } from './auth/auth-provider'
import { AuthenticateView } from './auth/components/AuthenticateView'
import { AppRouter } from './routes/AppRouter'

const Main: FC = () => {
    const { isAuthenticated, token } = useContext(AuthContext)
    const { fetch } = useContext(FetchContext)
    const { phrase } = useContext(PhraseContext)
    const notifications = useContext(NotificationsContext)

    const options = useMemo(
        () =>
            createNotifyingOptionsRepository(
                notifications,
                phrase,
                createOptionsRepository(token, fetch)
            ),
        [notifications, phrase, token, fetch]
    )

    const terms = useMemo(
        () =>
            createNotifyingTermsRepository(
                notifications,
                phrase,
                createTermsRepository(token, fetch)
            ),
        [notifications, phrase, token, fetch]
    )

    const tags = useMemo(
        () =>
            createNotifyingTagsRepository(
                notifications,
                phrase,
                createTagsRepository(token, fetch)
            ),
        [notifications, phrase, token, fetch]
    )

    const apiKeys = useMemo(
        () =>
            createNotifyingApiKeysRepository(
                notifications,
                phrase,
                createApiKeysRepository(token, fetch)
            ),
        [notifications, phrase, token, fetch]
    )

    const loginPolicies = useMemo(
        () =>
            createNotifyingLoginPoliciesRepository(
                notifications,
                phrase,
                createLoginPoliciesRepository(token, fetch)
            ),
        [notifications, phrase, token, fetch]
    )
    const categories = useMemo(
        () =>
            createNotifyingCategoriesRepository(
                notifications,
                phrase,
                createCategoriesRepository(token, fetch)
            ),
        [notifications, phrase, token, fetch]
    )

    const adverts = useMemo(
        () =>
            createNotifyingAdvertsRepository(
                notifications,
                phrase,
                createAdvertsRepository(token, fetch)
            ),
        [notifications, phrase, token, fetch]
    )
    const profiles = useMemo(
        () =>
            createNotifyingProfileRepository(
                notifications,
                phrase,
                createProfileRepository(token, fetch)
            ),
        [notifications, phrase, token, fetch]
    )

    const statistics = useMemo(
        () => createStatisticsProvider(token, fetch),
        [token, fetch]
    )

    const syslog = useMemo(
        () => createSyslogProvider(token, fetch),
        [token, fetch]
    )

    const subscriptions = useMemo(
        () =>
            createNotifyingSubscriptionsRepository(
                notifications,
                phrase,
                createSubscriptionsRepository(token, fetch)
            ),
        [notifications, phrase, token, fetch]
    )
    const content = useMemo(
        () =>
            createNotifyingContentRepository(
                notifications,
                phrase,
                createContentRepository(token, fetch)
            ),
        [notifications, phrase, token, fetch]
    )
    const fieldConfig = useMemo(
        () =>
            createNotifyingAdvertFieldRepository(
                notifications,
                phrase,
                createAdvertFieldRepository(token, fetch)
            ),
        [notifications, phrase, token, fetch]
    )

    const locations = useMemo(
        () =>
            createNotifyingLocationRepository(
                notifications,
                phrase,
                createLocationRepository(token, fetch)
            ),
        [notifications, phrase, token, fetch]
    )

    const smsTemplates = useMemo(
        () =>
            createNotifyingSmsTemplateRepository(
                notifications,
                phrase,
                createSmsTemplateRepository(token, fetch)
            ),
        [notifications, phrase, token, fetch]
    )

    const pickupLocations = useMemo(
        () =>
            createNotifyingPickupLocationRepository(
                notifications,
                phrase,
                createPickupLocationRepository(token, fetch)
            ),
        [notifications, phrase, token, fetch]
    )

    return isAuthenticated ? (
        <SmsTemplateProvider repository={smsTemplates}>
            <OptionsProvider repository={options}>
                <ApiKeysProvider repository={apiKeys}>
                    <LoginPoliciesProvider repository={loginPolicies}>
                        <CategoriesProvider repository={categories}>
                            <TermsProvider repository={terms}>
                                <TagsProvider repository={tags}>
                                    <StatisticsProvider provider={statistics}>
                                        <SyslogProvider provider={syslog}>
                                            <SubscriptionsProvider
                                                repository={subscriptions}
                                            >
                                                <AdvertsProvider
                                                    repository={adverts}
                                                >
                                                    <ProfileProvider
                                                        repository={profiles}
                                                    >
                                                        <ContentProvider
                                                            repository={content}
                                                        >
                                                            <AdvertFieldProvider
                                                                repository={
                                                                    fieldConfig
                                                                }
                                                            >
                                                                <LocationProvider
                                                                    repository={
                                                                        locations
                                                                    }
                                                                >
                                                                    <PickupLocationProvider
                                                                        repository={
                                                                            pickupLocations
                                                                        }
                                                                    >
                                                                        <AppRouter />
                                                                    </PickupLocationProvider>
                                                                </LocationProvider>
                                                            </AdvertFieldProvider>
                                                        </ContentProvider>
                                                    </ProfileProvider>
                                                </AdvertsProvider>
                                            </SubscriptionsProvider>
                                        </SyslogProvider>
                                    </StatisticsProvider>
                                </TagsProvider>
                            </TermsProvider>
                        </CategoriesProvider>
                    </LoginPoliciesProvider>
                </ApiKeysProvider>
            </OptionsProvider>
        </SmsTemplateProvider>
    ) : (
        <AuthenticateView />
    )
}

const App: FC = () => {
    const [authProvider] = useState(createAuthProvider())

    useEffect(() => {
        AnalyticsProvider()
    }, [])

    return (
        <SystemSettingsProvider>
            <AppSettingsProvider>
                <BrandingProvider>
                    <NotificationsProvider>
                        <FetchContextProvider>
                            <AuthContextProvider authProvider={authProvider}>
                                <Main />
                            </AuthContextProvider>
                        </FetchContextProvider>
                    </NotificationsProvider>
                </BrandingProvider>
            </AppSettingsProvider>
        </SystemSettingsProvider>
    )
}

export default App
