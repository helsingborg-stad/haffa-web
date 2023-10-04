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
            inner.createAdvert(...args).then(info('', 'Annonsen har skapats')),
        updateAdvert: (...args) =>
            inner
                .updateAdvert(...args)
                .then(info('', 'Annonsen har uppdaterats')),
        removeAdvert: (...args) =>
            inner
                .removeAdvert(...args)
                .then(info('', 'Annonsen har tagits bort')),
        archiveAdvert: (...args) =>
            inner
                .archiveAdvert(...args)
                .then(info('', 'Annonsen är nu arkiverad')),
        unarchiveAdvert: (...args) =>
            inner
                .unarchiveAdvert(...args)
                .then(info('', 'Annonsen är återställd från arkivet')),
        reserveAdvert: (...args) =>
            inner
                .reserveAdvert(...args)
                .then(info('', 'Annonsen är reserverad')),
        cancelAdvertReservation: (...args) =>
            inner
                .cancelAdvertReservation(...args)
                .then(info('', 'Reservationen är borttagen')),
        collectAdvert: (...args) =>
            inner
                .collectAdvert(...args)
                .then(info('', 'Annonsartikeln är makerad som uthämtad')),
        cancelAdvertClaim: (...args) =>
            inner
                .cancelAdvertClaim(...args)
                .then(info('', 'Markeringen är borttagningen')),
        convertAdvertClaim: (...args) =>
            inner
                .convertAdvertClaim(...args)
                .then(info('', 'Markeringen har ändrats')),
    }
}
