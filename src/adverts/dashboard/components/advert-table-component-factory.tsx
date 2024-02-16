import { Advert, AdvertFilterInput } from 'adverts'
import { Func1 } from 'lib/types'
import { ReactNode } from 'react'
import { Column, TableComponentFactory } from './types'
import { SortableHeader } from './SortableHeader'

export const createAdvertTableComponentFactory: Func1<
    { filter: AdvertFilterInput; setFilter: (f: AdvertFilterInput) => void },
    TableComponentFactory<Advert>
> = ({ filter, setFilter }) => {
    const tryCreateSortableHeader: Func1<
        Column<Advert>,
        (() => ReactNode) | undefined
    > = ({ sortField, label }: Column<Advert>) =>
        sortField &&
        (() => (
            <SortableHeader
                field={sortField}
                label={label}
                filter={filter}
                setFilter={setFilter}
            />
        ))
    const createHeader: Func1<Column<Advert>, () => ReactNode> =
        ({ label }: Column<Advert>) =>
        () =>
            <span>{label}</span>

    return {
        mapColumns: (columns) =>
            columns.map((c) => ({
                key: c.key,
                header:
                    c.header || tryCreateSortableHeader(c) || createHeader(c),
                cell: c.cell || ((a) => <span>{c.getter(a)}</span>),
            })),
    }
}
