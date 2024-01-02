import { LocationRepository } from 'locations/types'
import { Notifications } from 'notifications/types'
import { PhraseContextType } from 'phrases'

export const createNotifyingLocationRepository = (
    notifications: Notifications,
    phrase: PhraseContextType['phrase'],
    inner: LocationRepository
): LocationRepository => {
    const wrap =
        <T extends Array<any>, U>(fn: (...args: T) => U) =>
        (...args: T): U =>
            fn(...args)
    return {
        getLocations: wrap(inner.getLocations),
        updateLocations: (...args) =>
            inner.updateLocations(...args).then((result) => {
                notifications.info({
                    message: phrase(
                        'NOTIFICATIONS_LOCATION_WAS_UPDATED',
                        'Adressregistret uppdaterades'
                    ),
                })
                return result
            }),
    }
}
