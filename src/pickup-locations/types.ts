import type { AdvertLocation } from '../adverts/types'

export interface PickupLocation extends AdvertLocation {
    notifyEmail: string
    trackingName: string
    tags: string[]
}
export interface PickupLocationRepository {
    getPickupLocations: () => Promise<PickupLocation[]>
    getPickupLocationsMatchingTags: (
        tags: string[]
    ) => Promise<PickupLocation[]>
    updatePickupLocations: (
        locations: PickupLocation[]
    ) => Promise<PickupLocation[]>
}
