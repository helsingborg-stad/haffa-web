import { createNullTreeAdapter } from 'lib/tree-adapter'
import { createContext } from 'react'
import { AdvertsTableContextType } from './types'

const missing = (key: string) => (): never => {
    throw new Error(`AdvertstableContext:${key} is not implemented`)
}

export const AdvertsTableContext = createContext<AdvertsTableContextType>({
    adverts: [],
    categories: [],
    categoryTree: createNullTreeAdapter(),
    filter: {},
    selected: new Set<string>(),
    setSelected: missing('setSelected'),
    selectionMatches: missing('selectionMatches'),
    selectionCommonValue: missing('selectionCommonValue'),
    setFilter: missing('setFilter'),
    patchAdverts: missing('patchAdverts'),
    archiveAdverts: missing('archiveAdverts'),
    unarchiveAdverts: missing('unarchiveAdverts'),
})
