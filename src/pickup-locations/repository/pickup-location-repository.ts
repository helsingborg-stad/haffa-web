import {
    PickupLocation,
    PickupLocationRepository,
} from 'pickup-locations/types'
import { ifNullThenNotFoundError } from '../../errors'
import { gqlClient } from '../../graphql'
import {
    getPickupLocationsByAdvertQuery,
    getPickupLocationsQuery,
    updatePickupLocationsMutation,
} from './queries'

const gql = (token: string, f?: typeof fetch, init?: RequestInit) =>
    gqlClient()
        .init(init)
        .fetch(f)
        .headers({ Authorization: `Bearer ${token}` })

export const createPickupLocationRepository = (
    token: string,
    f?: typeof fetch
): PickupLocationRepository => ({
    getPickupLocations: async () =>
        gql(token, f)
            .query(getPickupLocationsQuery)
            .map<PickupLocation[]>('pickupLocations')
            .then(ifNullThenNotFoundError),
    getPickupLocationsByAdvert: async (advert) =>
        gql(token, f)
            .query(getPickupLocationsByAdvertQuery)
            .variables({ id: advert.id })
            .map<PickupLocation[]>('pickupLocationsByAdvert')
            .then(ifNullThenNotFoundError),
    updatePickupLocations: async (locations) =>
        gql(token, f)
            .query(updatePickupLocationsMutation)
            .variables({ input: locations })
            .map<PickupLocation[]>('updatePickupLocations')
            .then(ifNullThenNotFoundError),
})
