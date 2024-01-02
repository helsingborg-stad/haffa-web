import { FC, PropsWithChildren, createContext } from 'react'
import { LocationRepository } from './types'

const notProvided = (method: string) => () => {
    throw new Error(`LocationContext::${method} is not provided`)
}

export const LocationContext = createContext<LocationRepository>({
    getLocations: notProvided('getLocations'),
    updateLocations: notProvided('updateLocations'),
})

export const LocationProvider: FC<
    PropsWithChildren<{ repository: LocationRepository }>
> = ({ repository, children }) => (
    <LocationContext.Provider value={repository}>
        {children}
    </LocationContext.Provider>
)
