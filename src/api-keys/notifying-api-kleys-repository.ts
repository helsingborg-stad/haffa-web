import type { Notifications } from 'notifications/types'
import type { PhraseContextType } from 'phrases'
import type { ApiKeysRepository } from './types'

export const createNotifyingApiKeysRepository = (
    notifications: Notifications,
    phrase: PhraseContextType['phrase'],
    inner: ApiKeysRepository
): ApiKeysRepository => ({
    getApiKeys: () => inner.getApiKeys(),
    updateApiKeys: (...args) =>
        inner.updateApiKeys(...args).then((result) => {
            notifications.info({
                message: phrase(
                    'NOTIFICATIONS_APIKEYS_WAS_UPDATED',
                    'API nycklar är uppdaterade'
                ),
            })
            return result
        }),
})
