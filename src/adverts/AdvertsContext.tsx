import { FC, PropsWithChildren, createContext } from 'react'
import { AdvertsRepository } from './types'

const notProvided = (method: string) => () => {
    throw new Error(`AdvertsContext::${method} is not provided`)
}

export const AdvertsContext = createContext<AdvertsRepository>({
    getTerms: notProvided('getTerms'),
    getAdvert: notProvided('getAdvert'),
    listAdverts: notProvided('listAdverts'),
    createAdvert: notProvided('createAdvert'),
    updateAdvert: notProvided('updateAdvert'),
    reserveAdvert: notProvided('reserveAdvert'),
    cancelAdvertReservation: notProvided('cancelAdvertReservation'),
})

export const AdvertsProvider: FC<
    PropsWithChildren<{ repository: AdvertsRepository }>
> = ({ repository, children }) => (
    <AdvertsContext.Provider value={repository}>
        {children}
    </AdvertsContext.Provider>
)
