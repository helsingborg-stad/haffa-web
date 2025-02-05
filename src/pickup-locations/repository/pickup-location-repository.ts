import {
    PickupLocation,
    PickupLocationRepository,
} from 'pickup-locations/types'
import { ifNullThenNotFoundError } from '../../errors'
import { gqlClient } from '../../graphql'
import {
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
    getPickupLocationsMatchingTags: async (tags) => {
        const s = new Set(tags)
        if (s.size === 0) {
            return []
        }
        return gql(token, f)
            .query(getPickupLocationsQuery)
            .map<PickupLocation[]>('pickupLocations')
            .then(ifNullThenNotFoundError)
            .then((locations) =>
                locations.filter(({ tags }) => tags.some((tag) => s.has(tag)))
            )
    },
    updatePickupLocations: async (locations) =>
        gql(token, f)
            .query(updatePickupLocationsMutation)
            .variables({ input: locations })
            .map<PickupLocation[]>('updatePickupLocations')
            .then(ifNullThenNotFoundError),
})
