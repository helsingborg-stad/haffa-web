import { createLocationRepository } from './repository/location-repository'
import { createNotifyingLocationRepository } from './repository/notifying-location-repository'
import { LocationContext, LocationProvider } from './LocationContext'
import {
    createEmptyLocation,
    normalizeLocation,
    normalizeLocations,
} from './repository/mappers'

export { LocationContext, LocationProvider }
export { createLocationRepository, createNotifyingLocationRepository }
export { createEmptyLocation, normalizeLocation, normalizeLocations }
