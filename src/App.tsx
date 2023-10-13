import { FC, useContext, useMemo, useState } from 'react'
import './App.css'
import { FetchContext, FetchContextProvider } from 'hooks/fetch/FetchContext'
import {
    CategoriesProvider,
    createCategoriesRepository,
    createNotifyingCategoriesRepository,
} from 'categories'
import {
    LoginPoliciesProvider,
    createLoginPoliciesRepository,
    createNotifyingLoginPoliciesRepository,
} from 'login-policies'

import { PhraseContext } from 'phrases/PhraseContext'
import { NotificationsContext } from 'notifications'
import { createNotifyingAdvertsRepository } from 'adverts'
import {
    ProfileProvider,
    createNotifyingProfileRepository,
    createProfileRepository,
} from 'profile'
import {
    ApiKeysProvider,
    createApiKeysRepository,
    createNotifyingApiKeysRepository,
} from 'api-keys'
import { BrandingProvider } from 'branding/BrandingContext'
import {
    TermsProvider,
    createNotifyingTermsRepository,
    createTermsRepository,
} from 'terms'
import {
    createBrandingRepository,
    createNotifyingBrandingRepository,
} from 'branding'
import { GlobalBrandingProvider } from 'branding/GlobalBrandingContext'
import { AdvertsProvider } from './adverts/AdvertsContext'
import { createAdvertsRepository } from './adverts/repository/adverts-repository'
import { AppRouter } from './routes/AppRouter'
import { AuthContext, AuthContextProvider } from './auth'
import { AuthenticateView } from './auth/components/AuthenticateView'
import { createAuthProvider } from './auth/auth-provider'

const Main: FC = () => {
    const { isAuthenticated, token } = useContext(AuthContext)
    const { fetch } = useContext(FetchContext)
    const { phrase } = useContext(PhraseContext)
    const notifications = useContext(NotificationsContext)

    const branding = useMemo(
        () =>
            createNotifyingBrandingRepository(
                notifications,
                phrase,
                createBrandingRepository(token, fetch)
            ),
        [notifications, phrase]
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
    return isAuthenticated ? (
        <BrandingProvider repository={branding}>
            <ApiKeysProvider repository={apiKeys}>
                <LoginPoliciesProvider repository={loginPolicies}>
                    <CategoriesProvider repository={categories}>
                        <TermsProvider repository={terms}>
                            <AdvertsProvider repository={adverts}>
                                <ProfileProvider repository={profiles}>
                                    <AppRouter />
                                </ProfileProvider>
                            </AdvertsProvider>
                        </TermsProvider>
                    </CategoriesProvider>
                </LoginPoliciesProvider>
            </ApiKeysProvider>
        </BrandingProvider>
    ) : (
        <AuthenticateView />
    )
}

const App: FC = () => {
    const [authProvider] = useState(createAuthProvider())
    return (
        <GlobalBrandingProvider>
            <FetchContextProvider>
                <AuthContextProvider authProvider={authProvider}>
                    <Main />
                </AuthContextProvider>
            </FetchContextProvider>
        </GlobalBrandingProvider>
    )
}

export default App
