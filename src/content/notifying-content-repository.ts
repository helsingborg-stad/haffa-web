import { Notifications } from 'notifications/types'
import { PhraseContextType } from 'phrases'
import { ContentRepository } from './types'

export const createNotifyingContentRepository = (
    notifications: Notifications,
    phrase: PhraseContextType['phrase'],
    inner: ContentRepository
): ContentRepository => ({
    getComposition: () => inner.getComposition(),
    updateComposition: (...args) =>
        inner.updateComposition(...args).then((result) => {
            notifications.info({
                message: phrase(
                    'NOTIFICATIONS_CONTENT_WAS_UPDATED',
                    'Innehållet är uppdaterat'
                ),
            })
            return result
        }),
})
