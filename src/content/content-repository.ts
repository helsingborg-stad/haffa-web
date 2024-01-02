import { gqlClient } from 'graphql'
import type { ContentRepository, ViewComposition } from './types'
import { getCompositionQuery, updateCompositionMutation } from './queries'
import { normalizeComposition } from './mappers'

const gql = (token: string, f?: typeof fetch, init?: RequestInit) =>
    gqlClient()
        .init(init)
        .fetch(f)
        .headers({ Authorization: `Bearer ${token}` })

export const createContentRepository = (
    token: string,
    f?: typeof fetch
): ContentRepository => ({
    getComposition: async () =>
        gql(token, f)
            .query(getCompositionQuery)
            .map<ViewComposition>('viewComposition')
            .then((composition) => normalizeComposition(composition)),
    updateComposition: async (composition) =>
        gql(token, f)
            .query(updateCompositionMutation)
            .variables({ input: normalizeComposition(composition) })
            .map<ViewComposition>('updateComposition'),
})
