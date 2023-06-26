import { ifNullThenNotFoundError } from '../../errors'
import { gqlClient } from '../../graphql'
import { mapAdvertToCreateAdvertInput } from './mappers'
import { createAdvertMutation, getAdvertQuery, listAdvertsQuery } from './queries'
import { Advert, AdvertsRepository, AdvertsSearchParams } from '../types'

const gql = (token: string) => gqlClient().headers({ Authorization: `Bearer ${token}` })

const makeFilter = (p?: AdvertsSearchParams): any => {
	if (p?.search) {
		return {
			title: {
				contains: p.search,
			},
		}
	}
}
export const createAdvertsRepository = (token: string): AdvertsRepository => ({
	getAdvert: async id => gql(token)
		.query(getAdvertQuery)
		.variables({ id })
		.map<Advert>('getAdvert')
		.then(ifNullThenNotFoundError),
	listAdverts: async (searchParams) => gql(token)
		.query(listAdvertsQuery)
		.variables({
			filter: makeFilter(searchParams),
		})
		.map<Advert[]>('adverts'),
	createAdvert: async (advert) => gql(token)
		.query(createAdvertMutation)
		.variables({ input: mapAdvertToCreateAdvertInput(advert) })
		.map<Advert>('createAdvert'),
})
