import { Profile, ProfileRepository } from 'profile/types'
import { ifNullThenNotFoundError } from '../../errors'
import { gqlClient } from '../../graphql'
import { getProfileQuery, updateProfileMutation } from './queries'

const gql = (token: string) =>
    gqlClient().headers({ Authorization: `Bearer ${token}` })

export const createProfileRepository = (token: string): ProfileRepository => ({
    getProfile: async () =>
        gql(token)
            .query(getProfileQuery)
            .map<Profile>('profile')
            .then(ifNullThenNotFoundError),
    updateProfile: async (input) =>
        gql(token)
            .query(updateProfileMutation)
            .variables({ input })
            .map<Profile>('updateProfile'),
})
