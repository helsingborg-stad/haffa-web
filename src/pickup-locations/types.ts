import type { AdvertLocation } from '../adverts/types'

export interface PickupLocation extends AdvertLocation {
    notifyEmail: string
    tags: string[]
}
export interface PickupLocationRepository {
    getPickupLocations: () => Promise<PickupLocation[]>
    updatePickupLocations: (
        locations: PickupLocation[]
    ) => Promise<PickupLocation[]>
}
