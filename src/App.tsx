import React, { FC, useContext, useState } from 'react'
import './App.css'
import { AdvertsProvider } from './lib/adverts/AdvertsContext'
import { createAdvertsRepository } from './lib/adverts/adverts-repository'
import { AppRouter } from './routes/AppRouter'
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material/styles'
import { AuthContext, AuthContextProvider } from './auth'
import { AuthenticateView } from './auth/AuthenticateView'

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
	const { isAuthenticated } = useContext(AuthContext)

	return isAuthenticated ? <AppRouter /> : <AuthenticateView />
}
const App: FC = () => {
	const [repository] = useState(createAdvertsRepository())

	return (
		<AuthContextProvider>
			<AdvertsProvider repository={repository}>
				<ThemeProvider theme={theme}>
					<Main/>
				</ThemeProvider>
			</AdvertsProvider>
		</AuthContextProvider>)
}

export default App
