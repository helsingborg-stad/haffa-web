import {
    Advert,
    AdvertFilterInput,
    AdvertInput,
    AdvertListPaging,
} from 'adverts'
import { Category } from 'categories/types'
import { Func1, TreeAdapter } from 'lib/types'

export interface AdvertsTableContextType {
    adverts: Advert[]
    paging: AdvertListPaging
    categories: Category[]
    categoryTree: TreeAdapter<Category>
    filter: AdvertFilterInput
    selected: Array<string | number>
    fields: Partial<Record<keyof Advert, { visible: boolean; label: string }>>
    setSelected: (selected: Array<string | number>) => void
    selectionMatches: (test: (a: Advert) => boolean) => boolean
    selectionCommonValue: <T>(
        getter: Func1<Advert, T>,
        defaultValue: T
    ) => { value: T; conflict: boolean }
    setFilter: (filter: AdvertFilterInput) => any
    patchAdverts: (patch: Partial<AdvertInput>) => any
    archiveAdverts: () => any
    unarchiveAdverts: () => any
    createAdvertLabels: () => any
}

export interface AdvertTableRow {
    id: string
    image: string
    title: string
    category: string
    tags: string[]
    reference: string
    notes: string
    lendingPeriod: number
    isOverdue: boolean
    visitLink: string
    editLink: string
}
