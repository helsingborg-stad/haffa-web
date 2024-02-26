import { Advert, AdvertFilterInput, AdvertInput } from 'adverts'
import { Category } from 'categories/types'
import { Func1, TreeAdapter } from 'lib/types'
import { ReactNode } from 'react'

export interface AdvertsTableContextType {
    adverts: Advert[]
    categories: Category[]
    categoryTree: TreeAdapter<Category>
    filter: AdvertFilterInput
    selected: Set<string>
    fields: Partial<Record<keyof Advert, { visible: boolean; label: string }>>
    setSelected: (selected: Set<string>) => void
    selectionMatches: (test: (a: Advert) => boolean) => boolean
    selectionCommonValue: <T>(
        getter: Func1<Advert, T>,
        defaultValue: T
    ) => { value: T; conflict: boolean }
    setFilter: (filter: AdvertFilterInput) => any
    patchAdverts: (patch: Partial<AdvertInput>) => any
    archiveAdverts: () => any
    unarchiveAdverts: () => any
}

export interface Column<T> {
    key: string
    label: string
    sortField?: keyof T
    getter: (item: T) => string | boolean | undefined
    header?: () => ReactNode
    cell?: (item: T) => ReactNode
}

export interface ColumnComponentFactory<T> {
    key: string
    header: () => ReactNode
    cell: (item: T) => ReactNode
}

export interface TableComponentFactory<T> {
    mapColumns: (columns: Column<T>[]) => ColumnComponentFactory<T>[]
}
