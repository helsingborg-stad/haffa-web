import { AdvertFilterInput } from 'adverts'

export interface SubscriptionsContextType extends SubscriptionsRepository {
    canManageSubscriptions: () => boolean
    canSubscribeToFilter: (filter: AdvertFilterInput) => boolean
}

export interface SubscriptionsRepository {
    addAdvertFilterSubscription: (filter: AdvertFilterInput) => Promise<any>
}
