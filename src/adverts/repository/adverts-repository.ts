import { ifNullThenNotFoundError } from '../../errors'
import { gqlClient } from '../../graphql'
import { sanitizeAdvertInput } from './mappers'
import { createAdvertMutation, getAdvertQuery, getTermsQuery, listAdvertsQuery, updateAdvertMutation } from './queries'
import { Advert, AdvertTerms, AdvertsRepository, AdvertsSearchParams } from '../types'
import { makeBackendUrl } from '../../lib/make-backend-url'

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

const fixupAdvert = (advert: Advert) => ({
	...advert,
	images: advert.images.filter(({ url }) => url).map(image => ({
		...image,
		url: makeBackendUrl(image.url),
	})),
})
export const createAdvertsRepository = (token: string): AdvertsRepository => ({
	getTerms: async () => gql(token)
		.query(getTermsQuery)
		.map<AdvertTerms>('terms')
		.then(ifNullThenNotFoundError),
	getAdvert: async id => gql(token)
		.query(getAdvertQuery)
		.variables({ id })
		.map<Advert>('getAdvert', fixupAdvert)
		.then(ifNullThenNotFoundError),
	listAdverts: async (searchParams) => gql(token)
		.query(listAdvertsQuery)
		.variables({
			filter: makeFilter(searchParams),
		})
		.map<Advert[]>('adverts', adverts => adverts.map(fixupAdvert)),
	createAdvert: async (advert) => gql(token)
		.query(createAdvertMutation)
		.variables({ input: sanitizeAdvertInput(advert) })
		.map<Advert>('createAdvert', fixupAdvert),
	updateAdvert: async (id, advert) => gql(token)
		.query(updateAdvertMutation)
		.variables({ id, input: sanitizeAdvertInput(advert) })
		.map<Advert>('updateAdvert', fixupAdvert),
})
