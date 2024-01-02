export interface AdvertSubscriptionFilter {
    search?: string
    categories?: string[]
    tags?: string[]
}

export interface AdvertSubscription {
    subscriptionId: string
    createdAt: string
    lastNotifiedAt?: string
    filter: AdvertSubscriptionFilter
}

export interface SubscriptionsRepository {
    getAdvertSubscriptions: () => Promise<AdvertSubscription[]>
    addAdvertSubscription: (
        filter: AdvertSubscriptionFilter
    ) => Promise<AdvertSubscription | null>
    removeAdvertSubscription: (
        subscriptionId: string
    ) => Promise<AdvertSubscription | null>
}

export interface SubscriptionsContextType extends SubscriptionsRepository {
    canManageSubscriptions: () => boolean
    canSubscribeToFilter: (filter: AdvertSubscriptionFilter) => boolean
}
