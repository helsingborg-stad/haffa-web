import { FC, useContext, useMemo, useState } from 'react'
import './App.css'
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material/styles'
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
import { AdvertsProvider } from './adverts/AdvertsContext'
import { createAdvertsRepository } from './adverts/repository/adverts-repository'
import { AppRouter } from './routes/AppRouter'
import { AuthContext, AuthContextProvider } from './auth'
import { AuthenticateView } from './auth/components/AuthenticateView'
import { createAuthProvider } from './auth/auth-provider'

const theme = createTheme({
    palette: {
        primary: {
            main: 'rgb(80, 129, 27)',
        },
        secondary: {
            main: 'rgb(225, 233, 219)',
        },
    },
})

const Main: FC = () => {
    const { isAuthenticated, token } = useContext(AuthContext)
    const { fetch } = useContext(FetchContext)
    const { phrase } = useContext(PhraseContext)
    const notifications = useContext(NotificationsContext)

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
        <LoginPoliciesProvider repository={loginPolicies}>
            <CategoriesProvider repository={categories}>
                <AdvertsProvider repository={adverts}>
                    <ProfileProvider repository={profiles}>
                        <AppRouter />
                    </ProfileProvider>
                </AdvertsProvider>
            </CategoriesProvider>
        </LoginPoliciesProvider>
    ) : (
        <AuthenticateView />
    )
}
const App: FC = () => {
    const [authProvider] = useState(createAuthProvider())
    return (
        <FetchContextProvider>
            <AuthContextProvider authProvider={authProvider}>
                <ThemeProvider theme={theme}>
                    <Main />
                </ThemeProvider>
            </AuthContextProvider>
        </FetchContextProvider>
    )
}

export default App
