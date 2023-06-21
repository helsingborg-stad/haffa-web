import React, { FC, useState } from 'react'
import './App.css'
import { AdvertsProvider } from './lib/adverts/AdvertsContext'
import { createAdvertsRepository } from './lib/adverts/adverts-repository'
import { AppRouter } from './routes/AppRouter'

const App: FC = () => {
	const [repository] = useState(createAdvertsRepository())
	return (
		<AdvertsProvider repository={repository}>
			<AppRouter/>
		</AdvertsProvider>)
}

export default App
