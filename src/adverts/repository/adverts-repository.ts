import {
    ifNullThenNotFoundError,
    valueAndValidOrThrowNotFound,
} from '../../errors'
import { gqlClient } from '../../graphql'
import { sanitizeAdvertInput } from './mappers'
import {
    cancelAdvertClaimMutation,
    cancelAdvertReservationMutation,
    collectAdvertMutation,
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

const gql = (token: string, f?: typeof fetch, init?: RequestInit) =>
    gqlClient()
        .init(init)
        .fetch(f)
        .headers({ Authorization: `Bearer ${token}` })

const expectAdvert = (r: AdvertMutationResult): AdvertMutationResult =>
    valueAndValidOrThrowNotFound(r, r && r.advert)

export const createAdvertsRepository = (
    token: string,
    f?: typeof fetch
): AdvertsRepository => ({
    getTerms: async () =>
        gql(token, f)
            .query(getTermsQuery)
            .map<AdvertTerms>('terms')
            .then(ifNullThenNotFoundError),
    getAdvert: async (id) =>
        gql(token, f)
            .query(getAdvertQuery)
            .variables({ id })
            .map<Advert>('getAdvert')
            .then(ifNullThenNotFoundError),
    listAdverts: async (filter, init) =>
        gql(token, f, init)
            .query(listAdvertsQuery)
            .variables({ filter })
            .map<Advert[]>('adverts'),
    createAdvert: async (advert) =>
        gql(token, f)
            .query(createAdvertMutation)
            .variables({ input: sanitizeAdvertInput(advert) })
            .map<AdvertMutationResult>('createAdvert')
            .then(expectAdvert),
    updateAdvert: async (id, advert) =>
        gql(token, f)
            .query(updateAdvertMutation)
            .variables({ id, input: sanitizeAdvertInput(advert) })
            .map<AdvertMutationResult>('updateAdvert')
            .then(expectAdvert),
    removeAdvert: async (id) =>
        gql(token, f)
            .query(removeAdvertMutation)
            .variables({ id })
            .map<AdvertMutationResult>('removeAdvert')
            .then(expectAdvert),
    reserveAdvert: async (id, quantity) =>
        gql(token, f)
            .query(reserveAdvertMutation)
            .variables({ id, quantity })
            .map<AdvertMutationResult>('reserveAdvert')
            .then(expectAdvert),
    cancelAdvertReservation: async (id) =>
        gql(token, f)
            .query(cancelAdvertReservationMutation)
            .variables({ id })
            .map<AdvertMutationResult>('cancelAdvertReservation')
            .then(expectAdvert),
    collectAdvert: async (id, quantity) =>
        gql(token, f)
            .query(collectAdvertMutation)
            .variables({ id, quantity })
            .map<AdvertMutationResult>('collectAdvert')
            .then(expectAdvert),
    cancelAdvertClaim: async (id, claim) =>
        gql(token, f)
            .query(cancelAdvertClaimMutation)
            .variables({ id, by: claim.by, type: claim.type })
            .map<AdvertMutationResult>('cancelAdvertClaim')
            .then(expectAdvert),
})
