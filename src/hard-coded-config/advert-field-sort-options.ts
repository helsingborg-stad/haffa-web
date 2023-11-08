import { PhraseContextType } from 'phrases'
import { AdvertFilterSortableFieldDescriptor } from './types'

export const getAdvertFieldSortOptions = (
    phrase: PhraseContextType['phrase']
): AdvertFilterSortableFieldDescriptor[] => [
    {
        label: phrase('SORT_OPTION_TITLE_ASC', 'A-Ö'),
        ascending: true,
        key: 'ta',
        sorting: { field: 'title', ascending: true },
    },
    {
        label: phrase('SORT_OPTION_TITLE_DESC', 'Ö-A'),
        ascending: false,
        key: 'td',
        sorting: { field: 'title', ascending: false },
    },
    {
        label: phrase('SORT_OPTION_CREATEDAT_ASC', 'Äldst'),
        ascending: true,
        key: 'ca',
        sorting: { field: 'createdAt', ascending: true },
    },
    {
        label: phrase('SORT_OPTION_CREATEDAT_DESC', 'Nyast'),
        ascending: false,
        key: 'cd',
        sorting: { field: 'createdAt', ascending: false },
    },
]
