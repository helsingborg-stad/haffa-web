import { createNullTreeAdapter } from 'lib/tree-adapter'
import { createContext } from 'react'
import { createEmptyTerms } from 'terms'
import { AdvertsTableContextType } from './types'

const missing = (key: string) => (): never => {
    throw new Error(`AdvertstableContext:${key} is not implemented`)
}

export const AdvertsTableContext = createContext<AdvertsTableContextType>({
    adverts: [],
    selectedAdverts: [],
    paging: {
        totalCount: 0,
        pageIndex: 0,
        pageSize: 0,
        pageCount: 0,
    },
    categories: [],
    categoryTree: createNullTreeAdapter(),
    filter: {},
    selected: [],
    fields: {},
    terms: createEmptyTerms(),
    setSelected: missing('setSelected'),
    selectionMatches: missing('selectionMatches'),
    selectionCommonValue: missing('selectionCommonValue'),
    setFilter: missing('setFilter'),
    patchAdverts: missing('patchAdverts'),
    updateAdverts: missing('updateAdverts'),
    archiveAdverts: missing('archiveAdverts'),
    unarchiveAdverts: missing('unarchiveAdverts'),
    markAdvertsAsPicked: missing('markAdvertsAsPicked'),
    markAdvertsAsUnpicked: missing('markAdvertsAsUnpicked'),
    createAdvertLabels: missing('createAdvertLabels'),
})
