import { gqlClient } from 'graphql'

import { getLoginPoliciesQuery, setLoginPoliciesMutation } from './queries'
import { LoginPolicy, LoginPoliciesRepository } from './types'

const gql = (token: string, f?: typeof fetch, init?: RequestInit) =>
    gqlClient()
        .init(init)
        .fetch(f)
        .headers({ Authorization: `Bearer ${token}` })

export const createLoginPoliciesRepository = (
    token: string,
    f?: typeof fetch
): LoginPoliciesRepository => ({
    getLoginPolicies: async () =>
        gql(token, f)
            .query(getLoginPoliciesQuery)
            .map<LoginPolicy[]>('loginPolicies'),
    updateLoginPolicies: async (policies) =>
        gql(token, f)
            .query(setLoginPoliciesMutation)
            .variables({ input: policies })
            .map<LoginPolicy[]>('updateLoginPolicies'),
})
