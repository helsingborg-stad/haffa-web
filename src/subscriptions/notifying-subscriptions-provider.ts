import { Notifications } from 'notifications/types'
import { PhraseContextType } from 'phrases'
import { SubscriptionsRepository } from './types'

export const createNotifyingSubscriptionsRepository = (
    notifications: Notifications,
    phrase: PhraseContextType['phrase'],
    inner: SubscriptionsRepository
): SubscriptionsRepository => ({
    addAdvertFilterSubscription: (...args) =>
        inner.addAdvertFilterSubscription(...args).then(
            (result) => (
                notifications.info({
                    message: phrase(
                        'NOTIFICATIONS_ADVERT_FILTER_SUBSCRIPTION_WAS_ADDED',
                        'Din bevakning är skapad'
                    ),
                }),
                result
            )
        ),
})
