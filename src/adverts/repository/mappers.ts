import type { AdvertContact, AdvertInput, AdvertLocation } from '../types'

const toInt = (v: any, fallback = 0): number => {
    const parsed = parseInt(v, 10)
    return Number.isFinite(parsed) ? parsed : fallback
}

export const createEmptyAdvertInput = (): AdvertInput => ({
    title: '',
    description: '',
    quantity: 1,
    lendingPeriod: 0,
    co2kg: 0,
    valueByUnit: 0,
    images: [],
    unit: '',
    width: '',
    height: '',
    depth: '',
    weight: '',
    size: '',
    material: '',
    condition: '',
    usage: '',
    category: '',
    reference: '',
    notes: '',
    tags: [],
    location: createEmptyAdvertLocation(),
    contact: createEmptyAdvertContact(),
    place: '',
})

export const createEmptyAdvertLocation = (): AdvertLocation => ({
    name: '',
    adress: '',
    zipCode: '',
    city: '',
    country: '',
})

export const createEmptyAdvertContact = (): AdvertContact => ({
    email: '',
    phone: '',
    organization: '',
})

// eslint-disable-next-line no-undef
export const sanitizeAdvertInput = (
    {
        title,
        description,
        images,
        quantity,
        lendingPeriod,
        co2kg,
        valueByUnit,
        unit,
        width,
        height,
        depth,
        weight,
        size,
        material,
        condition,
        usage,
        category,
        reference,
        notes,
        tags,
        location,
        contact,
        place,
    }: AdvertInput = createEmptyAdvertInput()
): AdvertInput => ({
    ...createEmptyAdvertInput(),
    title,
    description,
    quantity: toInt(quantity, 1),
    lendingPeriod: toInt(lendingPeriod, 0),
    co2kg: toInt(co2kg, 0),
    valueByUnit: toInt(valueByUnit, 0),
    images,
    unit,
    width,
    height,
    depth,
    weight,
    size,
    material,
    condition,
    usage,
    category,
    reference,
    notes,
    tags,
    location: sanitizeAdvertLocation(location),
    contact: sanitizeAdvertContact(contact),
    place,
})

export const sanitizeAdvertLocation = (
    {
        name,
        adress,
        zipCode,
        city,
        country,
    }: AdvertLocation = createEmptyAdvertLocation()
): AdvertLocation => ({
    ...createEmptyAdvertLocation(),
    name,
    adress,
    zipCode,
    city,
    country,
})

export const sanitizeAdvertContact = (
    { email, phone, organization }: AdvertContact = createEmptyAdvertContact()
): AdvertContact => ({
    ...createEmptyAdvertContact(),
    email,
    phone,
    organization,
})
