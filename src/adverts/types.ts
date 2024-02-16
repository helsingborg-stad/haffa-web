import { Category, CategoryFlat } from 'categories/types'

export interface AdvertUserFields {
    title: string
    description: string
    quantity: number
    lendingPeriod: number
    images: AdvertImage[]
    unit: string
    width: string
    height: string
    depth: string
    weight: string
    size: string
    material: string
    condition: string
    usage: string
    category: string
    reference: string
    notes: string
    tags: string[]

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
    in?: T[]
} & (T extends string ? { contains?: string } : Record<string, never>)

type Flatten<Type> = Type extends Array<infer Item> ? Item : Type

export type AdvertFieldsFilterInput = {
    id?: FilterInput<string>
} & {
    [Property in keyof Omit<AdvertUserFields, 'images'>]?: FilterInput<
        Flatten<AdvertUserFields[Property]>
    >
}
export interface AdvertRestrictionsFilterInput {
    canBeReserved?: boolean
    reservedByMe?: boolean
    createdByMe?: boolean
    isArchived?: boolean
    hasReservations?: boolean
    hasCollects?: boolean
}

export interface AdvertSorting {
    // field?: 'title' | 'createdAt'
    field?: keyof Advert
    ascending?: boolean
}

export interface AdvertFilterInputPaging {
    pageIndex: number
    pageSize: number
}

export interface AdvertFilterInput {
    search?: string
    fields?: AdvertFieldsFilterInput
    restrictions?: AdvertRestrictionsFilterInput
    sorting?: AdvertSorting
    paging?: AdvertFilterInputPaging
}

export interface AdvertImage {
    url: string
}

export interface AdvertInput {
    title: string
    description: string
    quantity: number
    lendingPeriod: number
    images: AdvertImage[]
    /* terms */
    unit: string
    width: string
    height: string
    depth: string
    weight: string
    size: string
    material: string
    condition: string
    usage: string
    category: string
    reference: string
    notes: string
    tags: string[]
    location: AdvertLocation
    contact: AdvertContact
}

export enum AdvertClaimType {
    reserved = 'reserved',
    collected = 'collected',
}

export interface AdvertClaim {
    quantity: number
    by: string
    at: string
    type: AdvertClaimType
    canCancel: boolean
    canConvert: boolean
    isOverdue: Boolean
}
export interface AdvertMeta {
    reservableQuantity: number
    collectableQuantity: number
    isMine: boolean
    canEdit: boolean
    canArchive: boolean
    canUnarchive: boolean
    canRemove: boolean
    canBook: boolean
    canReserve: boolean
    canCancelReservation: boolean
    canCollect: boolean
    canManageClaims: boolean
    canReturn: boolean
    reservedyMe: number
    collectedByMe: number
    claims: AdvertClaim[]
}

export enum AdvertType {
    recycle = 'recycle',
    borrow = 'borrow',
}

export interface AdvertLocation {
    name: string
    adress: string
    zipCode: string
    city: string
    country: string
}

export interface AdvertContact {
    phone: string
    email: string
    organization: string
}

export interface Advert extends AdvertUserFields {
    meta: AdvertMeta
    id: string
    type: AdvertType
    createdAt: string
}

export interface AdvertMutationStatus {
    code: string
    message: string
    field: string
}

export interface AdvertMutationResultFlat {
    status: AdvertMutationStatus | null
    advert: Advert
    categories: CategoryFlat[]
}

export interface AdvertMutationResult {
    status: AdvertMutationStatus | null
    advert: Advert
}

export interface AdvertListPaging {
    totalCount: number
    pageIndex: number
    pageSize: number
    pageCount: number
}

export interface AdvertList {
    adverts: Advert[]
    categories: Category[]
    paging: AdvertListPaging
}

export interface AdvertListFlat {
    adverts: Advert[]
    categories: CategoryFlat[]
    paging: AdvertListPaging
}

export interface AdvertsRepository {
    getAdvert: (id: string) => Promise<Advert>
    listAdverts: (
        searchParams?: AdvertFilterInput,
        init?: Pick<RequestInit, 'signal'>
    ) => Promise<AdvertList>
    createAdvert: (input: AdvertInput) => Promise<AdvertMutationResult>
    updateAdvert: (
        id: string,
        input: AdvertInput
    ) => Promise<AdvertMutationResult>
    removeAdvert: (id: string) => Promise<AdvertMutationResult>
    archiveAdvert: (id: string) => Promise<AdvertMutationResult>
    unarchiveAdvert: (id: string) => Promise<AdvertMutationResult>
    reserveAdvert: (
        id: string,
        quantity: number
    ) => Promise<AdvertMutationResult>
    cancelAdvertReservation: (id: string) => Promise<AdvertMutationResult>
    collectAdvert: (
        id: string,
        quantity: number
    ) => Promise<AdvertMutationResult>
    cancelAdvertClaim: (
        id: string,
        claim: AdvertClaim
    ) => Promise<AdvertMutationResult>
    convertAdvertClaim: (
        id: string,
        claim: AdvertClaim,
        newType: AdvertClaimType
    ) => Promise<AdvertMutationResult>
    returnAdvert: (id: string) => Promise<AdvertMutationResult>
}
