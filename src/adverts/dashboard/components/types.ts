import { ReactNode } from 'react'

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
