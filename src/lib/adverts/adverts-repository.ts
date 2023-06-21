import { gqlClient } from '../gql'
import { listAdvertsQuery } from './queries'
import { Advert, AdvertsRepository } from './types'

export const createAdvertsRepository = (): AdvertsRepository => ({
	listAdverts: async () => gqlClient()
		.query(listAdvertsQuery)
		.map<Advert[]>('adverts'),
	createAdvert: async (advert) => ({
		...advert,
		id: '123',
	}),
})
