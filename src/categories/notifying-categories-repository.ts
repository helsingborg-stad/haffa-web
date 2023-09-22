import { Notifications } from 'notifications/types'
import { PhraseContextType } from 'phrases/PhraseContext'
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
                message: phrase('', 'Inställningarna är sparade'),
            })
            return result
        }),
})
