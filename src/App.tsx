import React, { FC, useState } from 'react'
import './App.css'
import { AdvertsProvider } from './lib/adverts/AdvertsContext'
import { createAdvertsRepository } from './lib/adverts/adverts-repository'
import Main from './screens/main'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { Home } from './screens'


const createRouter = () => createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<Home />}>
		</Route>
	)
)

const App: FC = () => {
	const [repository] = useState(createAdvertsRepository())
	const [router] = useState(createRouter())
	return (
		<AdvertsProvider repository={repository}>
			<Main>
				<RouterProvider router={router} />
			</Main>
		</AdvertsProvider>)
}

export default App
