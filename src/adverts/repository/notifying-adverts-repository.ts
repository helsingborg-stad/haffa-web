import { AdvertMutationResult, AdvertsRepository } from 'adverts'
import { Notifications } from 'notifications/types'
import { PhraseContextType } from 'phrases'

export const createNotifyingAdvertsRepository = (
    notifications: Notifications,
    phrase: PhraseContextType['phrase'],
    inner: AdvertsRepository
): AdvertsRepository => {
    const wrap =
        <T extends Array<any>, U>(fn: (...args: T) => U) =>
        (...args: T): U =>
            fn(...args)
    const info =
        (key: string, message: string) =>
        (result: AdvertMutationResult): AdvertMutationResult => {
            notifications.info({ message: phrase(key, message) })
            return result
        }
    return {
        getAdvert: wrap(inner.getAdvert),
        listAdverts: wrap(inner.listAdverts),
        createAdvert: (...args) =>
            inner
                .createAdvert(...args)
                .then(
                    info(
                        'NOTIFICATIONS_ADVERT_WAS_CREATED',
                        'Annonsen har skapats'
                    )
                ),
        updateAdvert: (...args) =>
            inner
                .updateAdvert(...args)
                .then(
                    info(
                        'NOTIFICATIONS_ADVERT_WAS_UPDATED',
                        'Annonsen har uppdaterats'
                    )
                ),
        patchAdvert: (...args) => inner.patchAdvert(...args),
        removeAdvert: (...args) =>
            inner
                .removeAdvert(...args)
                .then(
                    info(
                        'NOTIFICATIONS_ADVERT_WAS_REMOVED',
                        'Annonsen har tagits bort'
                    )
                ),
        archiveAdvert: (...args) =>
            inner
                .archiveAdvert(...args)
                .then(
                    info(
                        'NOTIFICATIONS_ADVERT_WAS_ARCHIVED',
                        'Annonsen är nu arkiverad'
                    )
                ),
        unarchiveAdvert: (...args) =>
            inner
                .unarchiveAdvert(...args)
                .then(
                    info(
                        'NOTIFICATIONS_ADVERT_WAS_UNARCHIVED',
                        'Annonsen är återställd från arkivet'
                    )
                ),
        reserveAdvert: (...args) =>
            inner
                .reserveAdvert(...args)
                .then(
                    info(
                        'NOTIFICATIONS_ADVERT_WAS_RESERVED',
                        'Annonsen är reserverad'
                    )
                ),
        cancelAdvertReservation: (...args) =>
            inner
                .cancelAdvertReservation(...args)
                .then(
                    info(
                        'NOTIFICATIONS_ADVERT_RESERVATION_WAS_CANCELLED',
                        'Reservationen är borttagen'
                    )
                ),
        collectAdvert: (...args) =>
            inner
                .collectAdvert(...args)
                .then(
                    info(
                        'NOTIFICATIONS_ADVERT_WAS_COLLECTED',
                        'Annonsartikeln är markerad som uthämtad'
                    )
                ),
        cancelAdvertClaim: (...args) =>
            inner
                .cancelAdvertClaim(...args)
                .then(
                    info(
                        'NOTIFICATIONS_ADVERT_CLAIM_WAS_REMOVED',
                        'Markeringen är borttagningen'
                    )
                ),
        convertAdvertClaim: (...args) =>
            inner
                .convertAdvertClaim(...args)
                .then(
                    info(
                        'NOTIFICATIONS_ADVERT_CLAIM_WAS_CHANGED',
                        'Markeringen har ändrats'
                    )
                ),
        renewAdvertClaim: (...args) =>
            inner
                .renewAdvertClaim(...args)
                .then(
                    info(
                        'NOTIFICATIONS_ADVERT_CLAIM_WAS_CHANGED',
                        'Markeringen har ändrats'
                    )
                ),
        returnAdvert: (...args) =>
            inner
                .returnAdvert(...args)
                .then(
                    info(
                        'NOTIFICATIONS_ADVERT_WAS_RETURNED',
                        'Artikeln har återlämnats'
                    )
                ),
        joinAdvertWaitlist: (...args) =>
            inner
                .joinAdvertWaitlist(...args)
                .then(
                    info(
                        'NOTIFICATIONS_ADVERT_JOIN_WAITLIST',
                        'Du bevakar nu annonsen'
                    )
                ),
        leaveAdvertWaitlist: (...args) =>
            inner
                .leaveAdvertWaitlist(...args)
                .then(
                    info(
                        'NOTIFICATIONS_ADVERT_LEAVE_WAITLIST',
                        'Bevakningen är borttagen'
                    )
                ),
        markAdvertAsPicked: (...args) =>
            inner
                .markAdvertAsPicked(...args)
                .then(
                    info(
                        'NOTIFICATIONS_ADVERT_PICKED',
                        'Annonsen är markerad som plockad'
                    )
                ),
        markAdvertAsUnpicked: (...args) =>
            inner
                .markAdvertAsUnpicked(...args)
                .then(
                    info(
                        'NOTIFICATIONS_ADVERT_UNPICKED',
                        'Annonsen är markerad som oplockad'
                    )
                ),
    }
}
