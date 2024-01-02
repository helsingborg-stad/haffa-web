import { LocationRepository } from 'locations/types'
import { AdvertLocation } from 'adverts'
import { ifNullThenNotFoundError } from '../../errors'
import { gqlClient } from '../../graphql'
import { getLocationsQuery, updateLocationsMutation } from './queries'

const gql = (token: string, f?: typeof fetch, init?: RequestInit) =>
    gqlClient()
        .init(init)
        .fetch(f)
        .headers({ Authorization: `Bearer ${token}` })

export const createLocationRepository = (
    token: string,
    f?: typeof fetch
): LocationRepository => ({
    getLocations: async () =>
        gql(token, f)
            .query(getLocationsQuery)
            .map<AdvertLocation[]>('locations')
            .then(ifNullThenNotFoundError),
    updateLocations: async (locations) =>
        gql(token, f)
            .query(updateLocationsMutation)
            .variables({ input: locations })
            .map<AdvertLocation[]>('updateLocations')
            .then(ifNullThenNotFoundError),
})
