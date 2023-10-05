import { Profile, ProfileRepository } from 'profile/types'
import { ifNullThenNotFoundError } from '../../errors'
import { gqlClient } from '../../graphql'
import { getProfileQuery, updateProfileMutation } from './queries'
import { sanitizeProfileInput } from './mappers'

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
})
