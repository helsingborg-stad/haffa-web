import { AdvertFieldRepository } from 'advert-field-config/types'
import { Notifications } from 'notifications/types'
import { PhraseContextType } from 'phrases'

export const createNotifyingAdvertFieldRepository = (
    notifications: Notifications,
    phrase: PhraseContextType['phrase'],
    inner: AdvertFieldRepository
): AdvertFieldRepository => {
    const wrap =
        <T extends Array<any>, U>(fn: (...args: T) => U) =>
        (...args: T): U =>
            fn(...args)
    return {
        getFieldConfig: wrap(inner.getFieldConfig),
        updateFieldConfig: (...args) =>
            inner.updateFieldConfig(...args).then((result) => {
                notifications.info({
                    message: phrase(
                        'NOTIFICATIONS_ADVERT_FIELD_CONFIG_WAS_UPDATED',
                        'Definitionerna är uppdaterade'
                    ),
                })
                return result
            }),
    }
}
