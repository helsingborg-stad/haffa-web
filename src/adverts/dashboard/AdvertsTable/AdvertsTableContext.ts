import { createNullTreeAdapter } from 'lib/tree-adapter'
import { createContext } from 'react'
import { AdvertsTableContextType } from './types'

const missing = (key: string) => (): never => {
    throw new Error(`AdvertstableContext:${key} is not implemented`)
}

export const AdvertsTableContext = createContext<AdvertsTableContextType>({
    adverts: [],
    paging: {
        totalCount: 0,
        pageIndex: 0,
        pageSize: 0,
        pageCount: 0,
    },
    categories: [],
    categoryTree: createNullTreeAdapter(),
    filter: {},
    selected: new Set<string>(),
    fields: {},
    setSelected: missing('setSelected'),
    selectionMatches: missing('selectionMatches'),
    selectionCommonValue: missing('selectionCommonValue'),
    setFilter: missing('setFilter'),
    patchAdverts: missing('patchAdverts'),
    archiveAdverts: missing('archiveAdverts'),
    unarchiveAdverts: missing('unarchiveAdverts'),
    createAdvertLabels: missing('createAdvertLabels'),
})
