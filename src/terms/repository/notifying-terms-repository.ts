import type { Notifications } from 'notifications/types'
import type { PhraseContextType } from 'phrases'
import type { TermsRepository } from 'terms/types'

export const createNotifyingTermsRepository = (
    notifications: Notifications,
    phrase: PhraseContextType['phrase'],
    inner: TermsRepository
): TermsRepository => {
    const wrap =
        <T extends Array<any>, U>(fn: (...args: T) => U) =>
        (...args: T): U =>
            fn(...args)
    return {
        getTerms: wrap(inner.getTerms),
        updateTerms: (...args) =>
            inner.updateTerms(...args).then((result) => {
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
