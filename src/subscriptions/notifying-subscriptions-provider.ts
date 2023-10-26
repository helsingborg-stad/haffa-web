import { Notifications } from 'notifications/types'
import { PhraseContextType } from 'phrases'
import { SubscriptionsRepository } from './types'

export const createNotifyingSubscriptionsRepository = (
    { notifyInvocation }: Notifications,
    phrase: PhraseContextType['phrase'],
    inner: SubscriptionsRepository
): SubscriptionsRepository => ({
    getAdvertSubscriptions: () => inner.getAdvertSubscriptions(),
    addAdvertSubscription: (...args) =>
        notifyInvocation(() => inner.addAdvertSubscription(...args), {
            message: phrase(
                'NOTIFICATIONS_ADVERT_SUBSCRIPTION_WAS_ADDED',
                'Din bevakning är skapad'
            ),
        }),
    removeAdvertSubscription: (...args) =>
        notifyInvocation(() => inner.removeAdvertSubscription(...args), {
            message: phrase(
                'NOTIFICATIONS_ADVERT_SUBSCRIPTION_WAS_REMOVED',
                'Din bevakning är borttagen'
            ),
        }),
})
