import { FC, PropsWithChildren, createContext } from 'react'
import { PickupLocationRepository } from './types'

const notProvided = (method: string) => () => {
    throw new Error(`PickupLocationContext::${method} is not provided`)
}

export const PickupLocationContext = createContext<PickupLocationRepository>({
    getPickupLocations: notProvided('getPickupLocations'),
    getPickupLocationsByAdvert: notProvided('getPickupLocationsByAdvert'),
    updatePickupLocations: notProvided('updatePickupLocations'),
})

export const PickupLocationProvider: FC<
    PropsWithChildren<{ repository: PickupLocationRepository }>
> = ({ repository, children }) => (
    <PickupLocationContext.Provider value={repository}>
        {children}
    </PickupLocationContext.Provider>
)
