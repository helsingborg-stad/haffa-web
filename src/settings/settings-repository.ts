import { gqlClient } from 'graphql'
import { CategoryFlat } from 'categories/types'

import { decodeCategoryTree, encodeCategoryTree } from 'categories/mappers'
import { LoginPolicy } from 'login-policies/types'
import {
    getCategoriesQuery,
    getLoginPoliciesQuery,
    setCategoriesMutation,
    setLoginPoliciesMutation,
} from './queries'
import { SettingsRepository } from './types'

const gql = (token: string, f?: typeof fetch, init?: RequestInit) =>
    gqlClient()
        .init(init)
        .fetch(f)
        .headers({ Authorization: `Bearer ${token}` })

export const createSettingsRepository = (
    token: string,
    f?: typeof fetch
): SettingsRepository => ({
    getLoginPolicies: async () =>
        gql(token, f)
            .query(getLoginPoliciesQuery)
            .map<LoginPolicy[]>('loginPolicies'),
    updateLoginPolicies: async (policies) =>
        gql(token, f)
            .query(setLoginPoliciesMutation)
            .variables({ input: policies })
            .map<LoginPolicy[]>('updateLoginPolicies'),
    getCategories: async () =>
        gql(token, f)
            .query(getCategoriesQuery)
            .map<CategoryFlat[]>('categories')
            .then(decodeCategoryTree),
    updateCategories: async (categories) =>
        gql(token, f)
            .query(setCategoriesMutation)
            .variables({ input: encodeCategoryTree(categories) })
            .map<CategoryFlat[]>('updateCategories')
            .then(decodeCategoryTree),
})
