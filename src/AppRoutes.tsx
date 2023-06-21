import React, { FC, useContext, useState } from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { Home } from './screens'
import { AdvertDetailsPage } from './adverts/AdvertDetails'
import { AdvertsContext } from './lib/adverts/AdvertsContext'
import { AdvertsRepository } from './lib/adverts/types'
import { RouteError } from './RouteError'

const createRouter = ({ getAdvert }: AdvertsRepository) => createBrowserRouter(
	createRoutesFromElements(
		<Route path="/">
			<Route path='' element={<Home/>}/>
			<Route path='advert'>
				<Route 
					path=':advertId'
					loader={({ params: { advertId } }) => getAdvert(advertId as string).then(advert => ({ advert }))}
					errorElement={<RouteError/>}
					Component={AdvertDetailsPage}
				/>
			</Route>
		</Route>
	)
)

export const AppRoutes: FC = () => {
	const adverts = useContext(AdvertsContext)
	const [router] = useState(createRouter(adverts))
	return (<RouterProvider router={router} />)
}
