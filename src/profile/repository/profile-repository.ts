import type { Profile, ProfileRepository } from 'profile/types'
import { ifNullThenNotFoundError } from '../../errors'
import { gqlClient, type OperationResult } from '../../graphql'
import { sanitizeProfileInput } from './mappers'
import {
    getProfileQuery,
    removeProfileMutation,
    updateProfileMutation,
} from './queries'

const gql = (token: string, f?: typeof fetch, init?: RequestInit) =>
    gqlClient()
        .init(init)
        .fetch(f)
        .headers({ Authorization: `Bearer ${token}` })

export const createProfileRepository = (
    token: string,
    f?: typeof fetch
): ProfileRepository => ({
    getProfile: async (init) =>
        gql(token, f, init)
            .query(getProfileQuery)
            .map<Profile>('profile')
            .then(ifNullThenNotFoundError),
    updateProfile: async (input, init) =>
        gql(token, f, init)
            .query(updateProfileMutation)
            .variables({ input: sanitizeProfileInput(input) })
            .map<Profile>('updateProfile'),
    removeProfile: async (input, init) =>
        gql(token, f, init)
            .query(removeProfileMutation)
            .variables({ input })
            .map<OperationResult>('removeProfile'),
})
