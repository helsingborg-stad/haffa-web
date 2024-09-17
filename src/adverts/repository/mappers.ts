import { AdvertContact, AdvertInput, AdvertLocation } from '../types'

const toInt = (v: any): number => parseInt(v, 10)

export const createEmptyAdvertInput = (): AdvertInput => ({
    title: '',
    description: '',
    quantity: 1,
    lendingPeriod: 0,
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
    isStockItem: false,
    tags: [],
    location: createEmptyAdvertLocation(),
    contact: createEmptyAdvertContact(),
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
        isStockItem,
        tags,
        location,
        contact,
    }: AdvertInput = createEmptyAdvertInput()
): AdvertInput => ({
    ...createEmptyAdvertInput(),
    title,
    description,
    quantity: toInt(quantity),
    lendingPeriod: toInt(lendingPeriod),
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
    isStockItem,
    tags,
    location: sanitizeAdvertLocation(location),
    contact: sanitizeAdvertContact(contact),
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
