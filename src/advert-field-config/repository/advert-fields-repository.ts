import {
    AdvertFieldConfig,
    AdvertFieldRepository,
} from 'advert-field-config/types'
import { ifNullThenNotFoundError } from '../../errors'
import { gqlClient } from '../../graphql'
import { getFieldsQuery, updateFieldsMutation } from './queries'
import { normalizeFieldConfig } from './mappers'

const gql = (token: string, f?: typeof fetch, init?: RequestInit) =>
    gqlClient()
        .init(init)
        .fetch(f)
        .headers({ Authorization: `Bearer ${token}` })

export const createAdvertFieldRepository = (
    token: string,
    f?: typeof fetch
): AdvertFieldRepository => ({
    getFieldConfig: async () =>
        gql(token, f)
            .query(getFieldsQuery)
            .map<AdvertFieldConfig>('advertFieldConfig')
            .then(ifNullThenNotFoundError)
            .then((value) => normalizeFieldConfig(value)),
    updateFieldConfig: async (fieldConfig) =>
        gql(token, f)
            .query(updateFieldsMutation)
            .variables({ input: fieldConfig })
            .map<AdvertFieldConfig>('updateAdvertConfig')
            .then(ifNullThenNotFoundError),
})
