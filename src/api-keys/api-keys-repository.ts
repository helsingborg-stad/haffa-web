import { gqlClient } from 'graphql'
import { ApiKey, ApiKeysRepository } from './types'
import { getApiKeysQuery, updateApiKeysMutation } from './queries'

const gql = (token: string, f?: typeof fetch, init?: RequestInit) =>
    gqlClient()
        .init(init)
        .fetch(f)
        .headers({ Authorization: `Bearer ${token}` })

export const createApiKeysRepository = (
    token: string,
    f?: typeof fetch
): ApiKeysRepository => ({
    getApiKeys: async () =>
        gql(token, f).query(getApiKeysQuery).map<ApiKey[]>('apiKeys'),
    updateApiKeys: async (apiKeys) =>
        gql(token, f)
            .query(updateApiKeysMutation)
            .variables({ input: apiKeys })
            .map<ApiKey[]>('updateApiKeys'),
})
