import type { Notifications } from 'notifications/types'
import type { PhraseContextType } from 'phrases'
import type { TagsRepository } from 'tags/types'

export const createNotifyingTagsRepository = (
    notifications: Notifications,
    phrase: PhraseContextType['phrase'],
    inner: TagsRepository
): TagsRepository => {
    const wrap =
        <T extends Array<any>, U>(fn: (...args: T) => U) =>
        (...args: T): U =>
            fn(...args)
    return {
        getTagDescriptions: wrap(inner.getTagDescriptions),
        updateTagDescriptions: (...args) =>
            inner.updateTagDescriptions(...args).then((result) => {
                notifications.info({
                    message: phrase(
                        'NOTIFICATIONS_TERMS_WAS_UPDATED',
                        'Definitionerna är uppdaterade'
                    ),
                })
                return result
            }),
    }
}
