import { FC, useContext, useMemo, useState } from 'react'
import './App.css'
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material/styles'
import { createProfileRepository } from 'profile/repository/profile-repository'
import { ProfileProvider } from 'profile/ProfileContext'
import { FetchContext, FetchContextProvider } from 'hooks/fetch/FetchContext'
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
    const adverts = useMemo(
        () => createAdvertsRepository(token, fetch),
        [token]
    )
    const profiles = useMemo(
        () => createProfileRepository(token, fetch),
        [token]
    )
    return isAuthenticated ? (
        <AdvertsProvider repository={adverts}>
            <ProfileProvider repository={profiles}>
                <AppRouter />
            </ProfileProvider>
        </AdvertsProvider>
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
