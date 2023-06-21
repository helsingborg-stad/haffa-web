import React, { FC, useState } from 'react'
import './App.css'
import { AdvertsProvider } from './lib/adverts/AdvertsContext'
import { createAdvertsRepository } from './lib/adverts/adverts-repository'
import Main from './screens/main'
import { AppRoutes } from './AppRoutes'

const App: FC = () => {
	const [repository] = useState(createAdvertsRepository())
	return (
		<AdvertsProvider repository={repository}>
			<Main>
				<AppRoutes/>
			</Main>
		</AdvertsProvider>)
}

export default App
