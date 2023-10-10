import { AdvertContact, AdvertInput, AdvertLocation } from '../types'

const toInt = (v: any): number => parseInt(v, 10)

export const createEmptyAdvertInput = (): AdvertInput => ({
    title: '',
    description: '',
    quantity: 1,
    images: [],
    unit: '',
    material: '',
    condition: '',
    usage: '',
    category: '',
    reference: '',
    location: createEmptyAdvertLocation(),
    contact: createEmptyAdvertContact(),
})

export const createEmptyAdvertLocation = (): AdvertLocation => ({
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
        unit,
        material,
        condition,
        usage,
        category,
        reference,
        location,
        contact,
    }: AdvertInput = createEmptyAdvertInput()
): AdvertInput => ({
    ...createEmptyAdvertInput(),
    title,
    description,
    quantity: toInt(quantity),
    images,
    unit,
    material,
    condition,
    usage,
    category,
    reference,
    location: sanitizeAdvertLocation(location),
    contact: sanitizeAdvertContact(contact),
})

export const sanitizeAdvertLocation = (
    {
        adress,
        zipCode,
        city,
        country,
    }: AdvertLocation = createEmptyAdvertLocation()
): AdvertLocation => ({
    ...createEmptyAdvertLocation(),
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
