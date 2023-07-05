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
export interface FilterAdvertsInput {
    id?: IdFilterInput
    title?: StringFilterInput
    description?: StringFilterInput
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
}

export interface AdvertsSearchParams {
    search: string
}

export interface AdvertMeta {
    canEdit: boolean
    canDelete: boolean
    canBook: boolean
    canReserve: boolean
    canCancelReservation: boolean
}

export interface Advert {
    meta: AdvertMeta
    id: string
    title: string
    description: string
    quantity: number
    images: AdvertImage[]

    unit: string
    material: string
    condition: string
    usage: string
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
    listAdverts: (searchParams?: AdvertsSearchParams) => Promise<Advert[]>
    createAdvert: (input: AdvertInput) => Promise<AdvertMutationResult>
    updateAdvert: (
        id: string,
        input: AdvertInput
    ) => Promise<AdvertMutationResult>
    reserveAdvert: (
        id: string,
        quantity: number
    ) => Promise<AdvertMutationResult>
    cancelAdvertReservation: (id: string) => Promise<AdvertMutationResult>
}
