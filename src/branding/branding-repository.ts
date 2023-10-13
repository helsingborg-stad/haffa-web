import { BrandingRepository, Option } from 'branding/types'
import { gqlClient } from 'graphql'
import {
    getBrandingOptionsQuery,
    updateBrandingOptionsMutation,
} from './queries'

const gql = (token: string, f?: typeof fetch, init?: RequestInit) =>
    gqlClient()
        .init(init)
        .fetch(f)
        .headers({ Authorization: `Bearer ${token}` })

export const createBrandingRepository = (
    token: string,
    f?: typeof fetch
): BrandingRepository => ({
    getBrandingOptions: async () =>
        gql(token, f)
            .query(getBrandingOptionsQuery)
            .map<Option[]>('brandingOptions'),
    updateBrandingOptions: async (options) =>
        gql(token, f)
            .query(updateBrandingOptionsMutation)
            .variables({ input: options })
            .map<Option[]>('updateBrandingOptions'),
})
