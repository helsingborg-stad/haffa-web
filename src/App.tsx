import React, { FC, useState } from 'react'
import './App.css'
import { AdvertsProvider } from './lib/adverts/AdvertsContext'
import { createAdvertsRepository } from './lib/adverts/adverts-repository'
import { AppRouter } from './routes/AppRouter'
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material/styles'

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
const App: FC = () => {
	const [repository] = useState(createAdvertsRepository())
	return (
		<AdvertsProvider repository={repository}>
			<ThemeProvider theme={theme}>
				<AppRouter/>
			</ThemeProvider>
		</AdvertsProvider>)
}

export default App
