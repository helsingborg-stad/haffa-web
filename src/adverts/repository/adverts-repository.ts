import { ifNullThenNotFoundError } from '../../errors'
import { gqlClient } from '../../graphql'
import { sanitizeAdvertInput } from './mappers'
import { createAdvertMutation, getAdvertQuery, getTermsQuery, listAdvertsQuery, updateAdvertMutation } from './queries'
import { Advert, AdvertTerms, AdvertsRepository, AdvertsSearchParams } from '../types'

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
	getTerms: async () => gql(token)
		.query(getTermsQuery)
		.map<AdvertTerms>('terms')
		.then(ifNullThenNotFoundError),
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
		.variables({ input: sanitizeAdvertInput(advert) })
		.map<Advert>('createAdvert'),
	updateAdvert: async (id, advert) => gql(token)
		.query(updateAdvertMutation)
		.variables({ id, input: sanitizeAdvertInput(advert) })
		.map<Advert>('updateAdvert'),
})
