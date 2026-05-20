import type { Notifications } from 'notifications/types'
import type { PhraseContextType } from 'phrases'
import type { PickupLocationRepository } from 'pickup-locations/types'

export const createNotifyingPickupLocationRepository = (
    notifications: Notifications,
    phrase: PhraseContextType['phrase'],
    inner: PickupLocationRepository
): PickupLocationRepository => {
    const wrap =
        <T extends Array<any>, U>(fn: (...args: T) => U) =>
        (...args: T): U =>
            fn(...args)
    return {
        getPickupLocations: wrap(inner.getPickupLocations),
        getPickupLocationsByAdvert: wrap(inner.getPickupLocationsByAdvert),
        updatePickupLocations: (...args) =>
            inner.updatePickupLocations(...args).then((result) => {
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
