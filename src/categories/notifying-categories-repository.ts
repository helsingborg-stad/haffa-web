import { Notifications } from 'notifications/types'
import { PhraseContextType } from 'phrases'
import { CategoriesRepository } from './types'

export const createNotifyingCategoriesRepository = (
    notifications: Notifications,
    phrase: PhraseContextType['phrase'],
    inner: CategoriesRepository
): CategoriesRepository => ({
    getCategories: () => inner.getCategories(),
    updateCategories: (...args) =>
        inner.updateCategories(...args).then((result) => {
            notifications.info({
                message: phrase(
                    'NOTIFICATIONS_CATEGORIES_WAS_UPDATED',
                    'Inställningarna är sparade'
                ),
            })
            return result
        }),
})
