import { gqlClient } from 'graphql'
import { AdvertSubscription, SubscriptionsRepository } from './types'
import {
    addAdvertSubscriptionMutation,
    getAdvertSubscriptionsQuery,
    removeAdvertSubscriptionMutation,
} from './queries'

const gql = (token: string, f?: typeof fetch, init?: RequestInit) =>
    gqlClient()
        .init(init)
        .fetch(f)
        .headers({ Authorization: `Bearer ${token}` })

export const createSubscriptionsRepository = (
    token: string,
    f?: typeof fetch
): SubscriptionsRepository => ({
    getAdvertSubscriptions: async () =>
        gql(token, f)
            .query(getAdvertSubscriptionsQuery)
            .map<AdvertSubscription[]>('advertSubscriptions'),
    addAdvertSubscription: async (filter) =>
        gql(token, f)
            .query(addAdvertSubscriptionMutation)
            .variables({ filter })
            .map<AdvertSubscription | null>('addAdvertSubscription'),
    removeAdvertSubscription: async (subscriptionId) =>
        gql(token, f)
            .query(removeAdvertSubscriptionMutation)
            .variables({ subscriptionId })
            .map<AdvertSubscription | null>('removeAdvertSubscription'),
})
