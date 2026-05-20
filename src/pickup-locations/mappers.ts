import { normalizeLocation } from 'locations'
import type { PickupLocation } from './types'

export const normalizePickupLocation = (
    location: Partial<PickupLocation>
): PickupLocation => ({
    ...normalizeLocation(location),
    notifyEmail: location.notifyEmail?.trim() ?? '',
    trackingName: location.trackingName?.trim() ?? '',
    tags: location.tags?.map((v) => v?.trim() ?? '') ?? [],
})
