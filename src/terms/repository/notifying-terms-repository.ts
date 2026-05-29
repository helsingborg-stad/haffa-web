import type { Notifications } from 'notifications/types'
import type { PhraseContextType } from 'phrases'
import type { TermsRepository } from 'terms/types'

export const createNotifyingTermsRepository = (
    notifications: Notifications,
    phrase: PhraseContextType['phrase'],
    inner: TermsRepository
): TermsRepository => {
    return {
        getTerms: (...args) => inner.getTerms(...args),
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
