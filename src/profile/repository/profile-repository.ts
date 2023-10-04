import { Profile, ProfileRepository } from 'profile/types'
import { ifNullThenNotFoundError } from '../../errors'
import { gqlClient } from '../../graphql'
import { getProfileQuery, updateProfileMutation } from './queries'
import { sanitizeProfileInput } from './mappers'

const gql = (token: string, f?: typeof fetch) =>
    gqlClient()
        .fetch(f)
        .headers({ Authorization: `Bearer ${token}` })

export const createProfileRepository = (
    token: string,
    f?: typeof fetch
): ProfileRepository => ({
    getProfile: async () =>
        gql(token, f)
            .query(getProfileQuery)
            .map<Profile>('profile')
            .then(ifNullThenNotFoundError),
    updateProfile: async (input) =>
        gql(token, f)
            .query(updateProfileMutation)
            .variables({ input: sanitizeProfileInput(input) })
            .map<Profile>('updateProfile'),
})
