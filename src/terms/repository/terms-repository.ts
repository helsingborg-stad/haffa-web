import { Terms, TermsRepository } from 'terms/types'
import { ifNullThenNotFoundError } from '../../errors'
import { gqlClient } from '../../graphql'
import { getTermsQuery, updateTermsMutation } from './queries'

const gql = (token: string, f?: typeof fetch, init?: RequestInit) =>
    gqlClient()
        .init(init)
        .fetch(f)
        .headers({ Authorization: `Bearer ${token}` })

export const createTermsRepository = (
    token: string,
    f?: typeof fetch
): TermsRepository => ({
    getTerms: async () =>
        gql(token, f)
            .query(getTermsQuery)
            .map<Terms>('terms')
            .then(ifNullThenNotFoundError),
    updateTerms: async (terms) =>
        gql(token, f)
            .query(updateTermsMutation)
            .variables({ input: terms })
            .map<Terms>('updateTerms')
            .then(ifNullThenNotFoundError),
})
