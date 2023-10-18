import { OptionsRepository } from 'options/types'
import { gqlClient } from 'graphql'
import { getOptionsQuery, updateOptionsMutation } from './queries'
import type { Option } from './types'

const gql = (token: string, f?: typeof fetch, init?: RequestInit) =>
    gqlClient()
        .init(init)
        .fetch(f)
        .headers({ Authorization: `Bearer ${token}` })

export const createOptionsRepository = (
    name: string,
    token: string,
    f?: typeof fetch
): OptionsRepository => ({
    getOptions: async () =>
        gql(token, f)
            .query(getOptionsQuery)
            .variables({ name })
            .map<Option[]>('options'),
    updateOptions: async (options) =>
        gql(token, f)
            .query(updateOptionsMutation)
            .variables({ name, input: options })
            .map('updateOptions'),
})
