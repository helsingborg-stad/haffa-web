import { ifNullThenNotFoundError } from '../../errors'
import { gqlClient } from '../../graphql'
import { mapAdvertToCreateAdvertInput } from './mappers'
import { createAdvertMutation, getAdvertQuery, listAdvertsQuery } from './queries'
import { Advert, AdvertsRepository } from '../types'

const gql = (token: string) => gqlClient().headers({ Authorization: `Bearer ${token}` })

export const createAdvertsRepository = (token: string): AdvertsRepository => ({
	getAdvert: async id => gql(token)
		.query(getAdvertQuery)
		.variables({ id })
		.map<Advert>('getAdvert')
		.then(ifNullThenNotFoundError),
	listAdverts: async () => gql(token)
		.query(listAdvertsQuery)
		.map<Advert[]>('adverts'),
	createAdvert: async (advert) => gql(token)
		.query(createAdvertMutation)
		.variables({ input: mapAdvertToCreateAdvertInput(advert) })
		.map<Advert>('createAdvert'),
})
