import { gqlClient } from 'graphql'
import { decodeCategoryTree, encodeCategoryTree } from './mappers'
import { CategoriesRepository, CategoryFlat } from './types'
import { getCategoriesQuery, setCategoriesMutation } from './queries'

const gql = (token: string, f?: typeof fetch, init?: RequestInit) =>
    gqlClient()
        .init(init)
        .fetch(f)
        .headers({ Authorization: `Bearer ${token}` })

export const createCategoriesRepository = (
    token: string,
    f?: typeof fetch
): CategoriesRepository => ({
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
