import { decodeCategoryTree } from 'categories/mappers'
import {
    ifNullThenNotFoundError,
    valueAndValidOrThrowNotFound,
} from '../../errors'
import { gqlClient } from '../../graphql'
import { sanitizeAdvertInput } from './mappers'
import {
    archiveAdvertMutation,
    cancelAdvertClaimMutation,
    cancelAdvertReservationMutation,
    collectAdvertMutation,
    convertAdvertClaimMutation,
    createAdvertMutation,
    getAdvertQuery,
    joinAdvertWaitlistMutation,
    leaveAdvertWaitlistMutation,
    listAdvertsQuery,
    markAdvertAsPickedMutation,
    markAdvertAsUnpickedMutation,
    patchAdvertTagsMutation,
    removeAdvertMutation,
    renewAdvertClaimMutation,
    reserveAdvertMutation,
    returnAdvertMutation,
    unarchiveAdvertMutation,
    updateAdvertMutation,
} from './queries'
import {
    Advert,
    AdvertListFlat,
    AdvertMutationResult,
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
            .map<AdvertListFlat>('adverts')
            .then((result) => ({
                ...result,
                // categories are transported as flat records
                // convert to our internal treelike domain
                categories: decodeCategoryTree(result.categories),
            })),
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
    patchAdvert: async (id, patch) =>
        gql(token, f)
            .query(updateAdvertMutation)
            .variables({ id, input: patch })
            .map<AdvertMutationResult>('updateAdvert')
            .then(expectAdvert),
    removeAdvert: async (id) =>
        gql(token, f)
            .query(removeAdvertMutation)
            .variables({ id })
            .map<AdvertMutationResult>('removeAdvert')
            .then(expectAdvert),
    archiveAdvert: async (id) =>
        gql(token, f)
            .query(archiveAdvertMutation)
            .variables({ id })
            .map<AdvertMutationResult>('archiveAdvert')
            .then(expectAdvert),
    unarchiveAdvert: async (id) =>
        gql(token, f)
            .query(unarchiveAdvertMutation)
            .variables({ id })
            .map<AdvertMutationResult>('unarchiveAdvert')
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
    cancelAdvertClaim: async (id, claim, impersonate) =>
        gql(token, f)
            .query(cancelAdvertClaimMutation)
            .variables({ id, by: claim.by, type: claim.type, impersonate })
            .map<AdvertMutationResult>('cancelAdvertClaim')
            .then(expectAdvert),
    convertAdvertClaim: async (id, claim, newType, impersonate) =>
        gql(token, f)
            .query(convertAdvertClaimMutation)
            .variables({
                id,
                by: claim.by,
                type: claim.type,
                newType,
                impersonate,
            })
            .map<AdvertMutationResult>('convertAdvertClaim')
            .then(expectAdvert),
    renewAdvertClaim: async (id, claim, impersonate) =>
        gql(token, f)
            .query(renewAdvertClaimMutation)
            .variables({ id, by: claim.by, type: claim.type, impersonate })
            .map<AdvertMutationResult>('renewAdvertClaim')
            .then(expectAdvert),
    returnAdvert: async (id) =>
        gql(token, f)
            .query(returnAdvertMutation)
            .variables({ id })
            .map<AdvertMutationResult>('returnAdvert')
            .then(expectAdvert),
    joinAdvertWaitlist: async (id) =>
        gql(token, f)
            .query(joinAdvertWaitlistMutation)
            .variables({ id })
            .map<AdvertMutationResult>('joinAdvertWaitlist')
            .then(expectAdvert),
    leaveAdvertWaitlist: async (id) =>
        gql(token, f)
            .query(leaveAdvertWaitlistMutation)
            .variables({ id })
            .map<AdvertMutationResult>('leaveAdvertWaitlist')
            .then(expectAdvert),
    markAdvertAsPicked: async (id) =>
        gql(token, f)
            .query(markAdvertAsPickedMutation)
            .variables({ id })
            .map<AdvertMutationResult>('markAdvertAsPicked')
            .then(expectAdvert),
    markAdvertAsUnpicked: async (id) =>
        gql(token, f)
            .query(markAdvertAsUnpickedMutation)
            .variables({ id })
            .map<AdvertMutationResult>('markAdvertAsUnpicked')
            .then(expectAdvert),
    patchAdvertTags: async (id, { add, remove }) =>
        gql(token, f)
            .query(patchAdvertTagsMutation)
            .variables({ id, add, remove })
            .map<AdvertMutationResult>('patchAdvertTags')
            .then(expectAdvert),
})
