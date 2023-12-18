import { AdvertLocation } from 'adverts'

export const createEmptyLocation = (): AdvertLocation => ({
    name: '',
    adress: '',
    zipCode: '',
    city: '',
    country: '',
})

export const normalizeLocations = (
    locations: Partial<AdvertLocation>[] | null
): AdvertLocation[] =>
    locations?.map((l) => ({
        name: l.name?.trim() ?? '',
        adress: l.adress?.trim() ?? '',
        zipCode: l.zipCode?.trim() ?? '',
        city: l.city?.trim() ?? '',
        country: l.country?.trim() ?? '',
    })) ?? []
