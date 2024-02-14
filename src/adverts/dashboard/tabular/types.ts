import { ReactNode } from 'react'

export interface TableHost<T> {
    header: (c: ColumnId<T>) => ReactNode
    cell: (item: T, c: ColumnId<T>) => ReactNode
    sortableHeader: (c: ColumnId<T>) => ReactNode
    image: (item: T, c: ColumnId<T>) => ReactNode
    markdown: (item: T, c: ColumnId<T>) => ReactNode
}

export interface ColumnId<T> {
    key: keyof T
    label: string
}

export interface Column<T> extends ColumnId<T> {
    headerComponent?: () => ReactNode
    cellComponent?: (item: T) => ReactNode
}
