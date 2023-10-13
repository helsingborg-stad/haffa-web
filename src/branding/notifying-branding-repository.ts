import { Notifications } from 'notifications/types'
import { PhraseContextType } from 'phrases'
import { BrandingRepository } from './types'

export const createNotifyingBrandingRepository = (
    notifications: Notifications,
    phrase: PhraseContextType['phrase'],
    inner: BrandingRepository
): BrandingRepository => ({
    getBrandingOptions: () => inner.getBrandingOptions(),
    updateBrandingOptions: (...args) =>
        inner.updateBrandingOptions(...args).then((result) => {
            notifications.info({
                message: phrase('', 'Temat är uppdaterad'),
            })
            return result
        }),
})
