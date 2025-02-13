import { TagDescription, TagsRepository } from 'tags/types'
import { ifNullThenNotFoundError } from '../../errors'
import { gqlClient } from '../../graphql'
import {
    getTagDescriptionsQuery,
    updateTagDescriptionsMutation,
} from './queries'

const gql = (token: string, f?: typeof fetch, init?: RequestInit) =>
    gqlClient()
        .init(init)
        .fetch(f)
        .headers({ Authorization: `Bearer ${token}` })

export const createTagsRepository = (
    token: string,
    f?: typeof fetch
): TagsRepository => ({
    getTagDescriptions: async () =>
        gql(token, f)
            .query(getTagDescriptionsQuery)
            .map<TagDescription[]>('tagDescriptions')
            .then(ifNullThenNotFoundError),
    updateTagDescriptions: async (tagDescriptions) =>
        gql(token, f)
            .query(updateTagDescriptionsMutation)
            .variables({ input: tagDescriptions })
            .map<TagDescription[]>('updateTagDescriptions')
            .then(ifNullThenNotFoundError),
})
