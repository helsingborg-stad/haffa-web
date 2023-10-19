import { Notifications } from 'notifications/types'
import { PhraseContextType } from 'phrases'
import { OptionsRepository } from './types'

export const createNotifyingOptionsRepository = (
    notifications: Notifications,
    phrase: PhraseContextType['phrase'],
    inner: OptionsRepository
): OptionsRepository => ({
    getOptions: (name) => inner.getOptions(name),
    updateOptions: (...args) =>
        inner.updateOptions(...args).then((result) => {
            notifications.info({
                message: phrase(
                    'NOTIFICATIONS_OPTIONS_WAS_UPDATED',
                    'Dina ändringar är sparade'
                ),
            })
            return result
        }),
})
