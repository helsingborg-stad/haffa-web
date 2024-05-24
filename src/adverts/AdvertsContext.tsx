import { FC, PropsWithChildren, createContext } from 'react'
import { AdvertsRepository } from './types'

const notProvided = (method: string) => () => {
    throw new Error(`AdvertsContext::${method} is not provided`)
}

export const AdvertsContext = createContext<AdvertsRepository>({
    getAdvert: notProvided('getAdvert'),
    listAdverts: notProvided('listAdverts'),
    createAdvert: notProvided('createAdvert'),
    updateAdvert: notProvided('updateAdvert'),
    patchAdvert: notProvided('patchAdvert'),
    removeAdvert: notProvided('removeAdvert'),
    archiveAdvert: notProvided('archiveAdvert'),
    unarchiveAdvert: notProvided('unarchiveAdvert'),
    reserveAdvert: notProvided('reserveAdvert'),
    cancelAdvertReservation: notProvided('cancelAdvertReservation'),
    collectAdvert: notProvided('collectAdvert'),
    cancelAdvertClaim: notProvided('cancelAdvertClaim'),
    convertAdvertClaim: notProvided('convertAdvertClaim'),
    renewAdvertClaim: notProvided('renewAdvertClaim'),
    returnAdvert: notProvided('returnAdvert'),
    joinAdvertWaitlist: notProvided('joinAdvertWaitlist'),
    leaveAdvertWaitlist: notProvided('leaveAdvertWaitlist'),
    markAdvertAsPicked: notProvided('markAdvertAsPicked'),
    markAdvertAsUnpicked: notProvided('markAdvertAsUnpicked'),
    patchAdvertTags: notProvided('patchAdvertTags'),
})

export const AdvertsProvider: FC<
    PropsWithChildren<{ repository: AdvertsRepository }>
> = ({ repository, children }) => (
    <AdvertsContext.Provider value={repository}>
        {children}
    </AdvertsContext.Provider>
)
