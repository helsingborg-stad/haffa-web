export interface AdvertUserFields {
    title: string
    description: string
    quantity: number
    images: AdvertImage[]
    unit: string
    material: string
    condition: string
    usage: string

    location: AdvertLocation
    contact: AdvertContact
}

export interface IdFilterInput {
    ne?: string
    eq?: string
}
export interface StringFilterInput {
    ne?: string
    eq?: string
    gt?: string
    gte?: string
    lt?: string
    lte?: string
    contains?: string
}
export type FilterInput<T> = {
    ne?: T
    eq?: T
    gt?: T
    gte?: T
    lt?: T
    lte?: T
} & (T extends string ? { contains?: string } : Record<string, never>)

export type AdvertFieldsFilterInput = {
    id?: FilterInput<string>
} & {
    [Property in keyof Omit<AdvertUserFields, 'images'>]?: FilterInput<
        AdvertUserFields[Property]
    >
}

export interface AdvertRestrictionsFilterInput {
    canBeReserved?: boolean
    reservedByMe?: boolean
    createdByMe?: boolean
}

export interface AdvertSorting {
    field?: 'title' | 'createdAt'
    ascending?: boolean
}

export interface AdvertFilterInput {
    search?: string
    fields?: AdvertFieldsFilterInput
    restrictions?: AdvertRestrictionsFilterInput
    sorting?: AdvertSorting
}

export interface AdvertImage {
    url: string
}

export interface AdvertInput {
    title: string
    description: string
    quantity: number
    images: AdvertImage[]
    /* terms */
    unit: string
    material: string
    condition: string
    usage: string

    location: AdvertLocation
    contact: AdvertContact
}

export interface AdvertMeta {
    reservableQuantity: number
    canEdit: boolean
    canRemove: boolean
    canBook: boolean
    canReserve: boolean
    canCancelReservation: boolean
}

export interface AdvertLocation {
    adress: string
    zipCode: string
    city: string
    country: string
}

export interface AdvertContact {
    phone: string
    email: string
}

export interface Advert extends AdvertUserFields {
    meta: AdvertMeta
    id: string
    createdAt: string
}

export interface AdvertTerms {
    unit: string[]
    material: string[]
    condition: string[]
    usage: string[]
}

export interface AdvertMutationStatus {
    code: string
    message: string
    field: string
}

export interface AdvertMutationResult {
    status: AdvertMutationStatus | null
    advert: Advert
}

export interface AdvertsRepository {
    getTerms: () => Promise<AdvertTerms>
    getAdvert: (id: string) => Promise<Advert>
    listAdverts: (searchParams?: AdvertFilterInput) => Promise<Advert[]>
    createAdvert: (input: AdvertInput) => Promise<AdvertMutationResult>
    updateAdvert: (
        id: string,
        input: AdvertInput
    ) => Promise<AdvertMutationResult>
    removeAdvert: (id: string) => Promise<AdvertMutationResult>
    reserveAdvert: (
        id: string,
        quantity: number
    ) => Promise<AdvertMutationResult>
    cancelAdvertReservation: (id: string) => Promise<AdvertMutationResult>
}
