import {
    Advert,
    AdvertFilterInput,
    AdvertInput,
    AdvertListPaging,
} from 'adverts'
import { Category } from 'categories/types'
import { Func1, TreeAdapter } from 'lib/types'
import { ReactElement } from 'react'
import { Terms } from 'terms/types'

export interface AdvertsTableContextType {
    adverts: Advert[]
    selectedAdverts: Advert[]
    paging: AdvertListPaging
    categories: Category[]
    categoryTree: TreeAdapter<Category>
    filter: AdvertFilterInput
    selected: Array<string | number>
    fields: Partial<Record<keyof Advert, { visible: boolean; label: string }>>
    terms: Terms
    setSelected: (selected: Array<string | number>) => void
    selectionMatches: (test: (a: Advert) => boolean) => boolean
    selectionCommonValue: <T>(
        getter: Func1<Advert, T>,
        defaultValue: T
    ) => { value: T; conflict: boolean }
    setFilter: (filter: AdvertFilterInput) => any
    patchAdverts: (patch: Partial<AdvertInput>) => any
    updateAdverts: (updater: (id: string) => Promise<any>) => any
    archiveAdverts: () => any
    unarchiveAdverts: () => any
    markAdvertsAsPicked: () => any
    markAdvertsAsUnpicked: () => any
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
    place: string
    lendingPeriod: number
    expectedReturnDate: string
    isOverdue: boolean
    isPicked: boolean
    visitLink: string
    editLink: string
}
export interface AdvertTableColumn {
    field: keyof AdvertTableRow
    align?: 'left' | 'right' | 'center'
    headerAlign?: 'left' | 'right' | 'center'
    type?: 'number' | 'string' | 'boolean'
    sortable?: boolean
    headerName?: string
    renderCell?: (value: any) => ReactElement
    valueGetter?: (value: any) => any
    width?: number
    height?: number
    minWidth?: number
    maxWidth?: number
}
