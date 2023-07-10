import {
    ifNullThenNotFoundError,
    valueAndValidOrThrowNotFound,
} from '../../errors'
import { gqlClient } from '../../graphql'
import { sanitizeAdvertInput } from './mappers'
import {
    cancelAdvertReservationMutation,
    createAdvertMutation,
    getAdvertQuery,
    getTermsQuery,
    listAdvertsQuery,
    removeAdvertMutation,
    reserveAdvertMutation,
    updateAdvertMutation,
} from './queries'
import {
    Advert,
    AdvertMutationResult,
    AdvertTerms,
    AdvertsRepository,
} from '../types'

const gql = (token: string) =>
    gqlClient().headers({ Authorization: `Bearer ${token}` })

const expectAdvert = (r: AdvertMutationResult): AdvertMutationResult =>
    valueAndValidOrThrowNotFound(r, r && r.advert)

export const createAdvertsRepository = (token: string): AdvertsRepository => ({
    getTerms: async () =>
        gql(token)
            .query(getTermsQuery)
            .map<AdvertTerms>('terms')
            .then(ifNullThenNotFoundError),
    getAdvert: async (id) =>
        gql(token)
            .query(getAdvertQuery)
            .variables({ id })
            .map<Advert>('getAdvert')
            .then(ifNullThenNotFoundError),
    listAdverts: async (filter) =>
        gql(token)
            .query(listAdvertsQuery)
            .variables({ filter })
            .map<Advert[]>('adverts'),
    createAdvert: async (advert) =>
        gql(token)
            .query(createAdvertMutation)
            .variables({ input: sanitizeAdvertInput(advert) })
            .map<AdvertMutationResult>('createAdvert')
            .then(expectAdvert),
    updateAdvert: async (id, advert) =>
        gql(token)
            .query(updateAdvertMutation)
            .variables({ id, input: sanitizeAdvertInput(advert) })
            .map<AdvertMutationResult>('updateAdvert')
            .then(expectAdvert),
    removeAdvert: async (id) =>
        gql(token)
            .query(removeAdvertMutation)
            .variables({ id })
            .map<AdvertMutationResult>('removeAdvert')
            .then(expectAdvert),
    reserveAdvert: async (id, quantity) =>
        gql(token)
            .query(reserveAdvertMutation)
            .variables({ id, quantity })
            .map<AdvertMutationResult>('reserveAdvert')
            .then(expectAdvert),
    cancelAdvertReservation: async (id) =>
        gql(token)
            .query(cancelAdvertReservationMutation)
            .variables({ id })
            .map<AdvertMutationResult>('cancelAdvertReservation')
            .then(expectAdvert),
})
