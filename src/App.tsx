import { FC, useContext, useMemo, useState } from 'react'
import './App.css'
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material/styles'
import { createProfileRepository } from 'profile/repository/profile-repository'
import { ProfileProvider } from 'profile/ProfileContext'
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
    const adverts = useMemo(() => createAdvertsRepository(token), [token])
    const profiles = useMemo(() => createProfileRepository(token), [token])
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
        <AuthContextProvider authProvider={authProvider}>
            <ThemeProvider theme={theme}>
                <Main />
            </ThemeProvider>
        </AuthContextProvider>
    )
}

export default App
