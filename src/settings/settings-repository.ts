import { gqlClient } from 'graphql'
import { Category } from 'categories/types'
import { treeVisit } from 'admin/categories/components/tree-lookup'
import {
    getCategoriesQuery,
    getLoginPoliciesQuery,
    setCategoriesMutation,
    setLoginPoliciesMutation,
} from './queries'
import { LoginPolicy, SettingsRepository } from './types'

interface CategoryFlat {
    id: string
    parentId: string
    label: string
    co2kg: number
}

const decodeCategoryTree = (categories: CategoryFlat[]): Category[] => {
    const byParentId = categories.reduce((memo, c) => {
        const l = memo[c.parentId]
        if (!l) {
            // eslint-disable-next-line no-param-reassign
            memo[c.parentId] = [c]
        } else {
            l.push(c)
        }
        return memo
    }, {} as Record<string, CategoryFlat[]>)

    const rec = (pid: string): Category[] =>
        (byParentId[pid] || [])
            .map((c) => ({
                id: c.id,
                label: c.label,
                co2kg: c.co2kg,
                categories: rec(c.id),
            }))
            .filter((v) => v)

    return rec('')
}

const encodeCategoryTree = (categories: Category[]): CategoryFlat[] => {
    const c: CategoryFlat[] = []
    treeVisit(
        categories,
        (c) => c.categories,
        ({ node, parent }) => {
            c.push({
                id: node.id,
                parentId: parent ? parent.id : '',
                label: node.label,
                co2kg: node.co2kg,
            })
        }
    )
    return c
}

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
