import { GridRowSelectionModel } from '@mui/x-data-grid'
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
    selected: GridRowSelectionModel
    fields: Partial<Record<keyof Advert, { visible: boolean; label: string }>>
    setSelected: (selected: GridRowSelectionModel) => void
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
