import { ifNullThenNotFoundError } from '../errors'
import { gqlClient } from '../gql'
import { createAdvertMutation, getAdvertQuery, listAdvertsQuery } from './queries'
import { Advert, AdvertsRepository } from './types'

export const createAdvertsRepository = (): AdvertsRepository => ({
	getAdvert: async id => gqlClient()
		.query(getAdvertQuery)
		.variables({ id })
		.map<Advert>('getAdvert')
		.then(ifNullThenNotFoundError),
	listAdverts: async () => gqlClient()
		.query(listAdvertsQuery)
		.map<Advert[]>('adverts'),
	createAdvert: async (advert) => gqlClient()
		.query(createAdvertMutation)
		.variables({ input: { ...advert, id: undefined } })
		.map<Advert>('createAdvert'),
})
