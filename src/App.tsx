import React, { FC, useContext, useMemo, useState } from 'react'
import './App.css'
import { AdvertsProvider } from './lib/adverts/AdvertsContext'
import { createAdvertsRepository } from './lib/adverts/adverts-repository'
import { AppRouter } from './routes/AppRouter'
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material/styles'
import { AuthContext, AuthContextProvider } from './auth'
import { AuthenticateView } from './auth/AuthenticateView'
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
	const repository = useMemo(() => createAdvertsRepository(token), [token])

	return isAuthenticated 
		? <AdvertsProvider repository={repository}><AppRouter /></AdvertsProvider> 
		: <AuthenticateView />
}
const App: FC = () => {
	const [authProvider] = useState(createAuthProvider())
	return (
		<AuthContextProvider authProvider={authProvider}>
			<ThemeProvider theme={theme}>
				<Main/>
			</ThemeProvider>
		</AuthContextProvider>)
}

export default App
