import { PickupLocation } from 'pickup-locations/types'

export const createEmptyPickupLocation = (): PickupLocation => ({
    name: '',
    adress: '',
    zipCode: '',
    city: '',
    country: '',
    notifyEmail: '',
    trackingName: '',
    tags: [],
})

export const normalizePickupLocations = (
    locations: Partial<PickupLocation>[] | null
): PickupLocation[] =>
    locations?.map((l) => ({
        name: l.name?.trim() ?? '',
        adress: l.adress?.trim() ?? '',
        zipCode: l.zipCode?.trim() ?? '',
        city: l.city?.trim() ?? '',
        country: l.country?.trim() ?? '',
        notifyEmail: l.notifyEmail?.trim() ?? '',
        trackingName: l.trackingName?.trim() ?? '',
        tags: (Array.isArray(l.tags) ? l.tags : [])
            .filter((v) => v)
            .map((s) => s.toString().trim()),
    })) ?? []
