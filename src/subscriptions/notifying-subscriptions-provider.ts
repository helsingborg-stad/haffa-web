import { Notifications } from 'notifications/types'
import { PhraseContextType } from 'phrases'
import { SubscriptionsRepository } from './types'

export const createNotifyingSubscriptionsRepository = (
    notifications: Notifications,
    phrase: PhraseContextType['phrase'],
    inner: SubscriptionsRepository
): SubscriptionsRepository => ({
    getAdvertSubscriptions: () => inner.getAdvertSubscriptions(),
    addAdvertSubscription: (...args) =>
        inner.addAdvertSubscription(...args).then(
            (result) => (
                notifications.info({
                    message: phrase(
                        'NOTIFICATIONS_ADVERT_SUBSCRIPTION_WAS_ADDED',
                        'Din bevakning är skapad'
                    ),
                }),
                result
            )
        ),
    removeAdvertSubscription: (...args) =>
        inner.removeAdvertSubscription(...args).then(
            (result) => (
                notifications.info({
                    message: phrase(
                        'NOTIFICATIONS_ADVERT_SUBSCRIPTION_WAS_REMOVED',
                        'Din bevakning är borttagen'
                    ),
                }),
                result
            )
        ),
})
