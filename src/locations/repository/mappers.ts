import { AdvertLocation } from 'adverts'

export const createEmptyLocation = (): AdvertLocation => ({
    name: '',
    adress: '',
    zipCode: '',
    city: '',
    country: '',
})

export const normalizeLocation = (l: Partial<AdvertLocation>) => ({
    name: l.name?.trim() ?? '',
    adress: l.adress?.trim() ?? '',
    zipCode: l.zipCode?.trim() ?? '',
    city: l.city?.trim() ?? '',
    country: l.country?.trim() ?? '',
})

export const normalizeLocations = (
    locations: Partial<AdvertLocation>[] | null
): AdvertLocation[] => locations?.map(normalizeLocation) ?? []
